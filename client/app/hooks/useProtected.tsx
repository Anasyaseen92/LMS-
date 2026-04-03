import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useLazyRefreshtokenQuery,
  useLoadUserQuery,
} from "../../redux/features/api/apiSlice";
import { RootState } from "../../redux/store";
interface ProtectedProps {
  children: ReactNode;
}

const useProtected = ({ children }: ProtectedProps) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const attemptedRefreshRef = useRef(false);
  const { isLoading, isFetching, error, refetch } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [refreshSession, { isLoading: isRefreshing }] = useLazyRefreshtokenQuery();

  useEffect(() => {
    const recoverSession = async () => {
      if (attemptedRefreshRef.current || user || !error) {
        return;
      }
      attemptedRefreshRef.current = true;
      try {
        await refreshSession(undefined).unwrap();
        await refetch();
      } catch {
        router.replace("/");
      }
    };
    void recoverSession();
  }, [error, user, refreshSession, refetch, router]);

  useEffect(() => {
    if (!isLoading && !isFetching && !isRefreshing && !user && attemptedRefreshRef.current) {
      router.replace("/");
    }
  }, [isLoading, isFetching, isRefreshing, user, router]);

  if (isLoading || isFetching || isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default useProtected;

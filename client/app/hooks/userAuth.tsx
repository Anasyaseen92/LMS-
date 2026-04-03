import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function useAuth() {
  const { user } = useSelector((state: RootState) => state.auth);
  if (user) {
    return true;
  } else {
    return false;
  }
}

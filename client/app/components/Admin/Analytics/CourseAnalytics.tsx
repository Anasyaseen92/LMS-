import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

type AnalyticsItem = {
  month: string;
  count: number;
};

type AnalyticsResponse = {
  courses?: {
    last12Months?: AnalyticsItem[];
  };
};

type ChartPoint = {
  name: string;
  uv: number;
};

const CourseAnalytics = () => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({}) as {
    data?: AnalyticsResponse;
    isLoading: boolean;
  };

  const analyticsData: ChartPoint[] =
    data?.courses?.last12Months?.map((item) => ({
      name: item.month,
      uv: item.count,
    })) || [];

  const maxValue = Math.max(...analyticsData.map((item) => item.uv), 0);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${styles.title} px-5 !text-start`}>
              Courses Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              Last 12 months analytics data{" "}
            </p>
          </div>

          <div className="w-full px-5 py-10">
            <div className="flex min-h-[420px] items-end gap-4 overflow-x-auto rounded-lg border border-[#ffffff1a] bg-[#ffffff08] p-6">
              {analyticsData.length === 0 ? (
                <div className="w-full text-center text-black dark:text-white">
                  No analytics data available.
                </div>
              ) : (
                analyticsData.map((item) => {
                  const barHeight = maxValue > 0 ? `${(item.uv / maxValue) * 100}%` : "0%";

                  return (
                    <div
                      key={item.name}
                      className="flex min-w-[90px] flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-2 text-sm font-[500] text-black dark:text-white">
                        {item.uv}
                      </span>
                      <div className="flex h-[280px] w-full items-end justify-center rounded-t-md bg-[#ffffff12] px-2">
                        <div
                          className="w-full rounded-t-md bg-[#3faf82] transition-all duration-300"
                          style={{ height: barHeight }}
                        />
                      </div>
                      <span className="mt-3 text-center text-sm text-black dark:text-white">
                        {item.name}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;

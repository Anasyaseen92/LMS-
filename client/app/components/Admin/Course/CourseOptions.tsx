import { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";
type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Data",
    "Course Content",
    "Course Preview",
  ];

  return (
    <div className="w-full rounded-sm bg-transparent px-2">
      {options.map((option, index) => (
        <div
          key={index}
          className="flex w-full cursor-pointer items-start gap-3 py-4"
          onClick={() => setActive(index)}
        >
          <div
            className="relative flex shrink-0 flex-col items-center"
          >
            <div
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${
                active >= index ? "bg-blue-500" : "bg-[#384766]"
              }`}
            >
              <IoMdCheckmark className="text-[20px] text-white" />
            </div>
            {index !== options.length - 1 && (
              <div
                className={`mt-2 h-[38px] w-[2px] ${
                  active > index ? "bg-blue-500" : "bg-[#384766]"
                }`}
              />
            )}
          </div>
          <h5 className="pt-1 text-[18px] font-[500] text-white">{option}</h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;

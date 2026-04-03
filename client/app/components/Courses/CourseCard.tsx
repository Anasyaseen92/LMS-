import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { BiMessage } from "react-icons/bi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface CourseData {
  // Define the structure of courseData items here
  // For example:
  title: string;
  // ... other properties
}

interface Review {
  // Define the structure of review items here
  // For example:
  rating: number;
  comment: string;
  // ... other properties
}

interface Course {
  _id: string;
  name: string;
  thumbnail: {
    url: string;
  };
  courseData: CourseData[];
  price: number;
  estimatedPrice: number;
  reviews: Review[];
}

interface Props {
  item: Course;
  isProfile?: boolean;
}

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <Link href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}>
      <div className="w-full h-full dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm">
        <Image
          src={item.thumbnail.url}
          width={500}
          height={300}
          objectFit="contain"
          className="rounded w-full"
          alt=""
        />
        <br />
        <h1 className="font-Poppins text-[16px] text-black dark:text-[#fff]">
          {item.name}
        </h1>
        <div className="w-full flex items-center justify-between pt-2">
          <div className="flex items-center">
            <AiFillStar className="text-yellow-500" />
            <AiFillStar className="text-yellow-500" />
            <AiFillStar className="text-yellow-500" />
            <AiFillStar className="text-yellow-500" />
            <AiOutlineStar className="text-yellow-500" />
          </div>
          <h5 className="text-black dark:text-[#fff]">{item.courseData?.length} Lectures</h5>
        </div>
        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex">
            <h3 className="text-black dark:text-[#fff]">
              {item.price === 0 ? "Free" : item.price + "$"}
            </h3>
            <h5 className="pl-3 text-[14px] mt-[-5px] line-through opacity-80 text-black dark:text-[#fff]">
              {item.estimatedPrice}$
            </h5>
          </div>
          <div className="flex items-center pb-3">
            <BiMessage size={20} className="dark:text-[#fff] text-black" />
            <p className="pl-2 text-black dark:text-[#fff]">
              {item.reviews.length} Reviews
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

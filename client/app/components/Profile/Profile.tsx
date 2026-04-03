"use client";
import { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Courses/CourseCard";

interface CourseData {
  title: string;
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
  user: {
    name: string;
    avatar: {
      url: string;
    };
    email: string;
  };
}

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar] = useState(user?.avatar ? user.avatar.url : null);
  const [active, setActive] = useState(1);
  const courses: Course[] = [];
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logOutHandler = async () => {
    setLogout(true);
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }, []);

  return (
  <div className="w-full flex justify-center mt-[90px] mb-[40px]">
    <div className="w-[85%] flex mx-auto">
      {/* Sidebar */}
      <div
        className={`w-[280px] 800px:w-[290px] shrink-0 h-fit 800px:h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] shadow-sm sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } my-[20px] self-start`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>

      {/* Content */}
      <div className="w-full h-full bg-transparent mt-[80px]">
        {active === 1 && <ProfileInfo avatar={avatar} user={user} />}
        {active === 2 && <ChangePassword />}
        {active === 3 && (
          <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8">
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px]">
              {courses &&
                courses.map((item: Course, index: number) => (
                  <CourseCard item={item} key={index} isProfile={true} />
                ))}
            </div>
            {courses.length === 0 && (
              <h1 className="text-center text-[18px] font-Poppins">
                You dont have any purchased courses!
              </h1>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default Profile;

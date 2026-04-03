import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "../../../../redux/features/courses/courseApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

interface CourseLink {
  title: string;
  url: string;
}

interface CourseContentItem {
  videoUrl: string;
  title: string;
  description: string;
  videoLength: string;
  videoSection: string;
  links: CourseLink[];
  suggestion?: string;
}

interface CourseInfo {
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  categories: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail?: string;
}

interface CourseData {
  name: string;
  title: string;
  description: string;
  price: number;
  estimatedPrice: number;
  categories: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail?: string;
  totalVideos: number;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseData?: CourseContentItem[];
}


const CreateCourse = () => {
  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    categories: "Uncategorized",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState<{ title: string }[]>([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState<{ title: string }[]>([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState<CourseContentItem[]>([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoLength: "",
      videoSection: "untitled Section",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = useState<CourseData>({
    name: "",
    title: "",
    description: "",
    price: 0,
    estimatedPrice: 0,
    categories: "Uncategorized",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
    totalVideos: 0,
    benefits: [],
    prerequisites: [],
    courseData: [],
  });
  const [
    createCourse,
    { isSuccess, error, isLoading },
  ] = useCreateCourseMutation();
//Submits the course data to the API 
  const handleCourseCreate = async () => {
    if (!isLoading) {
      await createCourse(courseData);
    }
  };
  // Handling success and error notifications
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Created Successfully!");
      redirect("/admin/all-course");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as { data: { message: string } };
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);
    // Formating all course input data into Object
  const handleSubmit = async () => {
    //format benfits array
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    //format prerequisites array
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));
    //format course content Array
    const formattedCourseContentData = courseContentData.map((content) => ({
      videoUrl: content.videoUrl,
      title: content.title,
      description: content.description,
      videoLength: content.videoLength,
      videoSection: content.videoSection,
      links: content.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),
      suggestion: content.suggestion,
    }));
    //Prepare our data object
    const data: CourseData = {
      name: courseInfo.name,
      title: courseInfo.name, // Use course name as title
      description: courseInfo.description,
      price: Number(courseInfo.price),
      estimatedPrice: Number(courseInfo.estimatedPrice),
      categories: courseInfo.categories || "Uncategorized",
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };
    setCourseData(data);
  };

  return (
    <div className="w-full px-6 pb-10 pt-24 lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-8 xl:gap-10">
      <div className="w-full min-w-0">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            active={active}
            setActive={setActive}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
            active={active}
            setActive={setActive}
          />
        )}
      </div>
      <div className="mt-8 w-full lg:sticky lg:top-28 lg:mt-24 lg:w-[260px] lg:self-start">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default CreateCourse;

import React, { FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCourseQuery,
} from "../../../../redux/features/courses/courseApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {
  id: string;
};

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

interface CoursePayload {
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

interface Course {
  _id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  estimatedPrice: number;
  categories: string;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseData: CourseContentItem[];
  thumbnail?: {
    url?: string;
  } | string;
}

type CoursesResponse = {
  courses: Course[];
};

type ApiError = {
  data?: {
    message?: string;
  };
};

const EditCourse: FC<Props> = ({ id }) => {
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
  const [courseData, setCourseData] = useState<CoursePayload>({
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
  const [editCourse, { isSuccess, error }] = useEditCourseMutation();
  const { isLoading, data } = useGetAllCourseQuery(
    {},
    { refetchOnMountOrArgChange: true }
  ) as {
    isLoading: boolean;
    data?: CoursesResponse;
  };

  const editCourseData = data?.courses.find((course) => course._id === id);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully");
      redirect("/admin/courses");
    }
    if (error) {
      const errorMessage = (error as ApiError).data?.message || "Failed to update course";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (editCourseData) {
      const syncFormState = window.setTimeout(() => {
        setCourseInfo({
          name: editCourseData.name,
          description: editCourseData.description,
          price: String(editCourseData.price ?? ""),
          estimatedPrice: String(editCourseData.estimatedPrice ?? ""),
          tags: editCourseData.tags,
          level: editCourseData.level,
          categories: editCourseData.categories || "Uncategorized",
          demoUrl: editCourseData.demoUrl,
          thumbnail:
            typeof editCourseData.thumbnail === "string"
              ? editCourseData.thumbnail
              : editCourseData.thumbnail?.url || "",
        });
        setBenefits(editCourseData.benefits);
        setPrerequisites(editCourseData.prerequisites);
        setCourseContentData(editCourseData.courseData);
      }, 0);

      return () => window.clearTimeout(syncFormState);
    }
  }, [editCourseData]);

  const handleCourseCreate = async () => {
    if (!isLoading && editCourseData) {
      await editCourse({ id: editCourseData._id, data: courseData });
    }
  };

  const handleSubmit = () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));
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

    const formattedData: CoursePayload = {
      name: courseInfo.name,
      title: courseInfo.name,
      description: courseInfo.description,
      price: Number(courseInfo.price),
      categories: courseInfo.categories || "Uncategorized",
      estimatedPrice: Number(courseInfo.estimatedPrice),
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };

    setCourseData(formattedData);
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
            isEdit={true}
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

export default EditCourse;

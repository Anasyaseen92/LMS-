import { styles } from "../../../styles/style";
import React, { FC, useState } from "react";

interface CourseInfo {
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  tags: string;
  categories: string;
  level: string;
  demoUrl: string;
  thumbnail?: string;
}

type Props = {
  courseInfo: CourseInfo;
  setCourseInfo: React.Dispatch<React.SetStateAction<CourseInfo>>;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  active,
  setActive,
  setCourseInfo,
}) => {
  const [dragging, setDragging] = useState(false);

  // Handles form submission, moves to the next step
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActive(active + 1);
  };

  // Handles image file selection and sets thumbnail preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Triggered when file is dragged over drop area
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  // Triggered when drag leaves the drop area
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  // Handles drop event for thumbnail upload
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-15 800px:mt-24">
      <form onSubmit={handleSubmit}>
        {/* Course name input */}
        <div>
          <label htmlFor="" className={`${styles.label}`}>
            Course Name
          </label>
          <input
            type="name"
            name=""
            required
            value={courseInfo.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="MERN stack LMS platform with next 13"
            className={`${styles.input}`}
          />
        </div>
        <br />

        {/* Course description input */}
        <div className="mb-5">
          <label className={`${styles.label}`}>Course Description</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="Write something amazing..."
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />

        {/* Price and Estimated Price inputs */}
        <div className="w-full flex  justify-between">
          <div className="w-[45%]">
            <label htmlFor="" className={`${styles.label}`}>
              Course Price
            </label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="29"
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="" className={`${styles.label}`}>
              Estimated Price
            </label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.estimatedPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="price"
              placeholder="79"
              className={`${styles.input}`}
            />
          </div>
        </div>
        <br />

        <div className="w-full">
          <label htmlFor="" className={`${styles.label}`}>
            Course Tags
          </label>
          <input
            type="name"
            name=""
            required
            value={courseInfo.tags}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
            id="name"
            placeholder="MERN,Next 13,Socket io,tailwind css,LMS"
            className={`${styles.input}`}
          />
        </div>
        <br />
        {/* Level and Demo URL inputs */}
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Course Level</label>
            <input
              type="text"
              name=""
              value={courseInfo.level}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              id="level"
              placeholder="Beginner/Intermediate/Expert"
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>Demo Url</label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.demoUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              id="demoUrl"
              placeholder="eer74fd"
              className={`${styles.input}`}
            />
          </div>
        </div>
        <br />

        {/* Thumbnail upload via file input or drag-and-drop */}
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            htmlFor="file"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt=""
                className="max-h-full object-cover w-full"
              />
            ) : (
              <span>Drag and Drop Your Thumbnail here or click to Browse</span>
            )}
          </label>
        </div>
        <br />

        {/* Submit button to go to next step */}
        <div className="w-full flex items-center justify-end">
          <input
            type="submit"
            value="Next"
            className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;

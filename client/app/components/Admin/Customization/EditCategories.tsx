import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { IoMdAddCircleOutline } from "react-icons/io";

type Category = {
  _id?: string;
  title: string;
};

type LayoutResponse = {
  layout?: {
    categories?: Category[];
  };
};

type ApiError = {
  data?: {
    message?: string;
  };
};

const EditCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  }) as {
    data?: LayoutResponse;
    isLoading: boolean;
    refetch: () => void;
  };
  const [
    editLayout,
    { isSuccess: layoutSuccess, error },
  ] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      const syncCategoriesState = window.setTimeout(() => {
        setCategories(data.layout?.categories || []);
      }, 0);

      return () => window.clearTimeout(syncCategoriesState);
    }
    if (layoutSuccess) {
      refetch();
      toast.success("Categories Updated Successfully!");
    }
    if (error) {
      const errorData = error as ApiError;
      toast.error(errorData.data?.message || "Failed to update categories");
    }
  }, [data, layoutSuccess, error, refetch]);

  const handleCategoriesAdd = (id: string | undefined, value: string) => {
    setCategories((prevCategory) =>
      prevCategory.map((item) => (item._id === id ? { ...item, title: value } : item))
    );
  };

  const newCategoriesHandler = () => {
    if (categories.length > 0 && categories[categories.length - 1].title === "") {
      toast.error("Category Title cannot be Empty!");
    } else {
      setCategories((prevCategories) => [
        ...prevCategories,
        { _id: `new-${crypto.randomUUID()}`, title: "" },
      ]);
    }
  };

  const areCategoriesUnchanged = (original: Category[] = [], current: Category[] = []) => {
    if (!original || !current) return true;
    return JSON.stringify(original) === JSON.stringify(current);
  };

  const isAnyCategoryTitleEmpty = (items: Category[]) => {
    return items.some((cat) => cat.title === "");
  };

  const currentCategories = data?.layout?.categories || [];

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(currentCategories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories.map((item, index: number) => {
            return (
              <div className="p-3" key={item._id || index}>
                <div className="flex items-center w-full justify-center">
                  <input
                    className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                    value={item.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCategoriesAdd(item._id, e.target.value)
                    }
                    placeholder="Enter category title..."
                  />
                  <AiOutlineDelete
                    className="dark:text-white text-black text-[18px] cursor-pointer"
                    onClick={() => {
                      setCategories((prevCategory) =>
                        prevCategory.filter((currentItem) => currentItem._id !== item._id)
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}

          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
                ${
                  areCategoriesUnchanged(currentCategories, categories) ||
                  isAnyCategoryTitleEmpty(categories)
                    ? "!cursor-not-allowed"
                    : "!cursor-pointer !bg-[#42d383]"
                }
                !rounded absolute bottom-12 right-12`}
            onClick={
              areCategoriesUnchanged(currentCategories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;

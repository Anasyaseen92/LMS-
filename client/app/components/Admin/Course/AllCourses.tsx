"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCourseMutation,
  useGetAllCourseQuery,
} from "@/redux/features/courses/courseApi";
import Loader from "../../Loader/Loader";

import { format } from "timeago.js";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";

type Course = {
  _id: string;
  name: string;
  ratings: number;
  purchased: number;
  createdAt: string;
};

type CoursesResponse = {
  courses: Course[];
};

type ApiError = {
  data?: {
    message?: string;
  };
};

const AllCourses = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCourseQuery(
    {},
    { refetchOnMountOrArgChange: true }
  ) as {
    isLoading: boolean;
    data?: CoursesResponse;
    refetch: () => void;
  };
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});
  const rows = data?.courses || [];
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Course Deleted Successfully");
    }
    if (error) {
      const errorMessage = error as ApiError;
      if (errorMessage.data?.message) {
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    try {
      await deleteCourse(courseId).unwrap();
      setOpen(false);
    } catch (deleteError) {
      const errorMessage = deleteError as ApiError;
      toast.error(errorMessage.data?.message || "Failed to delete course");
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px]">
          <Box m="20px">
            <Box
              m="40px 0 0 0"
              sx={{
                border:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: theme === "dark" ? "#1a1b2e" : "#ffffff",
              }}
            >
              <TableContainer sx={{ maxHeight: "80vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                          color: theme === "dark" ? "#fff" : "#000",
                          fontWeight: 600,
                        }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                          color: theme === "dark" ? "#fff" : "#000",
                          fontWeight: 600,
                        }}
                      >
                        Course Title
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                          color: theme === "dark" ? "#fff" : "#000",
                          fontWeight: 600,
                        }}
                      >
                        Ratings
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                          color: theme === "dark" ? "#fff" : "#000",
                          fontWeight: 600,
                        }}
                      >
                        Purchased
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                          color: theme === "dark" ? "#fff" : "#000",
                          fontWeight: 600,
                        }}
                      >
                        Created At
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                          color: theme === "dark" ? "#fff" : "#000",
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                          color: theme === "dark" ? "#fff" : "#000",
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((course) => (
                      <TableRow
                        key={course._id}
                        hover
                        sx={{
                          backgroundColor:
                            theme === "dark" ? "#1e2134" : "#fff",
                        }}
                      >
                        <TableCell
                          sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                        >
                          {course._id}
                        </TableCell>
                        <TableCell
                          sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                        >
                          {course.name}
                        </TableCell>
                        <TableCell
                          sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                        >
                          {course.ratings}
                        </TableCell>
                        <TableCell
                          sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                        >
                          {course.purchased}
                        </TableCell>
                        <TableCell
                          sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                        >
                          {format(course.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          <Link href={`/admin/edit-course/${course._id}`}>
                            <FiEdit2
                              className="dark:text-white text-black"
                              size={20}
                            />
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            onClick={() => {
                              setOpen(true);
                              setCourseId(course._id);
                            }}
                          >
                            <AiOutlineDelete
                              className="dark:text-white text-black"
                              size={20}
                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {open && (
              <Modal
                open={open}
                onClose={() => setOpen(!open)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                  <h1 className={`${styles.title}`}>
                    Are you sure you want to delete this course?
                  </h1>
                  <div className="flex w-full items-center justify-between mb-6 mt-4">
                    <div
                      className={`${styles.button} !w-[120px] h-[30px] bg-[#47d097]`}
                      onClick={() => setOpen(!open)}
                    >
                      Cancel
                    </div>
                    <div
                      className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                      onClick={handleDelete}
                    >
                      Delete
                    </div>
                  </div>
                </Box>
              </Modal>
            )}
          </Box>
        </div>
      )}
    </>
  );
};

export default AllCourses;

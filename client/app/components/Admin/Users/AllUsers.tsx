"use client";
import React, { FC, useEffect, useState } from "react";
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
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

type Props = {
  isTeam?: boolean;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  courses?: unknown[];
};

type UsersResponse = {
  users: User[];
};

type ApiError = {
  data?: {
    message?: string;
  };
};

const tableColumns = [
  { key: "id", label: "ID", align: "left" as const, width: "190px" },
  { key: "name", label: "Name", align: "left" as const, width: "200px" },
  { key: "email", label: "Email", align: "left" as const, width: "230px" },
  { key: "role", label: "Role", align: "left" as const, width: "100px" },
  { key: "courses", label: "Courses", align: "left" as const, width: "110px" },
  { key: "joinedAt", label: "Joined", align: "left" as const, width: "150px" },
  { key: "mailAction", label: "Mail", align: "center" as const, width: "70px" },
  { key: "deleteAction", label: "Delete", align: "center" as const, width: "80px" },
];

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [userId, setUserId] = useState("");

  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  ) as {
    isLoading: boolean;
    data?: UsersResponse;
    refetch: () => void;
  };
  const [
    updateUserRole,
    { error: updateUserRoleError, isSuccess },
  ] = useUpdateUserRoleMutation();
  const [
    deleteUser,
    { isSuccess: deleteSuccess, error: deleteError },
  ] = useDeleteUserMutation({});
  useEffect(() => {
    if (updateUserRoleError) {
      const errorData = updateUserRoleError as ApiError;
      if (errorData.data?.message) {
        toast.error(errorData.data.message);
      }
    }

    if (isSuccess) {
      toast.success("User role updated successfully");
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Delete user successfully!");
    }
    if (deleteError) {
      const errorMessage = deleteError as ApiError;
      if (errorMessage.data?.message) {
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, updateUserRoleError, deleteError, deleteSuccess, refetch]);

  const handleSubmit = async () => {
    const userToUpdate =
      data && data.users
        ? data.users.find((user) => user.email === email)
        : undefined;

    if (userToUpdate) {
      try {
        await updateUserRole({ id: userToUpdate._id, role }).unwrap();
        setActive(false);
      } catch (updateError) {
        const errorMessage = updateError as ApiError;
        toast.error(errorMessage.data?.message || "Failed to update user role");
      }
    } else {
      toast.error("User not found with this email");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      setOpen(false);
    } catch (deleteUserError) {
      const errorMessage = deleteUserError as ApiError;
      toast.error(errorMessage.data?.message || "Failed to delete user");
    }
  };

  const rows = isTeam
    ? data?.users.filter((user) => user.role === "admin") || []
    : data?.users || [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px]">
          <Box m="20px">
            <div className="w-full flex justify-end">
              <div
                className={`${styles.button} !w-[220px] dark:bg-[#57c7a3] !h-[35px] dark:border-[#ffffffa8]`}
                onClick={() => setActive(!active)}
              >
                Add New Member
              </div>
            </div>
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
              <TableContainer sx={{ maxHeight: "80vh", overflowX: "auto" }}>
                <Table stickyHeader size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                  <TableHead>
                    <TableRow>
                      {tableColumns.map((header) => (
                        <TableCell
                          key={header.key}
                          align={header.align}
                          sx={{
                            backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                            color: theme === "dark" ? "#fff" : "#000",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            width: header.width,
                            minWidth: header.width,
                          }}
                        >
                          {header.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((user) => (
                      <TableRow
                        key={user._id}
                        hover
                        sx={{
                          backgroundColor: theme === "dark" ? "#1e2134" : "#fff",
                        }}
                      >
                        {tableColumns.map((column) => {
                          if (column.key === "mailAction") {
                            return (
                              <TableCell
                                key={column.key}
                                align={column.align}
                                sx={{ width: column.width, minWidth: column.width }}
                              >
                                <a href={`mailto:${user.email}`}>
                                  <AiOutlineMail className="dark:text-white text-black" size={20} />
                                </a>
                              </TableCell>
                            );
                          }

                          if (column.key === "deleteAction") {
                            return (
                              <TableCell
                                key={column.key}
                                align={column.align}
                                sx={{ width: column.width, minWidth: column.width }}
                              >
                                <Button
                                  onClick={() => {
                                    setOpen(true);
                                    setUserId(user._id);
                                  }}
                                >
                                  <AiOutlineDelete
                                    className="dark:text-white text-black"
                                    size={20}
                                  />
                                </Button>
                              </TableCell>
                            );
                          }

                          const valueMap = {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            courses: user.courses?.length || 0,
                            joinedAt: format(user.createdAt),
                          };

                          return (
                            <TableCell
                              key={column.key}
                              align={column.align}
                              sx={{
                                color: theme === "dark" ? "#fff" : "#000",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: column.width,
                                minWidth: column.width,
                              }}
                              title={String(valueMap[column.key as keyof typeof valueMap])}
                            >
                              {valueMap[column.key as keyof typeof valueMap]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            {/* Update User Role Model */}
            {active && (
              <Modal
                open={active}
                onClose={() => setActive(!active)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                  <h1 className={`${styles.title}`}>Add New Member</h1>
                  <div className="mt-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email..."
                      className={`${styles.input}`}
                    />
                    <select
                      name=""
                      id=""
                      className={`${styles.input} !mt-6`}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setRole(e.target.value)
                      }
                    >
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                    <br />
                    <div
                      className={`${styles.button} my-6 !h-[30px]`}
                      onClick={handleSubmit}
                    >
                      Submit
                    </div>
                  </div>
                </Box>
              </Modal>
            )}
            {/* Delete User Model */}
            {open && (
              <Modal
                open={open}
                onClose={() => setOpen(!open)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                  <h1 className={`${styles.title}`}>
                    Are you sure you want to delete this User?
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

export default AllUsers;

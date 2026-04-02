import { Response } from "express";
import { safeRedisGet } from "../utils/redisHealth";
import userModel from "../models/user.model";

export const getUserById = async (id: string, res: Response) => {
  try {
    const userJson = await safeRedisGet(id);
    if (userJson) {
      const user = JSON.parse(userJson);
      res.status(201).json({
        success: true,
        user,
      });
      return;
    }
  } catch (error) {
    const redisError = error as Error;
    console.error("Redis get failed:", redisError.message);
  }

  const user = await userModel.findById(id).select("-password");
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    user,
  });
};

//get all users
export const getAllUsersService = async (res: Response) => {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    })
};
//update user role service
export const  updateUserRoleService=async (res: Response, id: string, role: string) =>{
  const user = await userModel.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user,
  });
}

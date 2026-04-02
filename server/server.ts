import { app } from "./app";
import dbConnection from "./utils/db";
import { connectRedis } from "./utils/redis";
require("dotenv").config();
import {v2 as cloudinary} from "cloudinary";

const normalizeEnv = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.replace(/^['"]|['"]$/g, "");
};

cloudinary.config({
  cloud_name:
    normalizeEnv(process.env.CLOUDINARY_CLOUD_NAME) ||
    normalizeEnv(process.env.CLOUD_NAME),
  api_key:
    normalizeEnv(process.env.CLOUDINARY_API_KEY) ||
    normalizeEnv(process.env.CLOUD_API_KEY),
  api_secret:
    normalizeEnv(process.env.CLOUDINARY_API_SECRET) ||
    normalizeEnv(process.env.CLOUD_SECRET_KEY),
});

const port = process.env.PORT || "8000";

const connectDatabaseWithRetry = async () => {
  try {
    await dbConnection();
    console.log("✅ MongoDB connected successfully");
  } catch (error: any) {
    console.error(`❌ MongoDB connection failed: ${error?.message || "Unknown error"}`);
    setTimeout(() => {
      void connectDatabaseWithRetry();
    }, 10000);
  }
};

const startServer = async () => {
  console.log("Starting backend server...");
  
  await connectDatabaseWithRetry();
  await connectRedis();
  
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });
};

void startServer();

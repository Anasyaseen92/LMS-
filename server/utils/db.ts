import mongoose from "mongoose";
require("dotenv").config();
const dbURl: string = process.env.DB_URL || "";

const dbConnection = async () => {
  if (!dbURl) {
    console.warn("MongoDB connection skipped: DB_URL not set.");
    throw new Error("DB_URL not set");
  }
  const data = await mongoose.connect(`${dbURl}`);
  console.log(`MongoDB connected successfully: ${data.connection.host}`);
};
export default dbConnection;

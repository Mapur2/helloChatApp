import mongoose, { connect } from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI);
    console.log("Database connected successfully", conn.connection.host);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
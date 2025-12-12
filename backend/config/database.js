import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI);
     // Log connection info
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`); // <-- Logs the database name

  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

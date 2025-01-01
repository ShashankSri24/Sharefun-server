import mongoose from "mongoose";
const connection = async () => {
  try {
    // Connect to the MongoDB database using the MONGO_URL environment variable
    const dbconnect = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected");
  } catch (error) {
    console.log("Connection error:", error);
  }
};

export default connection;

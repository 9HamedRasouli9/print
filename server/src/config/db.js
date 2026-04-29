import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not defined");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;

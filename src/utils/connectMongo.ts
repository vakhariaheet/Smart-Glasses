import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (error:any) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectMongo;
import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const connecttomongoose = await mongoose.connect(process.env.MONGO_URL);
    if (connecttomongoose) {
      console.log("Connected to MongoDB successfully");
    }
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
  }
};

export default connectdb;

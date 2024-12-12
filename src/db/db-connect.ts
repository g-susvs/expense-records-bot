import mongoose from "mongoose";

export const dbConnect = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log('db connected');
  } catch (error) {
    console.error(error);
  }
};

import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("mongoDB Connected: " + conn.connection.host);
  } catch (error) {
    console.error("MongoDB Connection failed," + error.message);

    process.exit(1);
  }
};

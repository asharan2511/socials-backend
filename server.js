import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { dbConnect } from "./db/db.config.js";
import userRouter from "./router/userRoutes.js";
import cookieParser from "cookie-parser";
import postRouter from "./router/postRoutes.js";
const app = express();
const port = process.env.PORT || 8000;

app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());

app.use("/v1/api/user", userRouter);
app.use("/v1/api/post", postRouter);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return res
      .status(409)
      .json({ success: "False", message: `${field} already exists` });
  }

  res.status(err.statusCode || 500).json({
    success: "False",
    message: err.message || "Internal server Error",
  });
});

const startServer = async () => {
  await dbConnect();
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};

startServer();

import express from "express";
import {
  createUser,
  loginUser,
  logout,
  tokenRefresh,
} from "../controller/userController.js";
const userRouter = express.Router();

userRouter
  .post("/user/sign-up", createUser)
  .post("/user/login", loginUser)
  .post("/auth/refresh", tokenRefresh);
userRouter.delete("/user/logout", logout);

export default userRouter;

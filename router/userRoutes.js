import express from "express";
import {
  acceptRequest,
  createUser,
  getListOfRequests,
  loginUser,
  logout,
  sendRequest,
  tokenRefresh,
} from "../controller/userController.js";

import { authentication } from "../utils/auth.js";

import {
  followRequestSchemaValidation,
  validate,
} from "../utils/validation.js";
const userRouter = express.Router();

userRouter
  .post("/sign-up", createUser)
  .post("/login", loginUser)
  .post("/auth/refresh", tokenRefresh)
  .post(
    "/send-request",
    authentication,
    validate(followRequestSchemaValidation),
    sendRequest,
  )
  .post("/retrieve-requests", authentication, getListOfRequests)
  .post("/send-request", authentication, sendRequest)
  .post("/accept-request", authentication, acceptRequest);
userRouter.delete("/user/logout", logout);

export default userRouter;

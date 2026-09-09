import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Connection } from "../models/connectionModel.js";
import { generateToken, hashToken } from "../utils/Refreshtoken.js";
import { FollowRequest } from "../models/followRequest.js";
import { Followers } from "../models/followerModel.js";

export const createUser = async (req, res, next) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body;

    const createUser = await User.create({
      userName,
      firstName,
      lastName,
      email,
      password,
    });

    if (!createUser) {
      throw new Error("User was not created successfully");
    }

    return res
      .status(201)
      .json({ success: "True", message: "User was created Successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!(userName || email)) {
      throw new Error("Atleast one them is required");
    }

    const findUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (!findUser) {
      throw new Error("Users doesnt exists");
    }

    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      throw new Error("Wrong password. Check again");
    }

    const rawRefreshToken = await generateToken();
    const hashedToken = hashToken(rawRefreshToken);

    console.log(rawRefreshToken);

    const accessToken = jwt.sign(
      {
        userId: findUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    await res.cookie("refreshToken", rawRefreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const connectionCreate = await Connection.findOneAndUpdate(
      {
        userId: findUser._id,
      },
      {
        $set: {
          refreshToken: hashedToken,
          status: "ACTIVE",
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    if (!connectionCreate) {
      throw new Error("Login failed, Try Again!");
    }

    res.status(200).json({
      success: true,
      message: "Login Successful!",
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const hashedToken = hashToken(refreshToken);
    console.log(refreshToken);
    const update = await Connection.findOneAndUpdate(
      {
        refreshToken: hashedToken,
      },
      {
        $set: { status: "INACTIVE", refreshToken: null },
      },
    );
    console.log(update);

    if (!update) {
      throw new Error("Invalid Token!");
    }

    res
      .status(201)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const tokenRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    const hashedToken = hashToken(refreshToken);
    console.log(refreshToken);
    console.log(hashedToken);

    const findConnnection = await Connection.findOne({
      refreshToken: hashedToken,
      status: "ACTIVE",
    });

    if (!findConnnection) {
      throw new Error("Invalid Refresh Token");
    }

    const accessToken = jwt.sign(
      { userId: findConnnection.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const newRefreshToken = await generateToken();
    const newHashedToken = hashToken(newRefreshToken);
    findConnnection.refreshToken = newHashedToken;
    findConnnection.save();
    res.status(201).json({
      success: true,
      message: "Acess token granted",
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const sendRequest = async (req, res, next) => {
  try {
    const requestUser = req.userId;
    const { recepient } = req.body;

    if (requestUser === recepient) {
      res.status(400).json({
        success: false,
        message: "Cannot send follow request to yourself",
      });
    }

    const followRequestSuccess = await FollowRequest.create({
      requestUser,
      recepient,
    });

    if (!followRequestSuccess) {
      throw new Error("Follow request send failed");
    }

    res
      .status(200)
      .json({ success: true, message: "Follow request Sent Successfully" });
  } catch (error) {
    next(error);
  }
};

export const getListOfRequests = async (req, res, next) => {
  try {
    const recepient = req.userId;

    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([
      FollowRequest.find({ recepient, status: "PENDING" })
        .populate("requestUser", "userName")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      FollowRequest.countDocuments({ recepient, status: "PENDING" }),
    ]);

    res.status(200).json({
      success: true,
      result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const { requestId } = req.body;

    const findRequest = FollowRequest.find({ _id: requestId });
    if (!findRequest) {
      throw new Error("Cannot find that request");
    }
    FollowRequest.status = "ACCEPTED";
    await FollowRequest.save();

    await Followers.create({
      follower: requestId,
      following: req.userId,
    });
    return res
      .status(201)
      .json({ success: true, message: "you accepted Follow request" });
  } catch (error) {
    next(error);
  }
};

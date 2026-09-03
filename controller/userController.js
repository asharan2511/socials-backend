import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Connection } from "../models/connectionModel.js";

//POST - create User
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

//POST -  sign in

export const loginUser = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!(userName && email)) {
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

    const refreshToken = crypto.randomBytes(16).toString("hex");
    const accessToken = jwt.sign(
      {
        userId: findUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    await res.cookie("refreshToken", {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const connectionCreate = await Connection.findOneAndUpdate(
      {
        userId: findUser._id,
      },
      {
        $set: [{ refreshToken: refreshToken }, { status: "ACTIVE" }],
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

export const logout = async (req, res) => {
  try {
    const id = req.userId;

    const update = await Connection.findOneAndUpdate(
      {
        id,
      },
      {
        $set: { status: "INACTIVE" },
      },
    );

    if (!update) {
      throw new Error("Failed ton logout try again!");
    }

    res
      .status(201)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

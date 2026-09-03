import jwt from "jsonwebtoken";

export const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error("Invalid User");
    }

    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      throw new Error("Token Invalid");
    }

    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};

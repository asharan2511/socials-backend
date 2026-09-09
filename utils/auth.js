import jwt from "jsonwebtoken";

export const authentication = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Invalid User");
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      throw new Error("Token Invalid");
    }

    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};

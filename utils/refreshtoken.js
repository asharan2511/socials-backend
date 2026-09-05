import crypto from "crypto";

export const generateToken = async () => {
  const token = crypto.randomBytes(16).toString("hex");
  return token;
};

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

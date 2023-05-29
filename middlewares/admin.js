import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Admin from "../models/admin.js";

dotenv.config();
const secret = process.env.SECRET;

export const checkAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(400).json({ success: false, message: "token required" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    return res
      .status(400)
      .json({ success: false, message: "invalid token type" });
  }

  jwt.verify(token, secret, async (err, data) => {
    if (err) {
      return res.status(400).json({ success: false, message: "token expired" });
    }

    const admin = await Admin.findOne({
      name: data.name,
      password: data.password,
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: "auth fail" });
    } else {
      next();
    }
  });
};

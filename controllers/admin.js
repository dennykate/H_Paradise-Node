import Admin from "../models/admin.js";
import dotenv from "dotenv";
import { createHmac } from "crypto";
import jwt from "jsonwebtoken";

dotenv.config();
const secret = process.env.SECRET;

export const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res
      .status(400)
      .json({ massage: "Required all data", success: false });
  }

  const hashbassword = createHmac("sha256", secret)
    .update(password)
    .digest("hex");

  const admin = await Admin.findOne({ name, password: hashbassword });

  if (!admin) {
    return res
      .status(400)
      .json({ message: "name or password wrong", success: false });
  }

  jwt.sign(
    {
      name: admin.name,
      password: admin.password,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    secret,
    (err, token) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Server error", success: false });
      }

      return res.status(201).json({ success: true, token });
    }
  );
};

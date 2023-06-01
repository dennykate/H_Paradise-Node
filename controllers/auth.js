import shortid from "shortid";

import Auth from "../models/auth.js";
import { getCurrentTime } from "../helper/functions.js";

export const generate = async (req, res) => {
  const code = shortid.generate();
  const currentTime = getCurrentTime();
  const isCodeExist = await Auth.findOne({ code });

  if (isCodeExist) {
    return res
      .status(400)
      .json({ message: "Code is already exist", success: false });
  }

  const newCode = new Auth({ code, created_at: currentTime });
  await newCode.save();

  return res.status(201).json({ code: newCode.code, success: true });
};

export const login = async (req, res) => {
  const device_id = req.body.device_id;
  const code = req.body.code;

  if (!device_id || !code) {
    return res.status(400).json({ message: "login fail", success: false });
  }

  const isDeviceIdExist = await Auth.findOne({ code });

  if (isDeviceIdExist && isDeviceIdExist.device_id == device_id) {
    return res.status(200).json({ message: "login success", success: true });
  }

  if (!isDeviceIdExist) {
    return res.status(400).json({ message: "invalid code", success: false });
  }

  if (isDeviceIdExist.device_id !== null) {
    return res
      .status(404)
      .json({ message: "User already exist", success: false });
  }

  if (isDeviceIdExist.device_id && isDeviceIdExist.device_id != device_id) {
    return res
      .status(404)
      .json({ message: "User already exist", success: false });
  }

  const authCode = await Auth.findOneAndUpdate(
    { code },
    { device_id },
    { new: true }
  );

  return res.status(200).json({ message: "login success", success: true });
};

export const totalAuth = async (req, res) => {
  const total = await Auth.find();

  return res.status(200).json({ total: total.length });
};

export const getAll = async (req, res) => {
  const options = req.query;

  const filter = options.filter || {};
  const page = options.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const data = await Auth.find(filter)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    data,
    meta: {
      total: data.length,
      filter,
      page,
      limit,
      skip,
    },
  });
};

export const destroy = async (req, res) => {
  const { code } = req.body;
  const isValidCode = await Auth.findOne({ code });

  if (!code || !isValidCode) {
    return res.status(400).json({ message: "action fails", success: false });
  }

  await Auth.findOneAndDelete({ code });

  return res
    .status(200)
    .json({ message: "code was deleted successfully", success: true });
};

import mongoose from "mongoose";

const AuthSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  device_id: {
    type: String,
    default: null,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Auth = new mongoose.model("auth", AuthSchema);

export default Auth;

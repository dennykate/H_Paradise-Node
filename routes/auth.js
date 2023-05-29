import express from "express";
import {
  destroy,
  generate,
  getAll,
  login,
  totalAuth,
} from "../controllers/auth.js";
import { checkAdmin } from "../middlewares/admin.js";

const router = express.Router();

router.post("/generate", checkAdmin, generate);
router.post("/login", login);
router.get("/total", totalAuth);
router.get("/all", getAll);
router.delete("/destroy", destroy);

export default router;

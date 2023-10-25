import express from "express";

import { getStatus, putStatus } from "../controllers/statusController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// GET /status
router.get("/status", isAuth, getStatus);

// PUT /status
router.put("/status", isAuth, putStatus);

export default router;

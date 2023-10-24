import express from "express";

import { getPosts, postPost } from "../controllers/feedController.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", getPosts);

// POST /feed/post
router.post("/post", postPost);

export default router;

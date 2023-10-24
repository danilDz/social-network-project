import express from "express";
import { body } from "express-validator";

import {
  deletePost,
  getPost,
  getPosts,
  postPost,
  putPost,
} from "../controllers/feedController.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", getPosts);

// GET /feed/post/:postId
router.get("/post/:postId", getPost);

// PUT /feed/post/:postId
router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  putPost
);

// POST /feed/post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  postPost
);

// DELETE /feed/post/:postId
router.delete("/post/:postId", deletePost);

export default router;

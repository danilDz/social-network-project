import express from "express";
import { body } from "express-validator";

import {
  deletePost,
  getPost,
  getPosts,
  postPost,
  putPost,
} from "../controllers/feedController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, getPosts);

// GET /feed/post/:postId
router.get("/post/:postId", isAuth, getPost);

// PUT /feed/post/:postId
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  putPost
);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  postPost
);

// DELETE /feed/post/:postId
router.delete("/post/:postId", isAuth, deletePost);

export default router;

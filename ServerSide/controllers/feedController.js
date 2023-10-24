import { validationResult } from "express-validator";

import Post from "../models/postModel.js";

import { deleteImage } from "../utils/image.js";

export const getPosts = (req, res, next) => {
    const page = req.query.page || 1,
      perPage = 2;
    let totalItems;
    Post.find()
      .countDocuments()
      .then((count) => {
        totalItems = count;
        return Post.find()
          .skip((page - 1) * perPage)
          .limit(perPage);
      })
      .then((posts) => {
        res.status(200).json({
          message: "Fetched posts successfully!",
          posts,
          totalItems,
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  },
  getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
      .then((post) => {
        if (!post) {
          const error = new Error("Couldn't find a post.");
          error.statusCode = 404;
          throw error;
        }

        res.status(200).json({
          message: "Post fetched!",
          post,
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  },
  putPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed! Entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    const postId = req.params.postId,
      title = req.body.title,
      content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) imageUrl = req.file.path;
    if (!imageUrl) {
      const error = new Error("No file picked!");
      error.statusCode = 422;
      throw error;
    }

    Post.findById(postId)
      .then((post) => {
        if (!post) {
          const error = new Error("Couldn't find a post.");
          error.statusCode = 404;
          throw error;
        }
        if (imageUrl !== post.imageUrl) deleteImage(post.imageUrl);
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
      })
      .then((result) => {
        res.status(200).json({
          message: "Post updated!",
          post: result,
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  },
  postPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed! Entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    if (!req.file) {
      const error = new Error("No image provided!");
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title,
      content = req.body.content,
      name = "Daniil",
      imageUrl = req.file.path;

    const post = new Post({
      title,
      content,
      creator: {
        name,
      },
      imageUrl,
    });
    post
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Post was created successfully!",
          post: result,
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  },
  deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
      .then((post) => {
        // Check logged in user
        if (!post) {
          const error = new Error("Couldn't find a post.");
          error.statusCode = 404;
          throw error;
        }
        deleteImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);
      })
      .then((result) => {
        console.log(result);
        res.status(200).json({
          message: "Post successfully deleted!",
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  };

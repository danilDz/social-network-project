import express from "express";
import { body } from "express-validator";

import { postLogin, putSignup } from "../controllers/authController.js";

import User from "../models/userModel.js";

const router = express.Router();

// PUT /auth/signup
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) return Promise.reject("Email address already exists!");
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  putSignup
);

// POST /auth/login
router.post("/login", postLogin);

export default router;

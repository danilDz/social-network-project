import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

export const putSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const email = req.body.email,
      name = req.body.name,
      password = req.body.password;

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email,
          name,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          userId: result._id,
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  },
  postLogin = (req, res, next) => {
    const email = req.body.email,
      password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          const error = new Error("Couldn't find a user!");
          error.statusCode = 401;
          throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((isEqual) => {
        if (!isEqual) {
          const error = new Error("Wrong password!");
          error.statusCode = 401;
          throw error;
        }
        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
          },
          "secret",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token,
          userId: loadedUser._id.toString(),
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  };

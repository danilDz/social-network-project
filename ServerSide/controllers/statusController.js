import User from "../models/userModel.js";

export const getStatus = (req, res, next) => {
    User.findById(req.userId)
      .then((user) => {
        if (!user) {
          const error = new Error("Couldn't find a user!");
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({
          status: user.status,
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  },
  putStatus = (req, res, next) => {
    const status = req.body.status;
    if (!status) {
      const error = new Error("Invalid status!");
      error.statusCode = 422;
      throw error;
    }
    User.findById(req.userId)
      .then((user) => {
        if (!user) {
          const error = new Error("Couldn't find a user!");
          error.statusCode = 404;
          throw error;
        }
        user.status = status;
        return user.save();
      })
      .then((result) => {
        res.status(200).json({
          message: "Status successfully updated!",
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  };

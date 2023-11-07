import dotenv from "dotenv";
dotenv.config();

import { expect } from "chai";
import mongoose from "mongoose";

import User from "../models/userModel.js";
import { postPost } from "../controllers/feedController.js";

describe("Feed Controller - Create post", function () {
  before((done) => {
    mongoose
      .connect(process.env.MONGODB_CONNECTION_URI_TEST)
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("should add a created post to the posts of the creator", function (done) {
    const req = {
      userId: "5c0f66b979af55031b34728a",
      body: {
        title: "test post",
        content: "test content",
      },
      file: {
        path: "path",
      },
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };
    postPost(req, res, () => {}).then((user) => {
      console.log(user);
      expect(user).to.have.property("posts");
      expect(user.posts).to.have.length(1);
      done();
    });
  });

  after((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done());
  });
});

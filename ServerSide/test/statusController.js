import dotenv from "dotenv";
dotenv.config();

import { expect } from "chai";
import mongoose from "mongoose";

import User from "../models/userModel.js";
import { getStatus } from "../controllers/statusController.js";

describe("Status Controller - Get status", function () {
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

  it("should send a response with a valid user status for an existing user", function (done) {
    const req = {
      userId: "5c0f66b979af55031b34728a",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json: function (obj) {
        this.userStatus = obj.status;
      },
    };
    getStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
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

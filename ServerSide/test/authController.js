import { expect } from "chai";
import sinon from "sinon";

import User from "../models/userModel.js";
import { postLogin } from "../controllers/authController.js";

describe("Auth Controller - Login", () => {
  sinon.stub();
  it("should throw an error with code 500 if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };
    postLogin(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });
    User.findOne.restore();
  });
});

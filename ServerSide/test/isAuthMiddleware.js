import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";

import isAuth from "../middleware/isAuth.js";

describe("isAuth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: (headerName) => {
        return null;
      },
    };
    expect(isAuth.bind(this, req, {}, () => {})).to.throw("Not authenticated!");
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: (headerName) => {
        return "xyz";
      },
    };
    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xyz";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    isAuth(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    jwt.verify.restore();
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xyz";
      },
    };
    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });
});

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import feedRoutes from "./routes/feedRoute.js";

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8080!");
});

import dotenv from "dotenv";
dotenv.config();

import path, { dirname } from "path";
import { fileURLToPath } from "url";

import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import mongoose from "mongoose";
import { createServer } from "http";

import feedRoutes from "./routes/feedRoute.js";
import authRoutes from "./routes/authRoute.js";
import statusRoutes from "./routes/statusRoute.js";

import socket from "./utils/socket.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use(statusRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500,
    message = error.message,
    data = error.data;
  res.status(status).json({
    message,
    data,
  });
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_URI)
  .then( async (result) => {
    const server = createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}!`);
    });
    const io = socket.init(server);
    io.on("connection", (socket) => {
      console.log("Client connected!");
    });
  })
  .catch((err) => console.log(err));

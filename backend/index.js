const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apiRouter = require("./api");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", apiRouter);

// Basic route
app.get("/", (_, res) => {
  res.json({ message: "Welcome to our content management system!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = 8080;
const mainRoutes = require("./routes/Document");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require("dotenv").config();

const dbURI = process.env.DB_URL; // mongodb url

// mongoose conaction
mongoose
  .connect(dbURI, {})
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/", mainRoutes);

// port listning
app.listen(port, () => {
  console.log(`listning on port ${port}`);
});

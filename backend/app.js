const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
const mainRoutes = require("./routes/Document");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require("dotenv").config();

app.use("/", mainRoutes);

// port listning
app.listen(port, () => {
  console.log(`listning on port ${port}`);
});

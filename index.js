const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.listen(5000, () => console.log("Server running on port 5000"));

const identifyRoute = require("./routes/identify");
app.use("/identify", identifyRoute);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const textDetectionRoutes = require("./routes/textDetectRoutes");

app.use("/detection", textDetectionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Text Detection Tests!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const router = express.Router();
const vision = require("@google-cloud/vision");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: setIncomingFileName,
});

const upload = multer({ storage: imageStorage });

const visionClient = new vision.ImageAnnotatorClient();

const testingFile = "./images/testImage.jpg";

function setIncomingFileName(req, file, cb) {
  const extension = getExtensionFromFilename(file.originalname);
  const main = `T-${uuidv4()}-${Date.now()}`;
  cb(null, `${main}.${extension}`);
}

function getExtensionFromFilename(filename) {
  const lettersAfterDot = filename.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
  return lettersAfterDot ? lettersAfterDot[1] : "";
}

// Just confirm connection
router.get("/check", async (req, res) => {
  try {
    console.log("Check endpoint reached.");

    res.status(200).json({ message: "Successfully reached check endpoint!" });
  } catch (e) {
    return res.status(400).json({ message: "Error calling check endpoint." });
  }
});

// Test uploading images. "testimg" is the same as the "name" field of the form in the frontend.
router.post("/upload", upload.single("testimg"), async (req, res) => {
  try {
    console.log("file: ", req.file);

    res.status(200).json({ message: req.file });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: `Error uploading file ${req.file.originalname}: ${e.message}`,
    });
  }
});

// Basic test of text detection
const doTheTest = async () => {
  const [result] = await visionClient.textDetection(testingFile);

  const detections = result.textAnnotations;

  detections.forEach((text) => {
    console.log(text.description);
  });
};

module.exports = router;

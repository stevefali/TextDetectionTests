const express = require("express");
const router = express.Router();
const vision = require("@google-cloud/vision");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: setIncomingFileName,
});

const upload = multer({ storage: imageStorage });

const visionClient = new vision.ImageAnnotatorClient();

const fetchDetections = async (imageFile) => {
  const [result] = await visionClient.textDetection(imageFile);
  return result.textAnnotations;
};

const testingFile = "./images/testing-sample.jpg";

function setIncomingFileName(req, file, cb) {
  const extension = getExtensionFromFilename(file.originalname);
  const main = `T-${uuidv4()}-${Date.now()}`;
  cb(null, `${main}.${extension}`);
}

function getExtensionFromFilename(filename) {
  const lettersAfterDot = filename.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
  return lettersAfterDot ? lettersAfterDot[1] : "";
}

const getCorrectlyOrientedImage = async (originalFile) => {
  const originalMetadata = await sharp(originalFile.path).metadata();
  if (
    originalMetadata.orientation === 1 ||
    typeof originalMetadata.orientation === "undefined"
  ) {
    return originalFile.path;
  }

  // Produce a replacement file with corrected orientation
  const correctedOrientationFilePath = `./images/A-${originalFile.filename}`;
  await sharp(originalFile.path)
    .rotate()
    .withMetadata({ orientation: 1 })
    .toFile(correctedOrientationFilePath);

  // Delete the original file from the filesystem
  fs.unlink(originalFile.path, (error) => {
    if (error) {
      console.log("Error removing unused file ", error);
    }
  });
  return correctedOrientationFilePath;
};

// Upload an image. "testimg" is the same as the "name" field of the form data in the frontend.
router.post("/upload", upload.single("testimg"), async (req, res) => {
  try {
    console.log("file: ", req.file);

    const originalFileName = req.file.originalname;

    const filePath = await getCorrectlyOrientedImage(req.file);

    const metadata = await sharp(filePath).metadata();
    console.log(
      `originalWidth: ${metadata.width}, originalHeight: ${metadata.height}, ${metadata.orientation}`
    );

    res
      .status(200)
      .json({ message: `Uploaded file: ${originalFileName} to ${filePath}` });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: `Error uploading file ${req.file.originalname}: ${e.message}`,
    });
  }
});

// Upload and image and return detection results.
router.post("/detect", upload.single("testimg"), async (req, res) => {
  const originalFileName = req.file.originalname;

  try {
    const filePath = await getCorrectlyOrientedImage(req.file);
    const metadata = await sharp(filePath).metadata();

    console.log(`Uploaded file: ${originalFileName}} as ${filePath}`);

    const detectionResults = await fetchDetections(filePath);

    console.log(detectionResults);

    res.status(200).json({
      message: "Success",
      originalSize: {
        width: metadata.width,
        height: metadata.height,
      },
      results: detectionResults,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: `Error detecting text for file ${originalFileName}: ${err.message}`,
    });
  }
});

/* 
Testing 
*/

// Basic test of text detection
const doTheTest = async () => {
  const [result] = await visionClient.textDetection(testingFile);

  const detections = result.textAnnotations;

  detections.forEach((text) => {
    console.log(text.description);
  });
  return result;
};

// Endpoint just for manual text detection testing
router.get("/test", async (req, res) => {
  try {
    const filePath = await getCorrectlyOrientedImage(req.file);
    const detectionResult = await fetchDetections(filePath);

    res.status(200).json({ message: "success", results: detectionResult });
  } catch (e) {
    res.status(400).json({ message: `error detecting text: ${e}` });
    console.log(e.message);
  }
});

module.exports = router;

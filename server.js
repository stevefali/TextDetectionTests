const vision = require("@google-cloud/vision");
const cors = require("cors");

require("dotenv").config();

const visionClient = new vision.ImageAnnotatorClient();

const testingFile = "./images/testImage.jpg";

const doTheTest = async () => {
  const [result] = await visionClient.textDetection(testingFile);

  const detections = result.textAnnotations;

  detections.forEach((text) => {
    console.log(text.description);
  });
};

doTheTest();

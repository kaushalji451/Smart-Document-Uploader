const express = require("express");
const router = express.Router();
require("dotenv").config();

const OcrImage = require("../function/Ocr"); // image to text conversion function
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const AddharTextToJson = require("../function/AddharJson"); // addhar image text to json
const PanTextToJson = require("../function/PanJson"); // pan image text to json
const compressImage = require("../function/compressimage");
const deleteImage  = require("../function/destroyImage");
const upload = multer();

// cloudniry config
cloudinary.config({
  //cloudnery configeraton
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


// Helper to convert buffer to stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Upload a buffer to cloudinary
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    bufferToStream(buffer).pipe(stream);
  });
};

// Route to handle image upload and processing 
// upload for pan card 
router.post("/AddharUpload", upload.array("image", 2), async (req, res) => {
  const { idType } = req.query;

  if (!idType || !["AadharCard"].includes(idType)) {
    return res.status(400).json({ message: "Invalid or missing idType" });
  }

  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ message: "Two image files are required" });
  }

  try {
    const [image1, image2] = req.files;

    // Upload both images
    const [uploadResult1, uploadResult2] = await Promise.all([
      streamUpload(image1.buffer),
      streamUpload(image2.buffer),
    ]);

     //  resize the image
     const compressedUrl1 = compressImage(uploadResult1.secure_url);
     const compressedUrl2 = compressImage(uploadResult2.secure_url);

    // OCR both images
    const [text1, text2] = await Promise.all([
      OcrImage(compressedUrl1),
      OcrImage(compressedUrl2),
    ]);

      const combinedText = `${text1}\n${text2}`.trim();

    if (!combinedText) {
      return res.status(400).json({ message: "OCR failed or returned empty text" });
    }

    // Parse text to structured JSON
    let parsedData;
    if (idType === "AadharCard") {
      parsedData = AddharTextToJson(combinedText);
    }else {
      return res.status(400).json({ message: "idType not supported" });
    }

    console.log("Parsed Data:", parsedData);
    // Optional: Clean up uploaded images
    await Promise.all([
      deleteImage(uploadResult1.secure_url),
      deleteImage(uploadResult2.secure_url),
    ]);

    res.status(200).json({ data: parsedData, idType });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});


// Route to handle image upload and processing for PAN card
// Route to handle image upload and processing
router.post("/PanUpload", upload.single("image"), async (req, res) => {
  const { idType } = req.query;

  if (!idType || !["PanCard"].includes(idType)) {
    return res.status(400).json({ message: "Invalid or missing idType" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "An image file is required" });
  }

  try {
    const image = req.file;

    // Upload  image
    const uploadImage = await streamUpload(image.buffer);
      //  resize the image
      const compressedUrl = compressImage(uploadImage.secure_url);
    // OCR  image
    const text = await OcrImage(compressedUrl);


    // Parse text to structured JSON
    let parsedData;
    if (idType === "PanCard") {
      parsedData = PanTextToJson(text);
    } else {
      return res.status(400).json({ message: "idType not supported" });
    }

    //Clean up uploaded images
    await deleteImage(uploadImage.secure_url);

    res.status(200).json({ data: parsedData, idType });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
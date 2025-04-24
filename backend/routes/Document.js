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

// image uploader and convert it into text then send as json format
router.post("/upload", upload.single("image"), async (req, res) => {
  // id type from req query
  const { idType } = req.query;
  if (!idType || !["AadharCard", "PanCard"].includes(idType)) {
    return res.status(400).json({ message: "Invalid or missing idType" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  try {
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    //  uploading the image onto cloudinary
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        bufferStream.pipe(stream);
      });
    };

    //  image comeing from cloud
    const result = await streamUpload();
    //  resize the image
    const compressedUrl = compressImage(result.secure_url);

    const ImageResult = await OcrImage(compressedUrl); // converting the image to text

    if (!ImageResult || ImageResult.trim() === "") {
      return res
        .status(400)
        .json({ message: "OCR failed or returned empty text" });
    }

    //  converting text to json based on its addhar card or pan card

    let Data;
    if (idType === "AadharCard") {
      Data = AddharTextToJson(ImageResult);
      res.status(200).json({ data: Data, idType });
    } else if (idType === "PanCard") {
      Data = PanTextToJson(ImageResult);
      res.status(200).json({ data: Data, idType });
    } else {
      return res.status(400).json({ message: "idType not supported" });
    }

    await deleteImage(result.secure_url);

    console.log("Extracted JSON:", Data);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;

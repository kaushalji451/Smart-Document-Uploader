const axios = require("axios");
const FormData = require("form-data");

const OcrImage = async (image) => {
try {
      const form = new FormData();
      form.append("apikey", process.env.OCR_key);  //api key of ocr space
      form.append("language", "eng");  // language is english
      form.append("isOverlayRequired", "false");  
      form.append("url", image); // image url
    
      // route of api request
      const response = await axios.post(process.env.OCR_PATH, form, {  
        headers: form.getHeaders(),
      });
      const parsedText = response.data.ParsedResults?.[0]?.ParsedText;
    return parsedText || "No text found!";

    
} catch (error) {
    console.error("OCR failed:", error.message);
    return null;
}
};

module.exports  = OcrImage;

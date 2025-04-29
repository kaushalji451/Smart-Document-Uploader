
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
// cloudniry config
cloudinary.config({
  //cloudnery configeraton
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Function to delete image from Cloudinary by its URL
const deleteImage = async (imageUrl) => {
    // Extract the public_id from the Cloudinary URL
    const getPublicId = (url) => {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(jpg|png|jpeg|webp|gif)/);
      return match ? match[1] : null;
    };
  
    const publicId = getPublicId(imageUrl);
  
    if (publicId) {
      try {
        // Deleting the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    } else {
      console.log("No public_id found in the URL, skipping delete.");
    }
  };

  module.exports = deleteImage;
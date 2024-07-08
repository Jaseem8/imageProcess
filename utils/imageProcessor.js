const axios = require("axios");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

// Load environment variables from .env file
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const downloadImage = async (url) => {
  const response = await axios({
    url,
    responseType: "arraybuffer",
  });
  return response.data;
};

const uploadToCloudinary = async (buffer, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: filename, resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(buffer);
  });
};

const compressAndUploadImage = async (url) => {
  const imageBuffer = await downloadImage(url);
  const compressedBuffer = await sharp(imageBuffer)
    .jpeg({ quality: 50 }) // Compress image to 50% quality
    .toBuffer();

  const filename = `${uuidv4()}`;
  const cloudinaryUrl = await uploadToCloudinary(compressedBuffer, filename);
  return cloudinaryUrl;
};

module.exports = { compressAndUploadImage };

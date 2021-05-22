const sizeOf = require('image-size');

// Return image dimensions from a given image file.

module.exports = async ({
  imageBuffer
}) => {
  if(!imageBuffer) return { imgH: 600, imgW: 600 } // Send a default
  const dimensions = sizeOf(imageBuffer);
  return {
    imgH: dimensions.height,
    imgW: dimensions.width
  }
};
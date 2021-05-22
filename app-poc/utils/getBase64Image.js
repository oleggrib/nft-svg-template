const svg64 = require('svg64');
const fetch = require('node-fetch');

// return base64 image and data from of SVG, Gif, Png, Jpg

module.exports = async ({
  imageUrl
}) => {
  // image buffer
  let imageBuffer;
  // Fetch the NFT Data 
  const imageUrlData = await fetch(imageUrl);
  // Get Content type
  const contentType = await imageUrlData.headers.get('content-type');
  // // variable to store image in Base64 format
  let imageUrlBase64;
  // // If SVG
  if (contentType.indexOf("svg") > -1) {
    // Get SVG element from response
    const svg = await imageUrlData.text();
    // Base64 encode SVG
    imageUrlBase64 = svg64(svg);
  }
  // If other (PNG, JPG, Gif)
  if (contentType.indexOf("svg") <= -1) {
    imageBuffer = await imageUrlData.buffer();
    imageUrlBase64 = `data:image/${contentType};base64,`+imageBuffer.toString('base64');
  }
  return {
    imageUrlBase64: imageUrlBase64,
    imageUrlBuffer: imageBuffer,
    imageUrlType: contentType
  } 
}
const fs = require('fs');
const puppeteer = require('puppeteer');
// const isLightContrastImage = require('./isLightContrastImage');

// Enable for SVG to be converted to Base64
const svgDim = require('svg-dimensions');
const svg64 = require('svg64');

const fetch = require('node-fetch');
const sizeOf = require('image-size');

// HTML Templates
// const signedHtmlTemplate = require("./htmlTemplates/signed");
const signedHtmlTemplate = require("./htmlTemplates/signed");
const notSignedHtmlTemplate = require("./htmlTemplates/notSigned");

/*
  FUNCTION: 
  imageGenerator();

  USE:
  Generates an image from the given inputs (see interface below)

  interface: {
    imageUrl
    data: [
    {
      title: string; (Title of NFT)
      photoURL: string; (Photo of Twitter User)
      name: string; (Name of Twitter User)
      twitterId: string; (Handle)
      mark: string; (ID number)
    }
    ],
    base64Encode
  }
*/

module.exports = async (
  title="Requesting",
  imageUrl="", 
  data={}, 
  base64Encode=true 
) => {

  const imageUrlData = await fetch(imageUrl);
  const contentType = await imageUrlData.headers.get('content-type');

  // variable to store image in Base64 format
  let imageBase64;
  let imgH = 0;
  let imgW = 0;

  // If SVG
  if (contentType.indexOf("svg") > -1) {
    // Get SVG element from response
    const svg = await imageUrlData.text();
    // Base64 encode SVG
    imageBase64 = svg64(svg);
    const dimensions = sizeOf(imageBase64);
    // getBBox
    imgH = 1;
    imgW = 1;
  }
  // If other (PNG, JPG, Gif)
  if (contentType.indexOf("svg") <= -1) {
    const imageBuffer = await imageUrlData.buffer();
    imageBase64 = `data:image/${contentType};base64,`+imageBuffer.toString('base64');
    const dimensions = sizeOf(imageBuffer);
    imgH = dimensions.height;
    imgW = dimensions.width;
  }
  
  // get the image colour (returns a boolean is image is either dark or light)
  // With this boolean we can decide the colour of the fonts/elements to apply
  const isLightImage = true;
  //  await isLightContrastImage({
  //   x: imgW - (imgW / 2), // start x
  //   y: 0, // start y
  //   dx: imgW, // end x
  //   dy: imgH, // end y
  //   imageUrl 
  // });

  // For debugging
  // console.log('image is light? ', isLightImage);

  // launch
  const browser = await puppeteer.launch();

  // create page 
  const page = await browser.newPage();

  // set page content to template (with loaded method - this needs further testing)
  const htmlPageTemplates = {
    "REQUESTING": signedHtmlTemplate,
    "SIGNED": signedHtmlTemplate,
  }

  // Load the HTML template based on the given title from params
  // TODO Extract the template selection logic from this main function.
  await page.setContent(htmlPageTemplates[title.toUpperCase], { waitUntil: 'networkidle2' });

  // This is applied to help ensure images are not blocked by other servers.
  // additional data maybe required to ensure images are successfully retrieved
  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load")

  // evaluate page / dom
  var imageOutput = await page.evaluate(async ({ 
    data, 
    isLightImage,
    imgH,
    imgW,
    imageBase64,
  }) => {

    // Define if the colour theme for text is black or white.
    const colourTheme = isLightImage ? "black" : "white";

    // build date stamp string
    var d = new Date();
    var n = d.getMonth();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const dateStamp = `${d.getDate()}${months[n]}${d.getFullYear()}`;
    
    // maybe we it can organically get the width
    document.getElementById('nft-container').style.height = imgH + 'px';
    document.getElementById('nft-container').style.width = imgW + 'px';
    
    // add nft background image
    document.getElementById('nft-container').style.backgroundImage = "url("+imageBase64+")";
    
    // add timestamp (top righthand side)
    document.getElementById('mark').innerHTML = `${data[0].mark}.${dateStamp}`;
    
    // Title/Type of NFT
    document.getElementById('status').innerHTML = title;
    
    // apply font colour to elements
    document.getElementById('mark').style.color = colourTheme;
    document.getElementById('status').style.color = colourTheme;
        
    // add labels
    data.map((label, index) => {
      if (index < 3) { // 3 is max ammount of autographs that can show on screen.
        const labelTemplate = `
          <div class="label">
            <img
              class="photo-url" 
              alt=""
              src="${label.photoURL}"  
            >
            <div class="autograph">
              ${label.twitterId}.${label.mark}
            </div>
          </div>
        `;
        document.getElementById('label-container').innerHTML += labelTemplate;
      }
    });

    // when there are too many autographs to display, add the length of the additional.
    if (data.length > 3) { 
      document.getElementById('label-container').innerHTML += `
      <div class="label">
        AND ${data.length -3} MORE...
      </div>
    `;
    };

    // SVG output
    let output = await domtoimage.toSvg(document.getElementById('outputWrapper'), {});
    output = output.replace(/%0A/g, '');
    output = output.replace("data:image/svg+xml;charset=utf-8,", "");

    // Return PNG (Base64 encoded)
    // let output = await domtoimage.toPng(document.getElementById('outputWrapper'), { quality: 0.95 });
    
    return output;
  }, {
    imageUrl, 
    data, 
    base64Encode,
    isLightImage,
    imgH,
    imgW,
    imageBase64,
  });

  // For debugging only (outputs image to local directory):
  await page.screenshot({ path: 'puppeteerScreenShot.png' });

  await browser.close();

  return imageOutput;
}
const fs = require('fs');
const puppeteer = require('puppeteer');
const isLightContrastImage = require('./isLightContrastImage');

const fetch = require('node-fetch');
const sizeOf = require('image-size');

// HTML Templates
const signedHtmlTemplate = require("./htmlTemplates/signed");

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
  imageUrl="", 
  data={}, 
  base64Encode=true,
  title="Signed"
) => {

  const imageUrlData = await fetch(imageUrl);
  const imageBuffer = await imageUrlData.buffer();
  const contentType = await imageUrlData.headers.get('content-type');
  const imageBas64 = `data:image/${contentType};base64,`+imageBuffer.toString('base64');

  // Get image dimensions
  const dimensions = sizeOf(imageBuffer);
  const imgH = dimensions.height;
  const imgW = dimensions.width;

  // Development use only
  // const imgH = 500;
  // const imgW = 500;
  
  // get the image colour (returns a boolean is image is either dark or light)
  // With this boolean we can decide the colour of the fonts/elements to apply
  const isLightImage = true
   await isLightContrastImage({
    x: imgW - (imgW / 2), // start x
    y: 0, // start y
    dx: imgW, // end x
    dy: imgH, // end y
    imageUrl 
  });

  // For debugging
  // console.log('image is light? ', isLightImage);

  // launch
  const browser = await puppeteer.launch();

  // create page 
  const page = await browser.newPage();

  // set page content to template based on the input title.
  // TODO: Consider using a param to explicitly define the template for use.
  switch(title.toUpperCase) {
    case "REQUESTED":
      await page.setContent(signedHtmlTemplate, { waitUntil: 'networkidle2' });
      break;
    case "SIGNED":
      await page.setContent(signedHtmlTemplate, { waitUntil: 'networkidle2' });
      break;
    default:
      await page.setContent(signedHtmlTemplate, { waitUntil: 'networkidle2' });
  }

  // This is applied to help ensure images are not blocked by other servers.
  // additional data maybe required to ensure images are successfully retrieved
  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load")

  // evaluate page / dom
  var imageOutput = await page.evaluate(async ({ 
    data, 
    isLightImage,
    imgH,
    imgW,
    imageBas64,
  }) => {

    // Define if the colour theme for text is black or white.
    const colourTheme = isLightImage ? "black" : "white";

    // build date stamp string
    var d = new Date();
    var n = d.getMonth();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const dateStamp = `${d.getDate()}${months[n]}${d.getFullYear()}`;
    
    document.getElementById('nft-container').style.height = imgH + 'px';
    document.getElementById('nft-container').style.width = imgW + 'px';
    
    // add nft background image
    document.getElementById('nft-container').style.backgroundImage = "url("+imageBas64+")";
    
    // add timestamp (top righthand side)
    document.getElementById('mark').innerHTML = `${data[0].mark}.${dateStamp}`;
    
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
    imageBas64,
  });

  // For debugging only (outputs image to local directory):
  await page.screenshot({ path: 'puppeteerScreenShot.png' });

  await browser.close();

  return imageOutput;
}
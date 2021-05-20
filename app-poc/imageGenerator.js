const fs = require('fs');
const puppeteer = require('puppeteer');
const isLightContrastImage = require('./isLightContrastImage');

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
  base64Encode=true 
) => {

  // get the image colour (returns a boolean is image is either dark or light)
  // With this boolean we can decide the colour of the fonts/elements to apply
  const isLightImage = await isLightContrastImage("http://www.gstatic.com/images/icons/material/apps/fonts/1x/catalog/v5/opengraph_color.png");

  // For debugging
  // console.log('image is light?', isLightImage);

  // launch
  const browser = await puppeteer.launch();

  // create page 
  const page = await browser.newPage();

  // set page content to template (with loaded method - this needs further testing)
  await page.setContent(signedHtmlTemplate, { waitUntil: 'networkidle2' });

  // evaluate page / dom
  var imageOutput = await page.evaluate(async ({ 
    imageUrl, 
    data, 
    base64Encode,
    isLightImage
  }) => {

    // Define if the colour theme for text is black or white.
    const colourTheme = isLightImage ? "white" : "black";

    // build date stamp string
    var d = new Date();
    var n = d.getMonth();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const dateStamp = `${d.getDate()}${months[n]}${d.getFullYear()}`;
    
    // add nft background image
    document.getElementById('nft-container').style.backgroundImage = "url("+imageUrl+")";
    
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

    // Testing needed to ensure all images/fonts are loaded.
    // await setTimeout(() => {}, 3000);

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
    isLightImage 
  });
  
  // For debugging only (outputs image to local directory):
  // await page.screenshot({ path: './mockImages/puppeteerScreenShot.png' });

  await browser.close();

  return imageOutput;
}
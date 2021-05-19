const fs = require('fs');
const puppeteer = require('puppeteer');
const htmlString = require("./htmlTemplate");

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

  // launch
  const browser = await puppeteer.launch();

  // create page 
  const page = await browser.newPage();

  // set page content to template (with loaded method - this needs further testing)
  await page.setContent(htmlString, { waitUntil: 'networkidle2' });

  // evaluate page / dom
  var imageOutput = await page.evaluate(async ({ 
    imageUrl, 
    data, 
    base64Encode 
  }) => {

    // build date stamp string
    var d = new Date();
    var n = d.getMonth();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const dateStamp = `${d.getDate()}${months[n]}${d.getFullYear()}`;
    
    // add nft background image
    document.getElementById('nft-container').style.backgroundImage = "url("+imageUrl+")";
    
    // add timestamp (top righthand side)
    document.getElementById('mark').innerHTML = `${data[data.length - 1].mark}.${dateStamp}`;
    
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
    base64Encode 
  });
  
  // For debugging only (outputs image to local directory):
  // await page.screenshot({ path: 'test.png' });

  await browser.close();

  return imageOutput;
}
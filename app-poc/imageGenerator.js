const fs = require('fs');
const puppeteer = require('puppeteer');
const htmlString = require("./htmlTemplate");

module.exports = async (
  imageUrl="", 
  data={}, 
  base64Encode=true 
) => {
  const browser = await puppeteer.launch()
  // create page 
  const page = await browser.newPage()
  // set page content to template (with loaded method - this needs further testing)
  await page.setContent(htmlString, { waitUntil: 'networkidle2' });
  // await page.setContent(htmlString);
  // evaluate page / dom
  var imageOutput = await page.evaluate(async ({ 
    imageUrl, 
    data, 
    base64Encode 
  }) => {
    // Replace data:
    // add nft background image:
    document.getElementById('nft-container').style.backgroundImage = "url("+imageUrl+")";
    // add timestamp (top righthand side)
    document.getElementById('mark').innerHTML = data[data.length - 1].mark + "dateStamp()";
    // add labels
    data.map((label, index) => {
      if (index < 3) {
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
    // Add extra number of autographs
    if (data.length > 3) {
      document.getElementById('label-container').innerHTML += `
      <div class="label">
        AND ${data.length -3} MORE...
      </div>
    `;;
    }
    // testing to see if image loads
    await setTimeout(() => {}, 3000);

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
  // For debugging only:
  await page.screenshot({ path: 'test.png' });

  return imageOutput;
  await browser.close();
}
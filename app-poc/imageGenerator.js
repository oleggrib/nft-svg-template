// render of HTML serverside
const puppeteer = require('puppeteer');
// initial template design
const htmlString = require("./htmlTemplate");

// function interface
// imageUrl: string (NFT url)
// data: [
// {
//    title: string; (Title of NFT)
//    photoURL: string; (Photo of Twitter User)
//    name: string; (Name of Twitter User)
//    twitterId: string; (Handle)
//    mark: string; (ID number)
// }
// ],
// base64Encode: boolean

module.exports = async (
  imageUrl="", 
  data={}, 
  base64Encode=true 
) => {

  console.log(data.title);

  const browser = await puppeteer.launch()
  // create page 
  const page = await browser.newPage()
  // set page content to template (with loaded method - this needs further testing)
  await page.setContent(htmlString, { waitUntil: 'networkidle2' });
  // evaluate page / dom
  var svgOutput = await page.evaluate(async ({ 
    imageUrl, 
    data, 
    base64Encode 
  }) => {
    // 1. Replace data:
    // nft image
    // document.getElementById('nft-container').style.backgroundImage = "url("+imageUrl+")";
    // title
    document.getElementById('title').innerHTML = data.title;
    // timestamp (top righthand side)
    document.getElementById('mark').innerHTML = data.mark + ".17FEB2021";
    // autograph (single for this version - but needs to be multiple)
    document.getElementsByClassName('autograph')[0].innerHTML = data.twitterId + ".17022021";
    // twitter photo url
    document.getElementsByClassName('photo-url')[0].innerHTML = data.photoUrl;
    // 2. Return SVG image
    return document.getElementById('nft-container').innerHTML;
  }, {
    imageUrl, 
    data, 
    base64Encode 
  });
  // For debugging only:
  await page.screenshot({ path: 'test.png' });
  console.log(svgOutput);
  await browser.close();
}

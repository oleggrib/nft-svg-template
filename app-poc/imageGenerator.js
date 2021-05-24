const cheerio = require('cheerio');
// const isLightContrastImage = require('./isLightContrastImage');

// Enable for SVG to be converted to Base64
const svg64 = require('svg64');
const fetch = require('node-fetch');
const sizeOf = require('image-size');

// SVG Templates:
const templates = {
  "REQUESTING": require("./htmlTemplates/notSignedSVG"),
  "SIGNED": require("./htmlTemplates/signedSVG")
}

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

module.exports = async ({
  templateType="REQUESTING",
  base64Encode,
  title,
  imageUrl,
  data
}) => {

  // load SVG template type
  const $ = cheerio.load(templates[templateType]);
  // fetch the NFT Data 
  const imageUrlData = await fetch(imageUrl);
  // get Content type
  const contentType = await imageUrlData.headers.get('content-type');
  // variable to store image in Base64 format
  let imageBase64, imgH, imgW;

  // if SVG
  if (contentType.indexOf("svg") > -1) {
    
    // get SVG element from response
    const svg = await imageUrlData.text();
    // [x, y, width, height]

    const viewBox = $(svg).attr('viewBox').split(' ');
    // base64 encode SVG
    imageBase64 = svg64(svg);

    if(viewBox){
      // apply height width of SVG from ViewBox values
      imgW = viewBox[2];
      imgH = viewBox[3];
    } else { // TODO Ensure that we always know the image size
      imgW = 1000;
      imgH = 1000;
    }

  }

  // if other (PNG, JPG, Gif)
  if (contentType.indexOf("svg") <= -1) {

    const imageBuffer = await imageUrlData.buffer();
    imageBase64 = `data:image/${contentType};base64,`+imageBuffer.toString('base64');
    const dimensions = sizeOf(imageBuffer);
    imgH = dimensions.height;
    imgW = dimensions.width;

  }

  // set the image height and width and apply scale of labelling to image
  if(imgW && imgH) {

    // determine shortest in length (so we can apply the most suitable labelling).
    const shortestInLength = imgW < imgH ? imgW : imgH;
    // using REM calculate the template layout scale (design original based from a 400px width)
    const rootPixelSize = shortestInLength / 16 * 0.64;
    console.log('rootPixelSize', rootPixelSize);
    // Apply Calculation
    $('.autograph-nft-wrapper').eq(0).css({ 'font-size': rootPixelSize + 'px' });
    // apply height and width: to autograph-nft-wrapper + autograph-nft-fo
    $('.autograph-nft-wrapper').eq(0).attr({ height: imgH, width: imgW });
    $('.autograph-nft-fo').eq(0).attr({ height: imgH, width: imgW });

  }

  // build date stamp string
  var d = new Date();
  var n = d.getMonth();
  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const dateStamp = `${d.getDate()}${months[n]}${d.getFullYear()}`;
  
  // Apply NFT Background colour
  $('.autograph-nft').eq(0).css('background-image', 'url(' + imageBase64 + ')');
  // Apply Stamp
  $('.stamp').eq(0).html(`${data[0].mark}.${dateStamp}`);
  // Apply status
  $('.status').eq(0).html(`${title}`);

  // Apply Labels
  let labelTemplates = '';
  // add labels
  data.map((label, index) => {
    if (index < 3) { // 3 is max ammount of autographs that can show on screen.

      // GET Profile Photo e.g. from data
      // https://www.cryptokitties.co/icons/logo.svg

      labelTemplates += `
        <div class="label">
          <div
            class="photo-url" 
            style="backgroundImage: url('')"
          ></div>
          <div class="profile-img"></div>
          <div class="autograph">
            ${label.twitterId}.${label.mark}
          </div>
        </div>
      `;
    }
  });
  
  // when there are too many autographs to display, add the length of the additional.
  if (data.length > 3) { 
    const maxLabelTemplate = `
    <div class="label">
      AND ${data.length -3} MORE...
    </div>
  `;
    labelTemplates += maxLabelTemplate;
  };
  
  // add all labels
  $('.label-container').eq(0).html(`${labelTemplates}`);

  // integrate smarts here (Get colour)
  const isLightImage = true;

  // Define if the colour theme for text is black or white.
  const colourTheme = isLightImage ? "black" : "white";
  const labelbackgroundCRBGA = isLightImage ? "rgba(0,0,0,0.24)" : "rgba(255,255,255,0.24)";

  // apply white / black colour theme
  $('.label, .not-signed').css("background-color", labelbackgroundCRBGA);
  $('.label, .autograph, .not-signed, .status, .stamp').css({ 'color': colourTheme });

  // Cheerio provides the changes within a html document format
  // to return the SVG we remove this and provide the SVG 
  // data only

  // prepare output
  const removeList = [
    "<html><head></head><body>",
    "</body></html>"
  ];

  // output is SVG wrapped in html
  let output = $.html();

  // remove the outer html wrapper
  removeList.map((item) => {
    output = output.replace(item, "");
  })

  return output;

}
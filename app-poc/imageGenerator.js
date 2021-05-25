const cheerio = require('cheerio');
const isLightContrastImage = require('./isLightContrastImage');

// Enable for SVG to be converted to Base64
const svg64 = require('svg64');
const fetch = require('node-fetch');
const sizeOf = require('image-size');

// SVG Template
const template = require("./htmlTemplates/labelled_autograph_template");

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
  base64Encode=true,
  imageUrl,
  data
}) => {

  console.time("Application");
  
  // load SVG template
  const $ = cheerio.load(template);
  // fetch the NFT Data 
  const imageUrlData = await fetch(imageUrl);
  // get Content type
  const contentType = await imageUrlData.headers.get('content-type');
  // variable to store image in Base64 format
  let imageBase64, imgH, imgW;

  // if SVG
  if (contentType.indexOf("svg") > -1) {
    
    // get SVG element from response
    const svgUrlData = await imageUrlData.text();
    // [x, y, width, height]

    // base64 encode SVG
    imageBase64 = svg64(svgUrlData);

    const svgViewBox = $("svg").attr('viewBox');
    const svgWidth = $("svg").attr('width');
    const svgHeight = $("svg").attr('height');
    let svgViewBoxData = svgViewBox ? $(svg).attr('viewBox').split(' ') : undefined;
  
    if(svgViewBoxData){
      // apply height width of SVG from ViewBox values
      imgW = viewBoxData[2];
      imgH = viewBoxData[3];
    } else if(svgWidth && svgHeight) {
      // apply height width of SVG from W/H values
      imgW = svgWidth;
      imgH = svgHeight;
    } else {
      // fallback if an image size cannot be found
      imgW = 500;
      imgH = 500;
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
  $('.status').eq(0).html(`${data[0].title}:`);

  // Apply Labels
  let labelTemplates = '';
  // add labels
  data.map((label, index) => {
    if (index < 3) { // 3 is max ammount of autographs that can show on screen.
      labelTemplates += `
        <div class="label">
          <div class="profile-img"></div>
          <div class="autograph">
            ${label.name}.${label.twitterId}
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

  // Add photos
  data.map(async (label, index) => {
    if (index < 3) { // 3 is max ammount of autographs that can show on screen.
      const imagePhotoURL = await fetch(data[index].photoURL);
      const imagePhotoURLBuffer = await imagePhotoURL.buffer();
      const photoURLContentType = await imagePhotoURL.headers.get('content-type');
      imagePhotoURLBase64 = `data:image/${photoURLContentType};base64,`+imagePhotoURLBuffer.toString('base64');
      $('.profile-img').eq(index).css('background-image', 'url(' + imagePhotoURLBase64 + ')');
    }
  });

  // remove the 'not signed label' when signed view
  if(data[0].title.toUpperCase() === "SIGNED") {
    $('.not-signed').remove();
  }

  // integrate smarts here (Get colour)
  let isLightImage = false;

  // TODO create SVG version of isLightContrastImage()

  // not SVG
  if (contentType.indexOf("svg") <= -1) {
    isLightImage = await isLightContrastImage({
      x: imgW - (imgW / 4), // start x
      y: 0, // start y
      dx: imgW, // end x
      dy: imgH, // end y
      imageUrl 
    });
  }

  // Define if the colour theme for text is black or white.
  const colourTheme = isLightImage ? "black" : "white";
  const labelbackgroundCRBGA = isLightImage ? "rgba(0,0,0,0.24)" : "rgba(255,255,255,0.24)";

  // apply white / black colour theme
  $('.label, .not-signed').css("background-color", labelbackgroundCRBGA);
  $('.label, .autograph, .not-signed, .status, .stamp').css({ 'color': colourTheme });
  
  // Allow labels to reach up to 90% of the width of the container
  $('.label').css({ 'max-width': (imgW * 0.7) + "px" });

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

  // console.log("Type: " + contentType + " Size W: " + imgW + " Size H: " + imgH);
  console.timeEnd("Application");

  return output;

}
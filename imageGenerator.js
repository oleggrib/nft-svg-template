const cheerio = require('cheerio');

// convert
const svg2png = require('svg-png-converter').svg2png;

// lib to detect image contrast returning if image is light or dark
const isLightContrastImage = require('./isLightContrastImage');

// Reads the Barlow Font widths (needed to correctly calculate width of labels)
const googleFontData = require('./googleFontData');

// Enable for SVG to be converted to Base64
const svg64 = require('svg64');
const fetch = require('node-fetch');
const sizeOf = require('image-size');

// SVG Template
const template = require("./htmlTemplates/SVG-Template-Test-Output");

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
  imageUrl,
  data,
  base64Encode,
  format
) => {

  // console.time("Application");

  let imageBase64, imgH, imgW, imageBuffer, svgUrlData; 
  
  // load SVG template
  const $ = cheerio.load(template);
  
  // fetch the NFT Data 
  const imageUrlData = await fetch(imageUrl);
  
  // get Content type
  const contentType = await imageUrlData.headers.get('content-type');
  
  // if SVG
  if (contentType.indexOf("svg") > -1) {

    // get SVG element from response
    svgUrlData = await imageUrlData.text();
    // [x, y, width, height]

    // base64 encode SVG
    imageBase64 = svg64(svgUrlData);

    const svgEl = $(svgUrlData);
    const svgViewBox = svgEl.attr('viewBox');
    const svgWidth = svgEl.attr('width');
    const svgHeight = svgEl.attr('height');
    let svgViewBoxData = svgViewBox ? svgEl.attr('viewBox').split(' ') : undefined;
  
    if (svgViewBoxData){
      // apply height width of SVG from ViewBox values
      imgW = svgViewBoxData[2];
      imgH = svgViewBoxData[3];
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

    imageBuffer = await imageUrlData.buffer();
    imageBase64 = `data:image/${contentType};base64,`+imageBuffer.toString('base64');
    const dimensions = sizeOf(imageBuffer);
    imgH = dimensions.height;
    imgW = dimensions.width;

  }

  let svgMargin, rootPixelSize, outerMargin;

  // set the image height and width and apply scale of labelling to image
  if (imgW && imgH) {

    // determine shortest in length (so we can apply the most suitable labelling).
    const shortestInLength = imgW < imgH ? imgW : imgH;

    // console.log(shortestInLength);

    // scale baseline of autograph / timestamp data
    rootPixelSize = shortestInLength / 16 * 0.64;
    // Apply Calculation (height / width)
    $('.autograph-nft-wrapper').css({ height: imgH, width: imgW });
    $('.autograph-nft-wrapper').attr({ 'viewBox': `0 0 ${imgW} ${imgH}` });

    // common margin 
    svgMargin = rootPixelSize * 3;

    // 5% outer margin
    outerMargin = shortestInLength * 0.05;

    $('.autograph-nft-not-signed text tspan').eq(0).attr({ 
      "x": outerMargin * 1.2, 
      "y": (outerMargin) * 2.2, 
      "font-size": rootPixelSize * 1.6 
    });
    $('.autograph-nft-not-signed text tspan').eq(1).attr({ 
      "x": outerMargin * 1.2, 
      "y": (outerMargin) * 3.5, 
      "font-size": rootPixelSize * 1.6 
    });

    // Not Signed Background
    $('.autograph-nft-not-signed rect').attr({ 
      "x": outerMargin,
      "y": outerMargin,
      "width": svgMargin * 3.7, 
      "height": svgMargin * 1.2 
    });
    // Timestamp positioning
    $('.timestamp text').attr({ 
      "x": outerMargin,
      "y": - (imgW - (outerMargin * 1.5)), 
      "font-size": rootPixelSize * 1 
    }); 
  }

  // build date stamp string
  var d = new Date();
  var n = d.getMonth();
  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const dateStamp = `${d.getDate()}${months[n]}${d.getFullYear()}`;
  
  // if SVG - Embed the data directly
  if (contentType.indexOf("svg") > -1) {
    $('.autograph-nft-image-container').html($(svgUrlData));
  }
  
  // if Image (PNG, Giff, Jpeg) - embed the data inside the image element
  if (contentType.indexOf("svg") <= -1) {
    $('.autograph-nft-image').eq(0).attr({ 
      'href': imageBase64, 
      'height': imgH,
      'width': imgW
    });
  }

  // $('.label image').eq(index).attr('href', imagePhotoURLBase64);
  // $('.autograph-nft').eq(0).css('background-image', 'url(' + imageBase64 + ')');
  // Apply Stamp
  $('.timestamp text').text(`${data[0].mark}.${dateStamp}`);
  // Apply status TODO
  $('.status text').eq(0).text(`${data[0].title}`);

  // Apply Labels
  let labelTemplates = '';
  
  // add labels
  let incrementVal;

  // Collect the last three labels
  let labelData = data.slice(0, 3);

  // Collect the last three labels
  // if (data.length > 3) labelData.push("LABEL");

  // Revers to we have last to first order
  labelData = labelData.reverse();

  let lastLabelYPos;

  labelData.map((label, index) => {

    const labelHeight = rootPixelSize * 1.7;
    let textWidth = 0;
    let space = 1.1;
    let labelPositionByIndex = index * (labelHeight * space);
    let offset = data.length > 3 ? labelHeight * 1.8 : 0;
    let addOuterMargin = data.length <= 3 ? outerMargin : 0;
    const yPos = imgH - labelHeight - labelPositionByIndex - offset - addOuterMargin;
 
    // let textWidth = 0; 
    label.name.match(/./g).concat(['.']).concat(label.twitterId.match(/./g)).map(char => {
      const val = googleFontData[char];
      // default if char not found e.g. Special Char (fall back)
      // Applies the last disovered char or applies the font size
      if(!val) textWidth += incrementVal ? incrementVal : 21;
      else {
        // Calulate and increment the width.
        incrementVal = Math.round(googleFontData[char] * (rootPixelSize * 1.3/10));  
        textWidth += incrementVal;
      }
    });
    // space for photo
    textWidth += rootPixelSize * 0.1;
    const imgWidth = rootPixelSize * 1.4;
    const imgPadding = rootPixelSize * 0.15;
    const autographFontSize = Math.round(rootPixelSize * 1.1);
    // label templates
    labelTemplates += `
      <svg class="label" xmlns="http://www.w3.org/2000/svg" x="${(imgW - textWidth) - (outerMargin)}" y="${yPos}">
        <rect x="0" y="0" width="${textWidth}" height="${rootPixelSize * 1.7}" style="fill:rgb(255,255,255)" fill-opacity="0.5" rx="2"></rect>
        <text style="font-family: 'Barlow'; fill:white;" font-size="${autographFontSize}">
            <tspan x="${rootPixelSize * 1.8}" y="${rootPixelSize * 1.2}">${label.name}.${label.twitterId}</tspan>
        </text>
        <svg x="${imgPadding}" y="${imgPadding}" width="${imgWidth}" height="${imgWidth}">
          <defs>
            <clipPath id="myCircle">
              <circle cx="${imgWidth/2}" cy="${imgWidth/2}" r="${imgWidth/2}" fill="#FFFFFF" />
            </clipPath>
          </defs>
          <image width="${imgWidth}" height="${imgWidth}" clip-path="url(#myCircle)" />
          </svg>
      </svg>
    `;

    lastLabelYPos = yPos;
  });

  // when there are too many autographs to display, add a more with the number of labels not shown.
  if (data.length > 3) {
    const labelHeight = rootPixelSize * 1.7;
    const autographFontSize = Math.round(rootPixelSize * 1.1);
    const yPos = imgH - labelHeight * 1.7; 
    const maxLabelTemplate = `
      <svg class="label" xmlns="http://www.w3.org/2000/svg" x="${(imgW - (autographFontSize * 6.5)) - (outerMargin)}" y="${yPos}">
        <g>
          <rect x="0" y="0" width="${autographFontSize * 6.5}" height="${labelHeight}" style="fill:rgb(255,255,255)" fill-opacity="0.5" rx="2"></rect>
          <text style="font-family: 'Barlow'; fill:white;" font-size="${autographFontSize}">
            <tspan x="${rootPixelSize * 0.2}" y="${rootPixelSize * 1.2}">AND ${data.length -3} MORE...</tspan>
          </text>
        </g>
      </svg>
    `;
    labelTemplates += maxLabelTemplate;
  };
  
  // add all labels
  $('.label-container').eq(0).append(`${labelTemplates}`);

  // Add profile photos
  await Promise.all(labelData.map(async (label, index)  => {
    const imagePhotoURL = await fetch(label.photoURL);
    const imagePhotoURLBuffer = await imagePhotoURL.buffer();
    const photoURLContentType = await imagePhotoURL.headers.get('content-type');
    imagePhotoURLBase64 = `data:image/${photoURLContentType};base64,`+imagePhotoURLBuffer.toString('base64');
    $('.label image').eq(index).attr('href', imagePhotoURLBase64);
  }));

  let xPosStatus;
  if (data[0].title.toUpperCase().indexOf("SIGNED") > -1) {  
    xPosStatus = (imgW - rootPixelSize * 3.2) - (outerMargin); 
  } else { 
    xPosStatus = (imgW - rootPixelSize * 5.2) - (outerMargin); 
  }

  $('.status').attr({
    "x": xPosStatus,
    "y": lastLabelYPos - rootPixelSize * 4
  });
  
  // Note the y definition is crutial to the accuracy of the text positioning of 
  // .status. This relative to scale value is provided below, then
  // scale based positioning can be applied. 
  $('.status text').attr({
    "font-size": rootPixelSize * 0.8,
    "y": rootPixelSize * 3.2
  });
  
  // // remove the 'not signed label' when signed view
  // if (data[0].title.toUpperCase() === "SIGNED") {
  //   $('.not-signed').remove();
  // };

  // // integrate smarts here (Get colour)
  // let isLightImage = true;

  // // not SVG
  // if (contentType.indexOf("svg") <= -1) {
  //   // can be increased at the cost of performance
  //   const imageArea = 5;
  //   isLightImage = await isLightContrastImage({ 
  //     imageBuffer,
  //     x: 0,
  //     y: 0,
  //     dx: (imgW/imageArea) > 1 ? (imgW/imageArea) : 1,
  //     dy: (imgH/imageArea) > 1 ? (imgH/imageArea) : 1,
  //   });
  // }

  // // SVG - TODO 
  // // if (contentType.indexOf("svg") > -1) {
  // //   isLightImage = await isLightContrastImage({ imageBuffer: imageBuffer });
  // // }

  // // Define if the colour theme for text is black or white.
  // const colourTheme = isLightImage ? "black" : "white";
  // const labelbackgroundCRBGA = isLightImage ? "rgba(0,0,0,0.24)" : "rgba(255,255,255,0.24)";

  // // apply white / black colour theme
  // $('.label, .not-signed').css("background-color", labelbackgroundCRBGA);
  // $('.label, .autograph, .not-signed, .status, .stamp').css({ 'color': colourTheme });
  
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
  });

  // Add this back to the output file when done
  // <?xml version="1.0" encoding="UTF-8" standalone="no"?>
  // <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

  // Base64 output if parameter flag set to true
  if (base64Encode) output = svg64(output);

  // console.log("Type: " + contentType + " Size W: " + imgW + " Size H: " + imgH);
  // console.timeEnd("Application");

  // // define image data return type
  if (format.toUpperCase() === 'PNG') {
    const pngOutput = await svg2png({
      input: output,
      encoding: base64Encode ? 'dataURL' : 'buffer',
      format: 'png',
    });
    output = pngOutput;
  }
  
  return output;

}
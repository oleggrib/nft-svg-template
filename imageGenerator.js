const cheerio = require('cheerio');

// lib to detect image contrast returning if image is light or dark
const isLightContrastImage = require('./isLightContrastImage');

// Reads the Barlow Font widths (needed to correctly calculate width of labels)
const googleFontData = require('./googleFontData');

// Enable for SVG to be converted to Base64
const svg64 = require('svg64');
const fetch = require('node-fetch');
const sizeOf = require('image-size');

// SVG Template
// const template = require("./htmlTemplates/labelled_autograph_template");
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
) => {

  // console.time("Application");

  let imageBase64, imgH, imgW, imageBuffer, svgUrlData; 
  
  // load SVG template
  const $ = cheerio.load(template);
  
  // fetch the NFT Data 
  const imageUrlData = await fetch(imageUrl);
  
  // get Content type
  const contentType = await imageUrlData.headers.get('content-type');

  // if(!contentType) throw 'Could not define content type';
  
  // if SVG
  // if (contentType.indexOf("svg") > -1) {

  //   // get SVG element from response
  //   svgUrlData = await imageUrlData.text();
  //   // [x, y, width, height]

  //   // base64 encode SVG
  //   imageBase64 = svg64(svgUrlData);

  //   const svgEl = $("svg");
  //   const svgViewBox = $(svgEl).attr('viewBox');
  //   const svgWidth = $(svgEl).attr('width');
  //   const svgHeight = $(svgEl).attr('height');
  //   let svgViewBoxData = svgViewBox ? $(svg).attr('viewBox').split(' ') : undefined;
  
  //   if (svgViewBoxData){
  //     // apply height width of SVG from ViewBox values
  //     imgW = viewBoxData[2];
  //     imgH = viewBoxData[3];
  //   } else if(svgWidth && svgHeight) {
  //     // apply height width of SVG from W/H values
  //     imgW = svgWidth;
  //     imgH = svgHeight;
  //     $(svg).attr('viewBox') = `[0, 0, ${imgW}, ${imgH}]`;
  //   } else {
  //     // fallback if an image size cannot be found
  //     imgW = 500;
  //     imgH = 500;
  //     $(svg).attr('viewBox') = `[0, 0, 500, 500]`;
  //   }
  // }

  // if other (PNG, JPG, Gif)
  if (contentType.indexOf("svg") <= -1) {

    imageBuffer = await imageUrlData.buffer();
    imageBase64 = `data:image/${contentType};base64,`+imageBuffer.toString('base64');
    const dimensions = sizeOf(imageBuffer);
    imgH = dimensions.height;
    imgW = dimensions.width;

  }

  let svgMargin, rootPixelSize;

  // set the image height and width and apply scale of labelling to image
  if (imgW && imgH) {

    // determine shortest in length (so we can apply the most suitable labelling).
    const shortestInLength = imgW < imgH ? imgW : imgH;
    // scale baseline of autograph / timestamp data
    rootPixelSize = shortestInLength / 16 * 0.64;
    // Apply Calculation (height / width)
    $('.autograph-nft-wrapper').css({ height: imgH, width: imgW });
    $('.autograph-nft-wrapper').attr({ 'viewBox': `0 0 ${imgW} ${imgH}` });

    // common margin 
    svgMargin = rootPixelSize * 3;

    // Not Signed Text
    $('.autograph-nft-not-signed text tspan').eq(0).attr({ 
      "x": rootPixelSize * 1.8, 
      "y": rootPixelSize * 3, 
      "font-size": rootPixelSize * 1.6 
    });
    $('.autograph-nft-not-signed text tspan').eq(1).attr({ 
      "x": rootPixelSize * 1.8, 
      "y": rootPixelSize * 4.6, 
      "font-size": rootPixelSize * 1.6 
    });
    // Not Signed Background
    $('.autograph-nft-not-signed rect').attr({ 
      "x": rootPixelSize * 1.5,
      "y": rootPixelSize * 1.5,
      "width": svgMargin * 3.7, 
      "height": svgMargin * 1.2 
    });
    // Timestamp positioning
    $('.timestamp text').attr({ "x": rootPixelSize * 1.5, "y": - (imgW - (rootPixelSize * 2)), "font-size": rootPixelSize * 1 });
  }

  // build date stamp string
  var d = new Date();
  var n = d.getMonth();
  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const dateStamp = `${d.getDate()}${months[n]}${d.getFullYear()}`;
  
  // Apply NFT Background colour
  $('.nft').eq(0).attr('href', imageBase64);
  // Apply Stamp
  $('.timestamp text').text(`${data[0].mark}.${dateStamp}`);
  // Apply status
  // $('.status').eq(0).html(`${data[0].title}`);

  // Apply Labels
  let labelTemplates = '';
  
  // add labels
  data.map((label, index) => {
    if (index < 3) { // 3 is max ammount of autographs that can show on screen.
      let textWidth = 0;      
      label.name.match(/./g).concat(['.']).concat(label.twitterId.match(/./g)).map(char => {
        const val = googleFontData[char];
        // if(!val) textWidth += 18; // default if char not found e.g. Special Char.
        // font size is 16px.
        // but we want to use 21px etc.
        textWidth += Math.round(googleFontData[char]); // initial font size
      });

      console.log(textWidth);

      labelTemplates += `
        <svg class="label" xmlns="http://www.w3.org/2000/svg" x="0" y="${imgH - svgMargin * 1.2}">
            <rect x="0" y="0" width="${textWidth}" height="42" style="fill:rgb(255,255,255)" fill-opacity="0.5"></rect>
            <text style="font-family: 'Barlow'; fill:white;" font-size="${Math.round(rootPixelSize)}">
                <tspan x="0" y="30">${label.name}.${label.twitterId}</tspan>
            </text>
        </svg>
      `;
    }

    // 323 is what we want from Text Width.
    // 
  });
  
  // // when there are too many autographs to display, add the length of the additional.
  // if (data.length > 3) { 
  //   const maxLabelTemplate = `
  //   <div class="label">
  //     AND ${data.length -3} MORE...
  //   </div>
  // `;
  //   labelTemplates += maxLabelTemplate;
  // };
  
  // // add all labels
  $('.label-container').eq(0).append(`${labelTemplates}`);

  // // Add profile photos
  // await Promise.all(data.map(async (label, index)  => {
  //   const imagePhotoURL = await fetch(data[index].photoURL);
  //   const imagePhotoURLBuffer = await imagePhotoURL.buffer();
  //   const photoURLContentType = await imagePhotoURL.headers.get('content-type');
  //   imagePhotoURLBase64 = `data:image/${photoURLContentType};base64,`+imagePhotoURLBuffer.toString('base64');
  //   $('.profile-img').eq(index).css('background-image', 'url(' + imagePhotoURLBase64 + ')');
  // }));
  
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
  
  return output;

}
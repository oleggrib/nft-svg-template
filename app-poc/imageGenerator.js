const cheerio = require('cheerio');
const getImageDimensions = require("./utils/getImageDimensions");
const getBase64Image = require("./utils/getBase64Image");
const templates = {
  "REQUESTING": require("./htmlTemplates/notSignedSVG"),
  "SIGNED": require("./htmlTemplates/signedSVG")
}

// TODO: re-introduce this
// const getLightContrast = require('./utils/getLightContrast');

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
  const { imageUrlBase64, imageUrlBuffer } = await getBase64Image(imageUrl);

  // get image dimentions // TODO apply Height and Width
  const { imgH, imgW } = await getImageDimensions(imageUrlBuffer);

  // TODO Apply logic to determine theme
  const isLightImage = true;

  // define if the colour theme for text is black or white.
  const colourTheme = isLightImage ? "black" : "white";

  // build date stamp string
  var d = new Date();
  var n = d.getMonth();
  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const dateStamp = `${d.getDate()}${months[n]}${d.getFullYear()}`;
  
  // Apply NFT Background colour
  $('.autograph-nft').eq(0).css('background-image', 'url(' + imageUrlBase64 + ')');
  
  // Apply Stamp
  $('.stamp').eq(0).html(`${data[0].mark}.${dateStamp}`);
  
  // Apply status
  $('.status').eq(0).html(`${title}`);

  // Apply Labels
  let labelTemplates = '';
  // add labels
  data.map(async (label, index) => {
    if (index < 3) { // 3 is max ammount of autographs that can show on screen.

      // GET Profile Photo e.g. from data
      // https://www.cryptokitties.co/icons/logo.svg
      // const photoURL = await getBase64Image(label.photoURL);
      // photoURL.imageUrlBase64
      
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

  return $.html();

}
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
    data.map((label, index) => {
        if (index < 2) {
          // append label
          const labelTemplate = `<div class="label"><div class="photo-container"><img class="photo-url" alt="" src="https://pbs.twimg.com/profile_images/1196498439304929281/c87NCmb0_400x400.jpg"></div><div class="autograph">@BEEPLE</div></div>`;
          document.getElementById('label-container').innerHTML += labelTemplate;
          
          // // nft image
          // document.getElementById('nft-container').style.backgroundImage = "url("+imageUrl+")";
          // // title
          // document.getElementById('title').innerHTML = data[0].title;
          // // timestamp (top righthand side)
          // document.getElementById('mark').innerHTML = data[0].mark + ".17FEB2021";
          // // autograph (single for this version - but needs to be multiple)
          // document.getElementsByClassName('autograph')[0].innerHTML = data.twitterId + ".17022021";
          // // twitter photo url
          // document.getElementsByClassName('photo-url')[0].innerHTML = data.photoUrl;
        }
    });
    // Return image

    // testing to see if image loads
    await setTimeout(() => {}, 3000);

    // SVG
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


// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   page.setViewport({ width: 1280, height: 926 });

//   let counter = 0;
//   page.on('response', async (response) => {
//     const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
//     if (matches && (matches.length === 2)) {
//       const extension = matches[1];
//       const buffer = await response.buffer();
//       fs.writeFileSync(`images/image-${counter}.${extension}`, buffer, 'base64');
//       counter += 1;
//     }
//   });

//   await page.setContent(htmlString);
//   // await page.goto('https://intoli.com/blog/saving-images/');
//   await page.waitFor(10000);
//   await browser.close();
// })();

// // render of HTML serverside
// const puppeteer = require('puppeteer');
// // initial template design
// const htmlString = require("./htmlTemplate");

// fs = require('fs');

// const getImageContent = async (page, url) => {
//   const { content, base64Encoded } = await page._client.send(
//     'Page.getResourceContent',
//     { frameId: String(page.mainFrame()._id), url },
//   );
//   return content;
// };

// // function interface
// // imageUrl: string (NFT url)
// // data: [
// // {
// //    title: string; (Title of NFT)
// //    photoURL: string; (Photo of Twitter User)
// //    name: string; (Name of Twitter User)
// //    twitterId: string; (Handle)
// //    mark: string; (ID number)
// // }
// // ],
// // base64Encode: boolean

// module.exports = async (
//   imageUrl="", 
//   data={}, 
//   base64Encode=true 
// ) => {
//   const browser = await puppeteer.launch()
//   // create page 
//   const page = await browser.newPage()
//   // set page content to template (with loaded method - this needs further testing)
//   // await page.setContent(htmlString, { waitUntil: 'networkidle2' });
//   await page.setContent(htmlString);

//   try {
//     const url = await page.evaluate(() => {
//       return document.getElementById('nft-container');
//     });
//     const content = await getImageContent(page, url);
//     // const contentBuffer = Buffer.from(content, 'base64');
//     // fs.writeFileSync('logo-extracted.svg', contentBuffer, 'base64');
//   } catch (e) {
//     console.log(e);
//   }

//   // evaluate page / dom
//   // var svgOutput = await page.evaluate(async ({ 
//   //   imageUrl, 
//   //   data, 
//   //   base64Encode 
//   // }) => {
//   //   // Replace data:
//   //   // nft image
//   //   // document.getElementById('nft-container').style.backgroundImage = "url("+imageUrl+")";
//   //   // title
//   //   // document.getElementById('title').innerHTML = data.title;
//   //   // // timestamp (top righthand side)
//   //   // document.getElementById('mark').innerHTML = data.mark + ".17FEB2021";
//   //   // // autograph (single for this version - but needs to be multiple)
//   //   // document.getElementsByClassName('autograph')[0].innerHTML = data.twitterId + ".17022021";
//   //   // // twitter photo url
//   //   // document.getElementsByClassName('photo-url')[0].innerHTML = data.photoUrl;
//   //   // Return image
//   //   // SVG
//   //   // var output = await domtoimage.toSvg(document.getElementById('nft-container'), {});
//   //   // JPG
//   //   // var output = await domtoimage.toJpeg(document.getElementById('nft-container'), { quality: 0.95 })
//   //   // 
//   //   var output = await domtoimage.toPng(document.getElementById('nft-container'), { quality: 0.95 })
//   //   return output;
//   // }, {
//   //   imageUrl, 
//   //   data, 
//   //   base64Encode 
//   // });
//   // For debugging only:
//   // await page.screenshot({ path: 'test.png' });
//   // console.log(svgOutput);
//   // return svgOutput;
//   await browser.close();
// }

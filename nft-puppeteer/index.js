const puppeteer = require('puppeteer')

const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300&family=Bebas+Neue&family=Source+Code+Pro&display=swap" rel="stylesheet">
  <title>Document</title>
</head>
<body>
  <div id="nft-container" style="position: relative; width: 400px; height: 400px; background: url('https://www.verizon.com/about/sites/default/files/2020-11/metaverse-%231.jpg'); background-size: cover;">
    <div class="title-container" style="font-family: 'Source Code Pro'; font-size: 30px; position: absolute; left: 24px; top: 18px;">
      Viceland
    </div>    
    <div class="mark-container" style="position: absolute; right: 4px; top: 18px;">
      <p style="color: black; font-family: 'Barlow Condensed', sans-serif; writing-mode: vertical-rl;">
        1507.18FEB2021
      </p>
    </div>
    <div style="position: absolute; right: 20px; bottom: 18px;" class="autograph-container">
      <p style="text-align: right; font-family: 'Source Code Pro', monospace;">Signed:</p>
      <div class="label" style="display: flex; align-items:center; font-family: 'Bebas Neue', cursive; background-color: rgba(0,0,0,0.2); padding: 7px; border-radius: 3px;">
        <div style="background-color: white; border-radius: 30px; width: 30px; height: 30px;">
          <img style="width: 30px; border-radius: 30px" src="https://pbs.twimg.com/profile_images/1196498439304929281/c87NCmb0_400x400.jpg">
        </div>
        <div style="margin: 0 10px;">@BEEPLE</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(htmlString);
  async function screenshotDOMElement(opts = {}) {
    const padding = 'padding' in opts ? opts.padding : 0;
    const path = 'path' in opts ? opts.path : null;
    const selector = opts.selector;

    if (!selector)
        throw Error('Please provide a selector.');

    const rect = await page.evaluate(selector => {
        const element = document.getElementById(selector);
        if (!element)
            return null;
        const {x, y, width, height} = element.getBoundingClientRect();
        return {left: x, top: y, width, height, id: element.id};
    }, selector);

    if (!rect)
        throw Error(`Could not find element that matches selector: ${selector}.`);

    return await page.screenshot({
        path,
        clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
        }
    });
}
  await screenshotDOMElement({
    path: 'element.png',
    selector: 'nft-container',
    padding: 0
  });

  await browser.close()
})()
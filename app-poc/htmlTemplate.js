/* 

  HTML Template:

  This is the first and initial template to generate images from.
  As new requirements are given, new templates can be created to help
  scale the imgage generation tool.

  Notes:

  The 'label-container' is updated 

  
*/

module.exports = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"></script>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300&family=Bebas+Neue&family=Source+Code+Pro&display=swap" rel="stylesheet">
    <title>Document</title>
    <style>
      #nft-container {
        position: relative; width: 600px; height: 600px; background-size: cover;
      }
      #time-stamp {
        font-family: 'Barlow Condensed';
      }
      .mark-container {
        position: absolute; right: 4px; top: 18px;
      }
      #mark {
        font-family: 'Barlow Condensed', sans-serif; writing-mode: vertical-rl; color: black;
      }
      .title-container {
        font-size: 30px; position: absolute; left: 24px; top: 18px;
      }
      #title {
        font-family: 'Source Code Pro';
      }
      .autograph-container {
        position: absolute; right: 20px; bottom: 18px;
      }
      #status {
        font-family: 'Source Code Pro', monospace; text-align: right; 
      }
      .label {
        height: 28px; margin: 14px 0; display: flex; align-items:center; background-color: rgba(0,0,0,0.24); backdrop-filter: blur(5px); backdrop-filter: blur(5px); padding: 7px; border-radius: 3px;
      }
      .photo-url {
        width: 28px; height: 28px; border-radius: 28px;
      }
      .autograph {
        font-family: 'Bebas Neue', cursive; margin: 0 10px;
      }
    </style>
  </head>
  <body>
    <div id="outputWrapper" style="width: 600px; height: 600px;">
      <div id="nft-container" style="background: url('https://www.verizon.com/about/sites/default/files/2020-11/metaverse-%231.jpg'); background-size: cover;">
        <div class="title-container">
          <div id="title">Viceland</div>
        </div>
        <div class="mark-container">
          <p id="mark">
            1507.18FEB2021
          </p>
        </div>
        <div class="autograph-container">
          <p id="status">Signed:</p>
          <div id="label-container"></div>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

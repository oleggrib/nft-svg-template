# nft-svg-template

See for converting the image to SVG, Jpg, PNG etc.
https://www.npmjs.com/package/html-to-image

## TODO's

- Pull down twitter profile image [TODO]
- Remix-able NFT's Flow e.g. When adding an already Remixed NFT [TODO]
- Integration with web team [TODO]
- Check image colour SVG [TODO]
- Add Ellipsis (when autograph will go out of bounds of the Remixed NFT) [TODO]
- [BUG] SVG sizes are not always found [TODO]
- [BUG] - Layering, ensure SVG Images sit below content [TODO]

## TODO's DONE:

- Animated SVG inside SVG Tests [DONE]
- Render SVG's Readable on MAC / PC / WEB [DONE]
- SVG - Get image Size (POC) [DONE]
- Finalise template styles [DONE]
- Connect with Hu (interface/integration) [DONE]
- Template selection confirmed update to interface with team / update code [DONE] 
- Scale Autograph % [DONE]
- Embed Google fonts [DONE]
- Add the logic to say '+ 4 more etc - more than 3 autographs' [DONE]

## Enhancement (however this is mostly not applicable where we collect the data before simulating the browser):

1. Review this as a means to get more accurate screen captures / switching out the timer! https://docs.percy.io/docs/capturing-lazy-loading-images

## Development (app-poc) 

1. Open the folder `app-poc`
2. run `node index.js`

This loads the mock function imageGenerator() with params.

### Reading Dev notes / Links / Resources

- https://amio.github.io/embedded-google-fonts/ (Base64 Google Fonts)
- https://github.com/svg/svgo (SVG optimiser)
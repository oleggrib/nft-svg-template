# nft-svg-template

See for converting the image to SVG, Jpg, PNG etc.
https://www.npmjs.com/package/html-to-image

## TODO's

1. SVG - Get image Size [DONE]
2. Finalise all template styles [TODO]
3. Connect with Hu (interface/integration)
4. Template selection logic (Signed/Not Signed) [DONE] 
5. Light/Dark Detector Lib API Support SVG [TODO]
6. Scale Autograph % [TODO]
7. Add Ellipsis (... when autograph will go out of bounds of the Remixed NFT) [TODO]
8. Integration with web team [TODO]

## TODO's DONE:

- Convert input to Remixed NFT (DONE)
- Embed Google fonts (DONE)
- Add the logic to say '+ 4 more etc - more than 3 autographs' (DONE)

## Enhancement (however this is mostly not applicable where we collect the data before simulating the browser):

1. Review this as a means to get more accurate screen captures / switching out the timer! https://docs.percy.io/docs/capturing-lazy-loading-images

## Development (app-poc) 

1. Open the folder `app-poc`
2. run `node index.js`

This loads the mock function imageGenerator() with params.

### Reading Dev notes / Links / Resources

- https://amio.github.io/embedded-google-fonts/ (Base64 Google Fonts)
- https://github.com/svg/svgo (SVG optimiser)
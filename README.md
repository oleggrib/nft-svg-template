# nft-svg-template

See for converting the image to SVG, Jpg, PNG etc.
https://www.npmjs.com/package/html-to-image

## MVP TODO's

- Re-apply 'Signed' / 'Requested' labels (done)
- Correct labelling logic, works for 1, 2, 3, breaks at 4. (done)
- Re-enable the SVG image types (done)
- Correct label widths
- Re-apply the colour checking
- Re-apply image format 'png' / 'svg'

## TODO's

- Correct image re-sizing calculation (so it looks the same regardless of scaling)
- "get-image-colors": "^4.0.0" Security warning / review / solution a fix
- Error Handling
- Security checks e.g. checking types / Security image libs
- Check image colour SVG
- Switch out Cheerio to https://github.com/inikulin/parse5 (Cheerio is being installed by other deps / this task may not be required unless replacing other deps etc)
- Unit Tests
- Bench mark performance / Optimise code + increase performance

### Performance Test

`using imageUrl: "https://polkadot.network/content/images/2020/06/Polkadot_OG.png"`

Application: 325ms (average from several tests)
Application: 300ms (Without Google Font from several tests)
Application: 90ms (get image URL - no processing)
Application: 300ms Scanning slightly larger area of bitmap

## Enhancement (however this is mostly not applicable where we collect the data before simulating the browser):

1. Review this as a means to get more accurate screen captures / switching out the timer! https://docs.percy.io/docs/capturing-lazy-loading-images

## Development (app-poc) 

1. Open the folder `app-poc`
2. run `node index.js`

This loads the mock function imageGenerator() with params.

### Reading Dev notes / Links / Resources

- https://amio.github.io/embedded-google-fonts/ (Base64 Google Fonts)
- https://github.com/svg/svgo (SVG optimiser)
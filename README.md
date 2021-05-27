# nft-svg-template

See for converting the image to SVG, Jpg, PNG etc.
https://www.npmjs.com/package/html-to-image

## Options to progress:

a: Use native SVG. Is this possible etc. (2nd fastest performance)

This would work under a tiered check. From tests Native SVG's that do not use Foreign Object are supported with Sharp image converter. However, from looking across OpenSea you will find that many animated SVG's have been created using this feature of the SVG spec.
See: https://storage.opensea.io/files/0fbeacdb0bf089800109f3b1d0401c6b.svg

Solution could be:

- Try to convert with Sharp
- Pass - return image
- Fail - return SVG only / or use a headless browser solution

current conclusion: Not feasible.

b: Canvas image converter on Client. (fastest performance - because of task offload to client side)

c: Use Puppeteer / Hosted Chrome Client using WS: (fast but more costly to run)

## TODO's

- Options to progress POC
- Correct image re-sizing calculation (so it looks the same regardless of scaling)
- "get-image-colors": "^4.0.0" Security warning / review / solution a fix
- Error Handling (messaging)
- Security checks e.g. checking types / Security image libs
- Check image colour SVG (cannot be consistently without conversion to bitmap)
- Bench mark performance / Optimise code + increase performance
- Wrong MIME of the uploaded file (received “text/html” while waiting for “image/svg+xml”)Anyway, do not worry, you still got a properly result and this warning is not related to the data encoding.

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
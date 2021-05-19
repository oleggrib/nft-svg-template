# nft-svg-template

See for converting the image to SVG, Jpg, PNG etc.
https://www.npmjs.com/package/html-to-image

## TODO's

* = Essential

- * Apply Invision Styling (height / width / font sizing)
- * Image reader to detect if an image is closer to black / white as a whole
- * Inject mock data using the same interface into this example
- * Work out how to convert this to an image (DONE)
- * Fix the fonts (loading of Google Fonts)
- * Add the logic to say '+ 4 more etc - more than 3 autographs' (DONE)
- Add another option to select the output as SVG / PNG (Base64)

## Development (app-poc) 

1. Open the folder `app-poc`
2. run `node index.js`

This loads the mock function imageGenerator() with params.

## Development (nft-puppeteer) (reference/read only)

1. Open the `nft-puppeteer` folder. 
2. Run `node index.js`
3. This will output the HTML as an image
4. (TODO) - see if we can output as SVG, PNG, JPG with this library: https://www.npmjs.com/package/html-to-image
5. Connect this code to the Application interface
6. Inject into the HTML template the text and images from the parameters

### Reading Dev notes / Links

- https://jsfiddle.net/nicktaras/3qgwr6L4/ (link to help with loading of Fonts)
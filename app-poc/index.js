fs = require('fs');
const imageGenerator = require("./imageGenerator");
const fetch = require('node-fetch');

// imageUrl
// data: [
// {
//    title: string; (Title of NFT)
//    photoURL: string; (Photo of Twitter User)
//    name: string; (Name of Twitter User)
//    twitterId: string; (Handle)
//    mark: string; (ID number)
// }
// ],
// base64Encode

imageGenerator(
  "https://s3.amazonaws.com/images.seroundtable.com/google-rainbow-texture-1491566442.jpg",
  [
    {
      title: "Bob",
      photoURL: "https://pbs.twimg.com/profile_images/1196498439304929281/c87NCmb0_400x400.jpg",
      name: "Bob",
      twitterId: "@Bob",
      mark: "17654321"
    },
    {
      title: "Alice",
      photoURL: "https://pbs.twimg.com/profile_images/1196498439304929281/c87NCmb0_400x400.jpg",
      name: "Auto",
      twitterId: "@Alice",
      mark: "123456789097654321"
    },
    {
      title: "Bar",
      photoURL: "https://pbs.twimg.com/profile_images/1196498439304929281/c87NCmb0_400x400.jpg",
      name: "Bar",
      twitterId: "@Bar",
      mark: "12789097654321"
    },
  ],
  true
).then((res) => {

  // console.log(res);

  // NOTE: For the image alignment to work
  // You have to drag/drop the SVG into the browser.
  // I'll look into this issue.
  fs.writeFile('test.svg', res, function (err) {
    if (err) return console.log(err);
    console.log('Success');
  });
});
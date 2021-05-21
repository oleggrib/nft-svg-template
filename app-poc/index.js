fs = require('fs');
const imageGenerator = require("./imageGenerator");

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

imageGenerator({
  base64Encode: true,
  title: "Signed",
  templateType: "SIGNED",
  imageUrl:"https://raw.githubusercontent.com/nicktaras/json_mocks/b049c9f4e904690156ec0626a707c9007554f755/remixNFT2.svg",
  data: [
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
  ]
}).then((res) => {
  fs.writeFile('remixNFT.svg', res, function (err) {
    if (err) return console.log(err);
    console.log('Success');
  });
});

// Example images to test:
// "https://www.ledr.com/colours/white.jpg",
// "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13471/sparkles.gif",
// "https://i.pinimg.com/originals/a9/e5/06/a9e506364ae6b6892e6a126a2f021206.gif",
// "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg",

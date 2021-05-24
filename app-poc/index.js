fs = require('fs');
const imageGenerator = require("./imageGenerator");

// imageUrl
// data: [
//    title: string; (Title of NFT)
//    templateType: "SIGNED" or "REQUESTING"
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
  templateType: "REQUESTING",
  // imageUrl: "https://storage.opensea.io/files/49a2c73a565c7847c4d2af9a2419990d.svg",
  // imageUrl: "https://www.ledr.com/colours/white.jpg",
  // imageUrl: "https://lh3.googleusercontent.com/r-hAVIErP0UEiYUhoHU9KS53Wl25rzqpBCt2V4IzQRVxtncH2KqpU0m6_26l2eqoQSD3BWP8InLJNTomvMy2G2ZD=s0",
  // imageUrl: "https://storage.opensea.io/files/0fbeacdb0bf089800109f3b1d0401c6b.svg",
  imageUrl: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13471/sparkles.gif",
  // imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg",
  // imageUrl: "https://i.pinimg.com/originals/a9/e5/06/a9e506364ae6b6892e6a126a2f021206.gif",
  // imageUrl: "https://polkadot.network/content/images/2020/06/Polkadot_OG.png",
  data: [
    {
      title: "Bob",
      photoURL: "https://i.pinimg.com/originals/a9/e5/06/a9e506364ae6b6892e6a126a2f021206.gif",
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
    // console.log('Success');
  });
});

// Example images to test:
// "https://storage.opensea.io/files/0fbeacdb0bf089800109f3b1d0401c6b.svg"
// "https://polkadot.network/content/images/2020/06/Polkadot_OG.png"
// "https://pyxis.nymag.com/v1/imgs/8f8/e12/51b54d13d65d8ee3773ce32da03e1fa220-dogecoin.2x.rsocial.w600.jpg"
// "https://www.ledr.com/colours/white.jpg",
// "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13471/sparkles.gif",
// "https://i.pinimg.com/originals/a9/e5/06/a9e506364ae6b6892e6a126a2f021206.gif",
// "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg",

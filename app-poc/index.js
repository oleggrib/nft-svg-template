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
  // imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/1a/dd/6a/f0/paradise-taveuni.jpg",
  // imageUrl: "https://storage.opensea.io/files/49a2c73a565c7847c4d2af9a2419990d.svg",
  // imageUrl: "https://lh3.googleusercontent.com/r-hAVIErP0UEiYUhoHU9KS53Wl25rzqpBCt2V4IzQRVxtncH2KqpU0m6_26l2eqoQSD3BWP8InLJNTomvMy2G2ZD=s0",
  // imageUrl: "https://storage.opensea.io/files/0fbeacdb0bf089800109f3b1d0401c6b.svg",
  // imageUrl: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13471/sparkles.gif",
  // imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg",
  // imageUrl: "https://i.pinimg.com/originals/a9/e5/06/a9e506364ae6b6892e6a126a2f021206.gif",
  imageUrl: "https://polkadot.network/content/images/2020/06/Polkadot_OG.png",
  data: [
    {
      title: "Requesting",
      photoURL: "https://pbs.twimg.com/profile_images/264316321/beeple_headshot_beat_up_400x400.jpg",
      name: "@Beeple",
      twitterId: "138540329898953405390548540954098508950950495950985494541",
      mark: "17654321"
    },
    {
      title: "Signed",
      photoURL: "https://pbs.twimg.com/profile_images/879737418609553409/yjnyAhAI_400x400.jpg",
      name: "@cryptopunksbot",
      twitterId: "1385403298945986561",
      mark: "123456"
    },
    {
      title: "Signed",
      photoURL: "https://pbs.twimg.com/profile_images/1084788308595617793/DOnqq1OM_400x400.jpg",
      name: "@ethereum",
      twitterId: "1385403298945986561",
      mark: "154321"
    },
    {
      title: "Signed",
      photoURL: "https://pbs.twimg.com/profile_images/1389823228533739522/-Tj2WF_6_400x400.jpg",
      name: "@Polkadot",
      twitterId: "1385403298945986561",
      mark: "1154321"
    },
  ]
}).then((res) => {
  fs.writeFile('remixNFT.svg', res, function (err) {
    if (err) return console.log(err);
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

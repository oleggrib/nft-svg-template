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

imageGenerator(
  "https://www.verizon.com/about/sites/default/files/2020-11/metaverse-%231.jpg",
  {
    title: "Hello AutographNFT",
    photoURL: "https://pbs.twimg.com/profile_images/1196498439304929281/c87NCmb0_400x400.jpg",
    name: "Auto",
    twitterId: "@Autograph",
    mark: "123456789097654321"
  },
  true
).then((res) => {
  console.log(res);
});
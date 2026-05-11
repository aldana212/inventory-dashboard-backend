import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dqk8kw8sl",
  api_key: "859588244377658",
  api_secret: "B_Nr4AlslaNbEFwX9u9nvqz2nr0",
});

// async function testUpload() {
//   try {
//     const result = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg');
//     console.log("Conectado correctamente:", result.secure_url);
//   } catch (error) {
//     console.error("Error de conexión:", error.message);
//   }
// }

// testUpload();

export default cloudinary;

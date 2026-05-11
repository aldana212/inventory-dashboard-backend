import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // 🔥 nada en disco
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo imágenes"), false);
    }
    cb(null, true);
  },
});

export default upload;

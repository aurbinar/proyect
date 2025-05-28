import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../utils/images.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImageMiddleware = (fieldName) => {
  return [
    upload.single(fieldName),
    async (req, res, next) => {
      if (!req.file) return next();

      try {
        const streamUpload = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'dishes' },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });

        const result = await streamUpload();
        req.imageUrl = result.secure_url;
        next();
      } catch (error) {
        res.status(500).json({ message: 'Error al subir imagen a Cloudinary', error: error.message });
      }
    }
  ];
};

export default uploadImageMiddleware;
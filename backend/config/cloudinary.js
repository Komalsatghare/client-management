const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');
    return {
      folder: 'client-management',
      resource_type: 'auto', // Important for docs/pdfs
      allowed_formats: ['jpg', 'png', 'pdf', 'doc', 'docx', 'docs', 'webp'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  },
});

module.exports = {
  cloudinary,
  storage
};

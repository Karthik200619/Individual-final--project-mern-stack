import cloudinary from "./cloudinary.js";

// Upload a buffer (used by multer files)
export const uploadResult = async ({ byteArrayBuffer, folder, resource_type }) => {
  return new Promise((resolve, reject) => {
    const options = {};
    if (folder) options.folder = folder;
    if (resource_type) options.resource_type = resource_type;
    
    cloudinary.uploader.upload_stream(options, (error, uploadResult) => {
      if (error) {
        return reject(error);
      }
      return resolve(uploadResult);
    }).end(byteArrayBuffer);
  });
};

// Upload a readable stream (used by busboy files)
export const uploadStream = async ({ fileStream, folder, resource_type }) => {
  return new Promise((resolve, reject) => {
    const options = {};
    if (folder) options.folder = folder;
    if (resource_type) options.resource_type = resource_type;
    
    const stream = cloudinary.uploader.upload_stream(options, (error, uploadResult) => {
      if (error) {
        return reject(error);
      }
      return resolve(uploadResult);
    });
    fileStream.pipe(stream);
  });
};

export default uploadResult;
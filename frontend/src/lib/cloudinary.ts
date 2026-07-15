const CLOUD_NAME = `jgqg0ohr`;

// Hàm tạo URL từ cloudinary public id
export const getCloudinaryUrl = (
  publicId: string,
  format: string = "webp",
): string => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/${publicId}.${format}`;
};

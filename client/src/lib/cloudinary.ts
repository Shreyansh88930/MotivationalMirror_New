export const uploadMediaToCloudinary = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'first_cloudinary');
  formData.append('cloud_name', 'detnvovel');

  const resourceType = type === 'video' ? 'video' : 'image';

  const response = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/${resourceType}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
};

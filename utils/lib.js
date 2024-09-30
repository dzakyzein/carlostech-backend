const axios = require('axios');
const FormData = require('form-data'); // Tambahkan ini
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

exports.storeImage = async (imageFile) => {
  const url = 'https://api.imgbb.com/1/upload';
  const formData = new FormData();

  // Mengisi form data dengan gambar dan API key
  formData.append('image', imageFile.buffer.toString('base64'));
  formData.append('key', config.IMGBB_API_KEY ?? '');

  // Mengirim request ke imgbb
  const response = await axios.post(url, formData, {
    headers: formData.getHeaders(), // Mengatur header sesuai form data
  });

  // Mengembalikan URL gambar yang diupload
  return response.data.data.url;
};

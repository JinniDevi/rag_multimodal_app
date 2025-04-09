import axios from 'axios';

const API_URL = "http://localhost:8000/api";

export const askQuestion = async (question) => {
  const response = await axios.post(`${API_URL}/ask/`, { question });
  return response.data.answer;
};

// 파일 업로드 함수 추가
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const isImage = file.type.startsWith('image/');

  // const endpoint = isImage ? '/upload-image/' : '/upload-text/';

  const endpoint = '/upload';

  const response = await axios.post(`${API_URL}${endpoint}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

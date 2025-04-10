import axios from 'axios';

const API_URL = "http://localhost:8000";

// 기존 질문
export const askTextQuestion = async (question) => {
  const response = await axios.post(`${API_URL}/ask`, { question });
  return response.data.answer;
};

// 파일 업로드 함수 추가
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  // const isImage = file.type.startsWith('image/');

  // const endpoint = isImage ? '/upload-image/' : '/upload-text/';

  const endpoint = '/upload';

  const response = await axios.post(`${API_URL}${endpoint}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};


// 파일 목록 조회
export const fetchFiles = async () => {
  const response = await axios.get(`${API_URL}/files`);
  return response.data.files;
};

// 파일 삭제
export const deleteFile = async (filename) => {
  const response = await axios.delete(`${API_URL}/files/${filename}`);
  return response.data;
};

// 새로 추가한 파일 기반 질문
export async function askFileQuestion(filename, question) {
  const response = await axios.post(`${API_URL}/ask/${filename}`, {
    question: question
  });
  return response.data.answer;
}
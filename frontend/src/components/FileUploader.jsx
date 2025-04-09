import React, { useState } from 'react';
import { uploadFile } from '../api';

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 먼저 선택하세요.');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    try {
      const res = await uploadFile(selectedFile);
      setUploadMessage('업로드 성공: ' + res.message);
    } catch (error) {
      console.error(error);
      setUploadMessage('업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>문서 또는 이미지 업로드</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          marginLeft: '10px',
          padding: '8px 15px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {uploading ? '업로드 중...' : '업로드'}
      </button>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
}

export default FileUploader;

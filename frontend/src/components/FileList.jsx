import React, { useEffect, useState } from 'react';
import { fetchFiles, deleteFile } from '../api';

function FileList() {
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    const files = await fetchFiles();
    setFiles(files);
  };

  const handleDelete = async (filename) => {
    if (window.confirm(`${filename} 파일을 삭제할까요?`)) {
      await deleteFile(filename);
      loadFiles();  // 삭제 후 다시 목록 리프레시
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>업로드된 파일 목록</h2>
      <ul>
        {files.map((file) => (
          <li key={file} style={{ marginBottom: '10px' }}>
            {file}
            <button
              onClick={() => handleDelete(file)}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;

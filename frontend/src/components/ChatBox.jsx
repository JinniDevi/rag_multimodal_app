import React, { useEffect, useState, useRef } from 'react';
import { fetchFiles, uploadFile, deleteFile, askFileQuestion } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatBox = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [question, setQuestion] = useState('');
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef(null);

  const loadFiles = async () => {
    try {
      const fetchedFiles = await fetchFiles();
      setFiles(fetchedFiles);
      if (fetchedFiles.length > 0) {
        setSelectedFile(fetchedFiles[0]);
      }
    } catch (error) {
      console.error('파일 목록 불러오기 실패', error);
      toast.error("❌ 파일 목록 불러오기 실패!");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]);

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;

    setUploadProgress(0);

    try {
      await uploadFile(fileToUpload, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      toast.success("✅ 파일 업로드 성공!");
      setFileToUpload(null);
      setUploadProgress(0);
      await loadFiles();
    } catch (error) {
      console.error('파일 업로드 실패', error);
      toast.error("❌ 파일 업로드 실패!");
      setUploadProgress(0);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await deleteFile(filename);
      toast.success("✅ 파일 삭제 성공!");
      await loadFiles();
      if (filename === selectedFile) {
        setSelectedFile('');
      }
    } catch (error) {
      console.error('파일 삭제 실패', error);
      toast.error("❌ 파일 삭제 실패!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setChats((prev) => [...prev, { type: 'question', text: question }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await askFileQuestion(selectedFile, question);
      setChats((prev) => [
        ...prev,
        { type: 'answer', text: response.answer, suggestions: response.suggestions }
      ]);
    } catch {
      setChats((prev) => [...prev, { type: 'answer', text: "⚠️ 서버 오류가 발생했습니다." }]);
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>

      {/* 업로드 영역 */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2>📂 문서 또는 이미지 업로드</h2>
        <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
        <br />
        <button onClick={handleUpload} style={{
          padding: '8px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '10px'
        }}>
          업로드
        </button>

        {/* 프로그레스 바 */}
        {uploadProgress > 0 && (
          <div style={{
            width: '100%',
            backgroundColor: '#eee',
            borderRadius: '8px',
            marginTop: '15px',
            height: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${uploadProgress}%`,
              backgroundColor: '#4caf50',
              textAlign: 'center',
              color: 'white',
              lineHeight: '20px',
              transition: 'width 0.3s ease'
            }}>
              {uploadProgress}%
            </div>
          </div>
        )}
      </div>

      {/* 파일 목록 영역 */}
      <div style={{ width: '100%', maxWidth: '800px', marginBottom: '30px' }}>
        <h3>📄 업로드된 파일 목록</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {files.map((file) => (
            <li key={file} style={{
              background: '#f1f1f1',
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{file}</span>
              <button onClick={() => handleDelete(file)} style={{
                marginLeft: '10px',
                padding: '4px 10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>삭제</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 챗봇 영역 */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>💬 파일 기반 질문 챗봇</h2>

        {/* 파일 선택 드롭다운 */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)} style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            flex: 1
          }}>
            <option value="">전체 검색</option>
            {files.map((file) => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
        </div>

        {/* 질문 입력 영역 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="질문을 입력하세요..."
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}>질문하기</button>
        </form>

        {/* 채팅창 */}
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          padding: '20px',
          maxHeight: '500px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {chats.map((chat, index) => (
            <div key={index} style={{
              alignSelf: chat.type === 'question' ? 'flex-end' : 'flex-start',
              marginBottom: '15px'
            }}>
              <div style={{
                background: chat.type === 'question' ? '#DCF8C6' : '#E4E6EB',
                padding: '12px 18px',
                borderRadius: '20px',
                maxWidth: '70%',
                whiteSpace: 'pre-wrap'
              }}>
                {chat.text}
                {chat.suggestions && (
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {chat.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ alignSelf: 'center', marginTop: '10px' }}>
              <em>답변 생성중...</em>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 토스트 알림 */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ChatBox;

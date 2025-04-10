import React, { useEffect, useState } from 'react';
import { fetchFiles, askFileQuestion, askTextQuestion } from '../api';

const ChatBox = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [question, setQuestion] = useState('');
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadFiles() {
      const fetchedFiles = await fetchFiles();
      setFiles(fetchedFiles);
      if (fetchedFiles.length > 0) {
        setSelectedFile(fetchedFiles[0]);
      }
    }
    loadFiles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newChat = { type: 'question', text: question };
    setChats((prev) => [...prev, newChat]);
    setQuestion('');
    setIsLoading(true);

    let answer = "";
    try {
      if (selectedFile === "전체 검색") {
        answer = await askTextQuestion(newChat.text);
      } else {
        answer = await askFileQuestion(selectedFile, newChat.text);
      }
    } catch (error) {
      answer = "서버 오류가 발생했습니다.";
    }

    setChats((prev) => [...prev, { type: 'answer', text: answer }]);
    setIsLoading(false);
  };

  return (
    <div className="chatbox" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>파일 기반 질문 챗봇</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)} style={{ marginBottom: "10px", width: "100%", padding: "8px" }}>
          <option>전체 검색</option>
          {files.map((file) => (
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 입력하세요..."
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>질문하기</button>
      </form>

      <div className="chat-messages" style={{ border: "1px solid #ccc", padding: "10px", minHeight: "300px", borderRadius: "8px" }}>
        {chats.map((chat, index) => (
          <div key={index} style={{
            textAlign: chat.type === 'question' ? 'right' : 'left',
            marginBottom: "10px"
          }}>
            <div style={{
              display: "inline-block",
              background: chat.type === 'question' ? "#DCF8C6" : "#E4E6EB",
              borderRadius: "20px",
              padding: "10px 15px",
              maxWidth: "80%"
            }}>
              {chat.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <em>답변 생성중...</em>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;

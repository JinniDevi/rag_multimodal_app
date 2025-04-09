// src/components/ChatBox.jsx
import React, { useState } from 'react';
import { askQuestion } from '../api';
import Message from './Message';

function ChatBox() {
  const [messages, setMessages] = useState([]); // 대화 기록
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const answer = await askQuestion(input);
      setMessages([...newMessages, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <Message role="assistant" content="..." />}
      </div>

      <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ddd' }}>
        <input
          style={{ flexGrow: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="질문을 입력하세요..."
        />
        <button
          onClick={handleSend}
          style={{ marginLeft: '10px', padding: '10px 15px', borderRadius: '10px', background: '#4CAF50', color: 'white', border: 'none' }}
        >
          보내기
        </button>
      </div>
    </div>
  );
}

export default ChatBox;

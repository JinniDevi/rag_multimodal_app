// src/components/Message.jsx
import React from 'react';

function Message({ role, content }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      margin: '10px 0'
    }}>
      <div style={{
        maxWidth: '60%',
        padding: '10px 15px',
        borderRadius: '15px',
        background: isUser ? '#DCF8C6' : '#F1F0F0',
        textAlign: 'left'
      }}>
        {content}
      </div>
    </div>
  );
}

export default Message;

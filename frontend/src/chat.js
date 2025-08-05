import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket('ws://localhost:8080');
    
    ws.current.onopen = () => {
      console.log('Connected to server');
    };

    ws.current.onmessage = (e) => {
      setMessages(prev => [...prev, e.data]);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from server');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      ws.current.send(input);
      setMessages(prev => [...prev, `You: ${input}`]);
      setInput('');
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div style={{ height: '300px', border: '1px solid #ccc', overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
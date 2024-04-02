// Chatbot component (Chatbot.js)
import React, { useState } from 'react';
import axios from 'axios';
import './chatbot.css'; // Import the CSS file
import Topbar from '../topbar/Topbar';

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleUserMessage = async () => {
    // Send user message to Flask server
    const response = await axios.post('http://localhost:5000/get_bot_response', {
      user_input: userMessage,
    });

    // Update conversation history with user's message and bot's response
    setConversation([
      ...conversation,
      { role: 'user', text: userMessage, label: 'You :: ' },
      { role: 'bot', text: response.data.bot_response, label: 'ChatBOT :: ' },
    ]);

    // Clear user input
    setUserMessage('');
  };

  return (
    <div className='back-container' style={{marginTop:"100px"}}>
        <Topbar/>
    <div className="chatbot-container">
        
      {/* Conversation history */}
      <div className="conversation-container">
        {conversation.map((message, index) => (
          <div key={index} className={message.role}>
            <span className="label">{message.label}</span>
            <div className="message">{message.text}</div>
            {index < conversation.length - 1 && <div className="divider" />}
          </div>
        ))}
      </div>

      {/* User input */}
      <div className="user-input-container">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleUserMessage}>Send</button>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;

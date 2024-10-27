// Chatbot.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    const options = {
      method: 'POST',
      url: 'https://chat-gpt26.p.rapidapi.com/',
      headers: {
        'x-rapidapi-key': '7f2f07644emsh01c930f05b5a0b8p19dd3ejsnc7e31f07b2f4',
        'x-rapidapi-host': 'chat-gpt26.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: input
          }
        ]
      }
    };

    try {
      const response = await axios.request(options);
      const botMessage = response.data.choices[0].message.content.trim();
      setMessages([...messages, { text: botMessage, sender: 'bot' }]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages([...messages, { text: 'Sorry, I am unable to process your request at the moment.', sender: 'bot' }]);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px', bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>AI Chatbot</Typography>
      <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ mb: 1, textAlign: message.sender === 'user' ? 'right' : 'left' }}>
            <Typography variant="body1" sx={{ p: 1, borderRadius: '4px', bgcolor: message.sender === 'user' ? '#e0f2fe' : '#f3e5f5' }}>
              {message.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Send
        </Button>
      </form>
    </Box>
  );
};

export default Chatbot;
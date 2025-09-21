import React, { useState } from 'react';
import faqJson from './faq.json';

type Message = { text: string; sender: 'user' | 'bot' };

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userMessage = input.trim();
    if (userMessage) {
      setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
      const botResponse = getBotResponse(userMessage);
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
      setInput('');
    }
  };

  const getBotResponse = (message: string) => {
    const lower = message.toLowerCase();
    const list = (faqJson as { faq: Array<{ question: string; answer: string }> }).faq || [];
    const entry = list.find((e) => e.question.toLowerCase() === lower);
    return entry ? entry.answer : "I'm sorry, I don't have an answer for that.";
  };

  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;

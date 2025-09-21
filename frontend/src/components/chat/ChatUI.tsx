import React, { useEffect, useMemo, useRef, useState } from 'react';
import faqJson from '@/chatbot/faq.json';
import './Chatbot.css';

type Message = { id: string; text: string; role: 'user' | 'assistant'; ts: number };

const now = () => Date.now();
const genId = () => Math.random().toString(36).slice(2);

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try { return JSON.parse(localStorage.getItem('chat_history') || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const faq = useMemo(() => (faqJson as { faq: Array<{ question: string; answer: string }> }).faq || [], []);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const findAnswer = (q: string) => {
    const lower = q.toLowerCase().trim();
    const exact = faq.find(f => f.question.toLowerCase() === lower);
    if (exact) return exact.answer;
    const partial = faq.find(f => lower.includes(f.question.toLowerCase()) || f.question.toLowerCase().includes(lower));
    if (partial) return partial.answer;
    return "I'm not sure yet. Try rephrasing or check Scholarships/Colleges pages. I'll keep learning!";
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    const userMsg: Message = { id: genId(), text, role: 'user', ts: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // Simulate assistant typing delay
    setTimeout(() => {
      const reply = findAnswer(text);
      const botMsg: Message = { id: genId(), text: reply, role: 'assistant', ts: now() };
      setMessages(prev => [...prev, botMsg]);
      setSending(false);
    }, 300);
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clear = () => setMessages([]);

  return (
    <div className="chat-wrap">
      <div className="chat-main">
        {messages.length === 0 && (
          <div className="chat-empty">
            <h2>Ask anything about colleges, scholarships, or careers</h2>
            <p>Examples: "Scholarships for girls", "Top colleges for B.Sc in Srinagar"</p>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`msg ${m.role}`}>
            <div className="avatar" aria-hidden>
              {m.role === 'assistant' ? '🤖' : '🧑'}
            </div>
            <div className="bubble">
              <div className="content">{m.text}</div>
              <div className="time">{new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="chat-input">
        <div className="input-row">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Send a message..."
            rows={1}
          />
          <button className="send" onClick={send} disabled={sending || !input.trim()}>{sending ? '...' : 'Send'}</button>
        </div>
        <div className="input-actions">
          <button className="link" onClick={clear}>Clear chat</button>
        </div>
      </div>
    </div>
  );
}

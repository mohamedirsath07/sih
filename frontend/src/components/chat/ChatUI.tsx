import React, { useEffect, useMemo, useRef, useState } from 'react';
import { askChatbot, getChatbotStats } from '@/utils/api';
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
  const [stats, setStats] = useState<any>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const faq = useMemo(() => (faqJson as { faq: Array<{ question: string; answer: string }> }).faq || [], []);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  useEffect(() => {
    // Load chatbot stats on component mount
    const loadStats = async () => {
      try {
        const statsData = await getChatbotStats();
        setStats(statsData);
      } catch (error) {
        console.log('Using local fallback mode');
        setUseLocalFallback(true);
      }
    };
    loadStats();
  }, []);

  const findLocalAnswer = (q: string) => {
    const lower = q.toLowerCase().trim();
    const exact = faq.find(f => f.question.toLowerCase() === lower);
    if (exact) return exact.answer;
    const partial = faq.find(f => lower.includes(f.question.toLowerCase()) || f.question.toLowerCase().includes(lower));
    if (partial) return partial.answer;
    return "I'm not sure yet. Try rephrasing or check Scholarships/Colleges pages. I'll keep learning!";
  };

  const getUserProfile = () => {
    try {
      const session = localStorage.getItem('userSession');
      const profile = localStorage.getItem('userProfile');
      let userProfile = {};
      
      if (session) {
        userProfile = { ...userProfile, ...JSON.parse(session) };
      }
      if (profile) {
        userProfile = { ...userProfile, ...JSON.parse(profile) };
      }
      
      return userProfile;
    } catch {
      return {};
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    
    setSending(true);
    const userMsg: Message = { id: genId(), text, role: 'user', ts: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    try {
      let reply: string;
      
      if (useLocalFallback) {
        // Use local FAQ fallback
        reply = findLocalAnswer(text);
      } else {
        // Use enhanced backend API
        const userProfile = getUserProfile();
        const response = await askChatbot(text, userProfile);
        reply = response.response;
      }
      
      const botMsg: Message = { id: genId(), text: reply, role: 'assistant', ts: now() };
      setMessages(prev => [...prev, botMsg]);
      
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Fallback to local FAQ on error
      const fallbackReply = findLocalAnswer(text);
      const botMsg: Message = { 
        id: genId(), 
        text: `${fallbackReply}\n\n*Note: Using offline mode due to connection issues*`, 
        role: 'assistant', 
        ts: now() 
      };
      setMessages(prev => [...prev, botMsg]);
      
      // Enable local fallback for future requests
      setUseLocalFallback(true);
    } finally {
      setSending(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clear = () => setMessages([]);

  const getWelcomeMessage = () => {
    if (stats) {
      return (
        <div className="chat-welcome">
          <h2>🤖 Enhanced Career Assistant</h2>
          <p>Ask me anything about colleges, scholarships, or careers! I have access to:</p>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.colleges || 0}</span>
              <span className="stat-label">Colleges</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.scholarships || 0}</span>
              <span className="stat-label">Scholarships</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.careers || 0}</span>
              <span className="stat-label">Careers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.faq || 0}</span>
              <span className="stat-label">FAQ Items</span>
            </div>
          </div>
          <div className="example-queries">
            <p><strong>Try asking:</strong></p>
            <ul>
              <li>💼 "What careers are available in engineering?"</li>
              <li>🏫 "Show me colleges in Jammu"</li>
              <li>💰 "Are there scholarships for girls?"</li>
              <li>📚 "What courses are offered in computer science?"</li>
            </ul>
          </div>
        </div>
      );
    }
    
    return (
      <div className="chat-empty">
        <h2>Ask anything about colleges, scholarships, or careers</h2>
        <p>Examples: "Scholarships for girls", "Top colleges for B.Sc in Srinagar"</p>
        {useLocalFallback && (
          <p className="offline-notice">🔄 Currently in offline mode - using basic FAQ</p>
        )}
      </div>
    );
  };

  return (
    <div className="chat-wrap">
      <div className="chat-main">
        {messages.length === 0 && getWelcomeMessage()}
        {messages.map(m => (
          <div key={m.id} className={`msg ${m.role}`}>
            <div className="avatar" aria-hidden>
              {m.role === 'assistant' ? '🤖' : '🧑'}
            </div>
            <div className="bubble">
              <div className="content" dangerouslySetInnerHTML={{
                __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br>')
                  .replace(/• /g, '• ')
              }} />
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
            placeholder={useLocalFallback ? "Send a message... (offline mode)" : "Ask about colleges, scholarships, careers..."}
            rows={1}
          />
          <button className="send" onClick={send} disabled={sending || !input.trim()}>
            {sending ? '...' : 'Send'}
          </button>
        </div>
        <div className="input-actions">
          <button className="link" onClick={clear}>Clear chat</button>
          {stats && (
            <span className="status-indicator">
              {useLocalFallback ? '🔄 Offline' : '🟢 Enhanced'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

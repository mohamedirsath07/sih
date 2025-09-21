import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Quiz from './routes/Quiz';
import Results from './routes/Results';
import Colleges from './routes/Colleges';
import Scholarships from './routes/Scholarships';
import Timeline from './routes/Timeline';
import Profile from './routes/Profile';
import Login from './routes/Login';
import Chatbot from './routes/Chatbot';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './styles/globals.css';
// Removed SyncBanner to hide dataset/version status sitewide

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/timeline" element={<Timeline />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/login" element={<Login />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
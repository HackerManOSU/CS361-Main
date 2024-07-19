// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import FileConverterPage from './components/FileConverterPage.tsx'; // Assume you'll create this later

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/converter" element={<FileConverterPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

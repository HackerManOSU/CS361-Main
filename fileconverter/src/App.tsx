// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.tsx';
import HomePage from './components/HomePage';
import FileConverterPage from './components/FileConverterPage.tsx';
import ConversionPage from './components/Converter/ConversionPage';


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/converter" element={<FileConverterPage />} />
          <Route path="/convert" element={<ConversionPage />} /> // New route for the conversion details
        </Routes>
      </div>
    </Router>
  );
};

export default App;

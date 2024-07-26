// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.tsx';
import HomePage from './components/HomePage';
import FileConverterPage from './components/FileConverterPage.tsx';
import ConversionPage from './components/Converter/ConversionPage';
import DownloadPage from './components/Download/DownloadPage';



const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/converter" element={<FileConverterPage />} />
          <Route path="/convert" element={<ConversionPage />} />
          <Route path="/download" element={<DownloadPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

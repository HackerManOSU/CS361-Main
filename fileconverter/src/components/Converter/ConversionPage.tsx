import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface LocationState {
  file: File;
}

const ConversionPage: React.FC = () => {
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (location.state) {
      const state = location.state as LocationState;
      setFile(state.file);
    }
  }, [location]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Conversion Tool</h1>
      {file && (
        <div>
          <p>File Name: {file.name}</p>
          <p>File Size: {file.size} bytes</p>
          <p>File Type: {file.type || 'Unknown'}</p>
          <select className="mt-3 mb-3 p-2 border-2 border-purple-300">
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </select>
          <button className="bg-purple-700 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            Convert
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversionPage;

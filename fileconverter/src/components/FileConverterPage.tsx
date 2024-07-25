// src/components/FileConverterPage.tsx
import React from 'react';
import ConvertField from './Converter/ConvertField';


const FileConverterPage: React.FC = () => {

  return (
    <div className="text-center p-10 w-screen h-screen flex flex-col">
      <h1 className="text-3xl font-bold">Conversion Tool</h1>

      < ConvertField />

    </div>
  );
};

export default FileConverterPage;

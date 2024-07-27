import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  file: File;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const ConversionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    setFile(state.file);
  }, [location]);

  const handleConversion = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('StoreFile', 'true'); // Optionally store file on ConvertAPI

    try {
      const response = await fetch(`https://v2.convertapi.com/convert/docx/to/pdf?Secret=${process.env.REACT_APP_CONVERTAPI_SECRET}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const pdfUrl = data.Files[0].Url;
        const newFileName = `converted-${file.name}.pdf`;
        const responseBlob = await fetch(pdfUrl);
        const blob = await responseBlob.blob();
        const convertedFile = new File([blob], newFileName, { type: 'application/pdf' });
        navigate('/download', { state: { file: convertedFile } });
      } else {
        console.error('Failed to convert file:', response.statusText);
      }
    } catch (error) {
      console.error('Error during file conversion:', error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Convert your DOCX to PDF</h1>
      <div className='flex flex-col md:flex-row w-full border-2 border-secondary rounded-xl text-black px-4 items-center justify-evenly text-center'>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0'>File Name: {file?.name}</p>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0 mt-3 mb-3'>File Type: {file?.type}</p>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0'>File Size: {formatBytes(file?.size)}</p>
      </div>

      <div className='flex flex-col items-center justify-center text-center my-[25vh]'>

      <button onClick={handleConversion} className="bg-secondary text-white text-2xl py-4 px-8 rounded-2xl hover:bg-tertiary transition duration-300">
        Convert File
      </button>

      </div>

    </div>
  );
};

export default ConversionPage;

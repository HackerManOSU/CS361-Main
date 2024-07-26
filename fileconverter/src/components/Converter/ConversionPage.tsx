import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';

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
  const [convertTo, setConvertTo] = useState<string>('');


  useEffect(() => {
    if (location.state) {
      const state = location.state as LocationState;
      setFile(state.file);
    }
  }, [location]);

  const handleConversion = async () => {
    if (!file || !convertTo) return;

    // Using FormData to prepare the data for API request
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apikey', process.env.REACT_APP_CLOUDCONVERT_API_KEY);
    formData.append('inputformat', file.name.split('.').pop());
    formData.append('outputformat', convertTo);

    try {
      const response = await fetch('https://api.cloudconvert.com/convert', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const blob = await response.blob();
        const newFileName = `converted-${file.name}.${convertTo}`;
        const convertedFile = new File([blob], newFileName, { type: `application/${convertTo}` });
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
      <h1 className="text-3xl font-bold mb-4 text-center">Conversion Tool</h1>
      {file && (
        <div className='flex flex-col md:flex-row w-full border-2 border-secondary rounded-xl text-black px-4 items-center justify-evenly text-center'>
          <p className='pt-10 pb-10 md:pt-0 md:pb-0'>File Name: {file.name}</p>
          <select value={convertTo} onChange={(e) => setConvertTo(e.target.value)} className="mt-3 mb-3 p-2 border-2 border-secondary rounded-xl text-black">
            <option selected disabled>Select Format</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </select>
          <p className='pt-10 pb-10 md:pt-0 md:pb-0'>File Size: {formatBytes(file.size)}</p>
          </div>
      )}

      <div className='flex justify-center items-center my-[25vh]'>
        <button onClick={handleConversion} className="bg-secondary text-white text-2xl py-4 px-8 rounded-2xl hover:bg-tertiary transition duration-300">
              Convert
          </button>
      </div>
    </div>
  );
};

export default ConversionPage;

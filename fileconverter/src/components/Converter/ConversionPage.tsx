import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  file: File;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes < 0) return 'File size read error'
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
  const [conversionType, setConversionType] = useState<string>('docx-to-pdf');

  useEffect(() => {
    const state = location.state as LocationState;
    setFile(state.file);
  }, [location]);


  // Function to remove the old file extension and add the new one
  const getNewFileName = (originalName: string, targetExtension: string): string => {
    const lastIndex = originalName.lastIndexOf('.');
    if (lastIndex === -1) return originalName + targetExtension;
    return originalName.substring(0, lastIndex) + targetExtension;
  };

  const getDisplayFileType = (fileType: string): string => {
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'docx';
    }
    if (fileType === 'application/pdf')
      return 'pdf';
    return fileType;
  };

  const handleConversion = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('StoreFile', 'true');

    let apiUrl = '';
    let newExtension = '';

    switch (conversionType) {
      case 'docx-to-pdf':
        apiUrl = `https://v2.convertapi.com/convert/docx/to/pdf?Secret=${import.meta.env.CONVERT_API_KEY}`;
        newExtension = '.pdf';
        break;
      case 'pdf-to-docx':
        apiUrl = `https://v2.convertapi.com/convert/pdf/to/docx?Secret=${import.meta.env.CONVERT_API_KEY}`;
        newExtension = '.docx';
        break;
      default:
        return; // Unsupported conversion type
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response Data:", data); // Check what the API returned
        const pdfUrl = data.Files[0].Url;
        const responseBlob = await fetch(pdfUrl);
        const blob = await responseBlob.blob();
        console.log("Blob size:", blob.size); // Check the size of the blob
        const newFileName = getNewFileName(file.name, newExtension);
        const convertedFile = new File([blob], newFileName, { type: `application/${newExtension.substring(1)}` });
        navigate('/download', { state: { file: convertedFile } });
      } else {
        console.error('Failed to convert file:', await response.text()); // Get error message from API
      }
      
    } catch (error) {
      console.error('Error during file conversion:', error);
    }
  };

  const handleNavigate = () => {
    const confirmReturn = window.confirm("Returning will reset the converter. Do you wish to continue?");
    if (confirmReturn) {
      navigate('/converter'); // Navigate only if confirmed
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4 text-center">File Converter</h1>
      <div className='flex flex-col md:flex-row w-full border-2 border-secondary rounded-xl text-black px-4 py items-center justify-evenly text-center h-[7vh]'>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0'>File Name: {file?.name}</p>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0 mt-3 mb-3'>File Type: {file ? getDisplayFileType(file.type) : 'No file selected'}</p>
        <select value={conversionType} onChange={(e) => setConversionType(e.target.value)} className="border-secondary border-2 rounded-xl p-1">
          <option selected disabled>Select Conversion</option>
          <option value="docx-to-pdf">DOCX to PDF</option>
          <option value="pdf-to-docx">PDF to DOCX</option>
        </select>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0'>File Size: {formatBytes(file?.size)}</p>

      </div>

      <div className='flex flex-col items-center justify-center text-center my-[25vh]'>
        <p className='border-solid border-secondary border-2 rounded-xl mb-[1.5vh] p-2 text-[0.7rem]'>Convert files from various formats, including PDF, DOCX, and more.</p>
        <button onClick={handleConversion} className="bg-secondary text-white text-xl py-4 px-8 rounded-2xl hover:bg-tertiary transition duration-300">
          Convert File
        </button>
        <p className='mt-[1.5vh] p-2 text-sm'>Conversions may take up to several minutes depending on file size</p>
      </div>

      <div>
        <button
          onClick={handleNavigate}
          className="mt-5 border-secondary border-solid border-2 text-secondary py-3 px-8 rounded-lg hover:bg-purple-800 transition duration-300"
        >
          Return
        </button>
      </div>

    </div>
  );
};

export default ConversionPage;

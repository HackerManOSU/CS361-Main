import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import LoadingIcons from 'react-loading-icons';
import axios from 'axios';

interface ConversionPageProps {
  file: File;
}

interface FileDetails {
  file: File;
  contentCheck?: {
    isValid: boolean;
    foundWords?: string[];
  };
}

interface LocationState {
  fileDetails: FileDetails;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes < 0) return 'File size read error';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const ConversionPage: React.FC<ConversionPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<string>('docx-to-pdf');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileAge, setFileAge] = useState<number | null>(null);
  const [contentCheckResult, setContentCheckResult] = useState<LocationState['fileDetails']['contentCheck']>();


  useEffect(() => {
    if (location.state?.fileDetails) {
      setLocalFile(location.state.fileDetails.file);
      setContentCheckResult(location.state.fileDetails.contentCheck);
    }
  }, [location.state]);

  // Microservice B
  useEffect(() => {
    if (localFile) {
        const formData = new FormData();
        formData.append('file', localFile);
        formData.append('lastModified', localFile.lastModified.toString()); // Send lastModified timestamp

        axios
            .post('http://localhost:3001/check-age', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log('File age response:', response.data);
                setFileAge(response.data.ageInDays);
            })
            .catch((error) => {
                console.error('Error checking file age:', error);
            });
    }
}, [localFile]);

// Microservice D
useEffect(() => {
  if (contentCheckResult && !contentCheckResult.isValid) {
    const message = `Dangerous Content Found: (${contentCheckResult.foundWords?.join(', ')})`;
    window.alert(message);
  }
}, [contentCheckResult]);



  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getNewFileName = (originalName: string, targetExtension: string): string => {
    const lastIndex = originalName.lastIndexOf('.');
    if (lastIndex === -1) return originalName + targetExtension;
    return originalName.substring(0, lastIndex) + targetExtension;
  };

  const getDisplayFileType = (fileType: string): string => {
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'docx';
    }
    if (fileType === 'application/pdf') return 'pdf';
    return fileType;
  };

  const handleConversion = async () => {
    if (!localFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', localFile);
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
        const pdfUrl = data.Files[0].Url;
        const responseBlob = await fetch(pdfUrl);
        const blob = await responseBlob.blob();
        const newFileName = getNewFileName(localFile.name, newExtension);
        const convertedFile = new File([blob], newFileName, { type: `application/${newExtension.substring(1)}` });
        navigate('/download', { state: { file: convertedFile } });
      } else {
        console.error('Failed to convert file:', await response.text()); // Get error message from API
      }
    } catch (error) {
      console.error('Error during file conversion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    const confirmReturn = window.confirm("Returning will reset the converter. Do you wish to continue?");
    if (confirmReturn) {
      navigate('/converter'); // Navigate only if confirmed
    }
  };

  return (
    <div className="py-10">
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
          <LoadingIcons.ThreeDots stroke="#8594e4" speed={1} fill="#6643b5" />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4 text-center">File Converter</h1>

      <div className='flex flex-col h-[40vh]'>

      <div className="flex flex-row">
        <button onClick={toggleDropdown} className="w-[5vw] mx-[2vw] items-center flex justify-center">
          {dropdownOpen ? <FiChevronUp stroke="#6643b5" size={40} /> : <FiChevronDown stroke="#6643b5" size={40} />}
        </button>

        <div className="flex flex-col mr-[7vw] md:flex-row w-full border-2 border-secondary rounded-xl text-black px-4 items-center justify-evenly text-center min-h-[7vh]">
          <p className="pt-10 pb-10 md:pt-0 md:pb-0">File Name: {localFile?.name}</p>
          <p className="pt-10 pb-10 md:pt-0 md:pb-0 mt-3 mb-3">
            File Type: {localFile ? getDisplayFileType(localFile.type) : 'No file selected'}
          </p>
          <select value={conversionType} onChange={(e) => setConversionType(e.target.value)} className="border-secondary border-2 rounded-xl p-1 mx-4 mb-10 md:mb-0">
            <option value="" disabled>
              Select Conversion
            </option>
            <option value="docx-to-pdf">DOCX to PDF</option>
            <option value="pdf-to-docx">PDF to DOCX</option>
          </select>
        </div>
      </div>

      {dropdownOpen && (
        <div className="ml-[9vw] mt-[0.5vh] flex flex-col md:flex-row w-[50vw] border-2 border-secondary rounded-lg text-black px-4 py-2 items-center justify-evenly text-center">
          <p className="pt-10 pb-10 md:pt-0 md:pb-0">File Size: {formatBytes(localFile?.size || 0)}</p>
          {fileAge !== null && <p className='pb-10 md:pb-0 mt-3 mb-3'>File age: {fileAge} days</p>}
        </div>
      )}

      </div>


      <div className="flex flex-col items-center justify-center text-center my-[15vh]">
        <p className="border-solid border-secondary border-2 rounded-xl mb-[1.5vh] p-2 text-[0.7rem]">Convert files from various formats, including PDF, DOCX, and more.</p>
        <button onClick={handleConversion} className="bg-secondary text-white text-xl py-4 px-8 rounded-2xl hover:bg-tertiary transition duration-300">
          Convert File
        </button>
        <p className="mt-[1.5vh] p-2 text-sm">Conversions may take up to several minutes depending on file size</p>
      </div>

      <div>
        <button
          onClick={handleNavigate}
          className="absolute bottom-0 left-0 mt-5 mx-[2vh] mb-[2vh] border-secondary border-solid border-2 text-secondary py-3 px-8 rounded-lg hover:bg-purple-800 transition duration-300"
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default ConversionPage;

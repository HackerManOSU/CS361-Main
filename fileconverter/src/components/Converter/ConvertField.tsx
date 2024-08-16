import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Accept } from 'react-dropzone';  // Import the specific type if available
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConvertField: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  // Microservice A
  const checkFileSize = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('https://file-size-limiter-67005a553eac.herokuapp.com/check-file-size', formData);
      if (response.status === 200) {
        return { isValid: true, message: response.data.message };
      } else {
        return { isValid: false, message: response.data.error };
      }
    } catch (error) {
      console.error('Error checking file size:', error);
      return { isValid: false, message: 'File too large' };
    }
  };

  // Microservice C
  const checkFormatCompatibility = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3002/check-format', formData);
      return response.data;
    } catch (error) {
      console.error('Error checking file format:', error);
      return { isValid: false, message: 'Error checking file format' };
    }
  };

  // Microservice D
  const checkContent = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('http://localhost:3003/scan-content', formData);
        console.log('Content response:', response.data);  // Log to inspect the full response
        if (response.data.isValid === false) {
            console.log('Prohibited words found:', response.data.foundWords);  // Ensure this logs as expected
        }
        return response.data;
    } catch (error) {
        console.error('Error scanning file content:', error);
        return { isValid: false, message: 'Error scanning file content' };
    }
};


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
  
    const sizeResult = await checkFileSize(file);
    // Check directly for invalid responses or any other response that is not the success message.
    if (!sizeResult.isValid || sizeResult.message !== "File successfully uploaded") {
      // Alert only if the message is not the exact success message
      if (sizeResult.message && sizeResult.message !== "File successfully uploaded") {
        alert(sizeResult.message);
        return; // Exit if there's a size issue
      }
    }
  
    const formatResult = await checkFormatCompatibility(file);
    if (!formatResult.isValid) {
      alert(formatResult.message);
      return; // Exit if the format check fails
    }
  
    const contentResult = await checkContent(file);
    if (!contentResult.isValid) {
        let message = contentResult.message || 'Prohibited content detected: ' + contentResult.foundWords.join(', ');
        alert(message);
        return;  // Exit if the content check fails
    }
    
  
    // If all checks pass, navigate to the conversion page
    navigate('/convert', { state: { fileDetails: { file, contentCheck: contentResult } } });
  
  }, [navigate]);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document' as Accept
  });
  
  

  return (
    <div className="p-10 h-[80%]">
      <div {...getRootProps()} className="border-solid border-2 border-secondary p-10 rounded-3xl text-center hover:cursor-pointer h-[80%] flex items-center justify-center">
        <input {...getInputProps()} />
        <div>
          <h2 className="p-4 text-xl">Drag 'n' Drop to Upload File</h2>
          <h2 className="p-4 text-2xl">OR</h2>
          <h2 className="p-4 text-xl">Click to Select File</h2>
        </div>
      </div>
    </div>
  );
};

export default ConvertField;

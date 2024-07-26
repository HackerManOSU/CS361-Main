import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

const ConvertField: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Assuming only the first file is accepted
    setFile(acceptedFiles[0]);
    navigate('/convert', { state: { file: acceptedFiles[0] } });
  }, [navigate]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false
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

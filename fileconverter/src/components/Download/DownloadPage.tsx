import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const DownloadPage: React.FC = () => {
  const location = useLocation();
  const file = location.state?.file as File;

  const handleDownload = () => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const getDisplayFileType = (fileType: string): string => {
    if (fileType === 'application/docx') {
      return 'docx';
    }
    if (fileType === 'application/pdf')
      return 'pdf';
    return fileType;
  };


  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Download Converted File</h1>
      <div className='flex flex-col md:flex-row w-full border-2 border-secondary rounded-xl text-black px-4 items-center justify-evenly text-center'>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0'>File Name: {file?.name}</p>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0 mt-3 mb-3'>File Type: {file ? getDisplayFileType(file.type) : 'No file selected'}</p>
        <p className='pt-10 pb-10 md:pt-0 md:pb-0'>File Size: {formatBytes(file?.size)}</p>
      </div>

      <div className='flex flex-col items-center justify-center text-center my-[25vh]'>
        <button onClick={handleDownload} className="bg-secondary text-white text-2xl py-4 px-8 rounded-2xl hover:bg-tertiary transition duration-300">
            Download
        </button>
        <Link to="/converter" className=" text-sm border-solid border-secondary hover:bg-secondary transition duration-300 border-2 rounded-xl p-2 my-[1.5vh]">
            Convert More Files
        </Link>
      </div>
    </div>
  );
};

export default DownloadPage;

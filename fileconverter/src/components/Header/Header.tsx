import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b-2 border-gray-200 p-4">
      <nav className="flex justify-center">
        <ul className="flex bg-white w-[80%] justify-evenly text-center items-center">
          <li>
            <Link to="/" className="text-black hover:text-purple-700">Home</Link>
          </li>
          <li>
            <Link to="/converter" className="text-black hover:text-purple-700">File Converter</Link> 
          </li>
        </ul>
      </nav>
    </header>
  );
};


export default Header;

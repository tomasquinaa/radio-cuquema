import React from 'react';
import { IoIosHome } from 'react-icons/io';

const NavigationBar: React.FC = () => (
  <nav className="bg-blue-600 text-white">
    <div className="flex justify-center items-center space-x-8 p-4 mr-[40rem]">
      <a href="#" className="hover:underline flex items-center">
        <IoIosHome className="bg-yellow-500" />
      </a>
      <a href="#">Programas Gravados</a>
      <a href="#">Empregos</a>
      <a href="#">Emissão em Direto</a>
    </div>
  </nav>
);

export default NavigationBar;

import React from "react";
import { IoIosHome } from "react-icons/io";
import { IoBriefcase, IoPlayCircle, IoRecording } from "react-icons/io5";

const NavigationBar: React.FC = () => (
  <nav className="bg-primaryPurple text-white">
    <div className="flex justify-center items-center space-x-8 p-4">
      <a href="#" className="flex items-center space-x-2 hover:underline">
        <IoIosHome size={24} className="bg-yellow-500 p-1 rounded-full" />
        <span>Início</span>
      </a>
      <a
        href="https://podcasters.spotify.com/pod/show/radiocuquema"
        className="flex items-center space-x-2 hover:underline"
      >
        <IoRecording size={24} />
        <span>Programas Gravados</span>
      </a>
      <a href="#" className="flex items-center space-x-2 hover:underline">
        <IoBriefcase size={24} />
        <span>Empregos</span>
      </a>
      <a href="#" className="flex items-center space-x-2 hover:underline">
        <IoPlayCircle size={24} />
        <span>Emissão em Direto</span>
      </a>
    </div>
  </nav>
);

export default NavigationBar;

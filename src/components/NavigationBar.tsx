import React from "react";
import { IoIosHome } from "react-icons/io";
import { IoBriefcase, IoCodeSlash, IoMic, IoPlayCircle, IoRecording } from "react-icons/io5";
import { Link } from "react-router-dom";

const NavigationBar: React.FC = () => (
  <nav className="bg-primaryPurple text-white">
    <div className="flex justify-center items-center space-x-8 p-4">
      <Link to="/" className="flex items-center space-x-2 hover:underline">
        <IoIosHome size={24} className="bg-yellow-500 p-1 rounded-full" />
        <span>Início</span>
      </Link>
      <Link
        to=""
        className="flex items-center space-x-2 hover:underline"
      >
        <IoPlayCircle size={24} />
        <span>Play</span>
      </Link>
      <Link
        to=""
        className="flex items-center space-x-2 hover:underline"
      >
        <IoCodeSlash size={24} />
        <span>Programação</span>
      </Link>
      <Link
        to=""
        className="flex items-center space-x-2 hover:underline"
      >
        <IoMic size={24} />
        <span>Podcast</span>
      </Link>
      <Link
        to=""
        className="flex items-center space-x-2 hover:underline"
      >
        <IoBriefcase size={24} />
        <span>Empregos</span>
      </Link>
      <Link
        to="https://podcasters.spotify.com/pod/show/radiocuquema"
        className="flex items-center space-x-2 hover:underline"
      >
        <IoRecording size={24} />
        <span>Programas Gravados</span>
      </Link>
      <Link to="#" className="flex items-center space-x-2 hover:underline">
        <IoBriefcase size={24} />
        <span>Publicidades</span>
      </Link>
  
    </div>
  </nav>
);

export default NavigationBar;

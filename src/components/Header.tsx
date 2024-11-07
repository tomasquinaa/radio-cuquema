import React from "react";
import { ImSearch } from "react-icons/im";
import { IoMdMenu } from "react-icons/io";

const Header: React.FC = () => (
  <header className="bg-white shadow p-4 flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold">Rádio Cuquema</h1>
      <p className="text-sm">93.1 FM DO CUITO PARA O MUNDO</p>
    </div>
    <div className="flex items-center space-x-4">
      <button className="text-primaryPurple px-4 py-2 rounded-md flex items-center">
        <ImSearch className="text-primaryPurple text-xl" />
      </button>
      Menu
      <IoMdMenu className="text-primaryPurple text-xl" />
    </div>
  </header>
);

export default Header;

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div>
        <p>
          Copyright © 2024 Rádio Cuquema. All rights reserved. | Desenvolvido por 
          <a href="https://www.justweb.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
            Justweb
          </a>.
        </p>
      </div>
      <div className="text-gray-400 text-sm">
        Ativar o Windows
        <br />
        <span className="text-xs">Aceda a Definições para ativar o Windows</span>
      </div>
      <button className="bg-red-500 text-white rounded-full p-2 ml-2 hover:bg-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 10-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;

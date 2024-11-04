import React from 'react';
import { exportImg } from '../util/exportImg';

const ArticleNewsSecond: React.FC = () => (
  <article className="bg-white shadow-md p-6 mb-8 mx-auto border border-gray-200">
    <div className="flex">
      {/* Imagem à Esquerda */}
      <div className="relative mr-6">
        <img src={exportImg.not3} alt="Notícia SINPROF" className="w-32 h-32 object-contain" />
      </div>

      {/* Conteúdo à Direita */}
      <div className="flex-1">
        {/* Header com Categorias */}
        <div className="flex space-x-2 mb-4">
          <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">NOTÍCIAS</span>
          <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">SOCIEDADE</span>
        </div>

        {/* Título e Autor */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
        IURD: Capítulo negro em Angola continua
        </h1>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <span className="mr-4">👤 SANDRO</span>
          <span>📅 18 DE ABRIL, 2021</span>
        </div>
  <hr /><br />
        {/* Conteúdo com Áudio */}
        <div className="text-gray-700">
          <p>O Bispo Alberto Segunda, porta-voz da Igreja Universal do Reino de Deus em Angola classificou no Sábado (17.04.2021), em Luanda, em conferência de imprensa, que...</p>
        </div>
      </div>
    </div>
  </article>
);

export default ArticleNewsSecond;

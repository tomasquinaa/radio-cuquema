import React from 'react';
import { exportImg } from '../util/exportImg';

const ArticleNewsThird: React.FC = () => (
  <article className="bg-white shadow-md p-6 mb-8 mx-auto border border-gray-200">
    <div className="flex">
      {/* Imagem à Esquerda */}
      <div className="relative mr-6">
        <img src={exportImg.not4} alt="Notícia SINPROF" className="w-32 h-32 object-contain" />
      </div>

      {/* Conteúdo à Direita */}
      <div className="flex-1">
        {/* Header com Categorias */}
        <div className="flex space-x-2 mb-4">
          <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">SEM CATEGORIA</span>
        </div>

        {/* Título e Autor */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Efetivo das Forças Armadas Angolanas lamenta falta de salário há 4 meses
        </h1>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <span className="mr-4">👤 SANDRO</span>
          <span>📅 18 DE ABRIL, 2021</span>
        </div>
  <hr /><br />
        {/* Conteúdo com Áudio */}
        <div className="text-gray-700">
          <p>Mendes Virgílio é primeiro sargento das FAA encontra-se doente desde o mês de Setembro, altura em que os seus ordenados também deixaram cair, por razões...</p>
        </div>
      </div>
    </div>
  </article>
);

export default ArticleNewsThird;

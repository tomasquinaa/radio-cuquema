import React from 'react';

const Article: React.FC = () => (
  <article className="bg-white shadow p-6 mb-8">
    <div className="flex items-center space-x-2 mb-4">
      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        Notícias
      </span>
      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        Sociedade
      </span>
    </div>
    <h2 className="text-2xl font-bold mb-2">Angola: Comunicação Social no cafrique?</h2>
    <div className="text-gray-500 flex items-center space-x-4 mb-4">
      <span>Sandro</span>
      <span>19 de Abril, 2021</span>
    </div>
    <p className="text-gray-700 mb-4">
      O Ministério das Telecomunicações anunciou a suspensão da Record TV África e a...
    </p>
  </article>
);

export default Article;

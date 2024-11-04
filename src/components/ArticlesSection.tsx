import React from 'react';
import Article from './Article';
import ArticleNewsFirst from './ArticleNewsFirst';
import ArticleNewsSecond from './ArticleNewsSecond';
import ArticleNewsThird from './ArticleNewsThird';


const ArticlesSection: React.FC = () => (
  <section className="w-3/4 pr-8">
    <Article />
    <ArticleNewsFirst />
    <ArticleNewsSecond />
    <ArticleNewsThird />
    {/* Outros artigos podem ser listados aqui */}
  </section>
);

export default ArticlesSection;

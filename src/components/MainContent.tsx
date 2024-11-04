import React from 'react';
import ArticlesSection from './ArticlesSection';
import Sidebar from './Sidebar';
import Footer from './Footer';


const MainContent: React.FC = () => (
  <>
    <main className="container mx-auto flex mt-8">
      <ArticlesSection />
      <Sidebar />
    </main>
    <Footer />
  </>
);

export default MainContent;

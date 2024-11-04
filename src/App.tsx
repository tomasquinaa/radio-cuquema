import React from "react";
import Header from "./components/Header";
import BreakingNewsBar from "./components/BreakingNewsBar";
import NavigationBar from "./components/NavigationBar";
import MainContent from "./components/MainContent";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <BreakingNewsBar />
      <NavigationBar />
      <MainContent />
    </>
  );
};

export default App;

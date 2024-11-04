import React from 'react';

const BreakingNewsBar: React.FC = () => (
  <div className="bg-yellow-500 text-black inline-flex items-center p-2 space-x-2 ml-20 rounded">
    <span role="img" aria-label="breaking news">
      🔴 BREAKING NEWS
    </span>
  </div>
);

export default BreakingNewsBar;

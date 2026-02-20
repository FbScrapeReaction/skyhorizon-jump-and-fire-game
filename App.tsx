import React from 'react';
import { Experience } from './components/Experience';
import { Interface } from './components/Interface';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-black">
      <Experience />
      <Interface />
    </div>
  );
};

export default App;
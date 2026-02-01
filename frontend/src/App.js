import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import './styles/global.css';

function App() {
  const [activeGame, setActiveGame] = useState('valorant');
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="app">
      <Sidebar 
        activeGame={activeGame}
        setActiveGame={setActiveGame}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />
      
      {activeNav === 'dashboard' && (
        <Dashboard activeGame={activeGame} />
      )}
      
      {activeNav === 'players' && (
        <Players activeGame={activeGame} />
      )}
      
      {activeNav === 'matches' && (
        <Matches activeGame={activeGame} />
      )}
      
      {activeNav === 'analytics' && (
        <Analytics activeGame={activeGame} />
      )}
      
      {activeNav === 'ai-assistant' && (
        <AIAssistant activeGame={activeGame} />
      )}
    </div>
  );
}

export default App;

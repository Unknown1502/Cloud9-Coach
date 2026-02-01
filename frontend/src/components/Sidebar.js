import React from 'react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ activeGame, setActiveGame, activeNav, setActiveNav }) => {
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { id: 'players', icon: '👥', label: 'Players', badge: null },
    { id: 'matches', icon: '🎮', label: 'Matches', badge: '3' },
    { id: 'analytics', icon: '📈', label: 'Analytics', badge: null },
    { id: 'ai-assistant', icon: '🤖', label: 'AI Assistant', badge: 'New' },
  ];

  return (
    <motion.aside 
      className={`sidebar ${activeGame}`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <motion.div 
          className="logo-icon"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          C9
        </motion.div>
        <div className="logo-text">
          <h1 className="logo-title">Cloud9</h1>
          <p className="logo-subtitle">Assistant Coach</p>
        </div>
      </div>

      {/* Game Switcher */}
      <div className="game-switcher">
        <p className="switcher-label">SELECT GAME</p>
        <div className="game-buttons">
          <motion.button
            className={`game-btn ${activeGame === 'valorant' ? 'active' : ''}`}
            onClick={() => setActiveGame('valorant')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🎯</span>
            <span className="game-name">VALORANT</span>
          </motion.button>
          <motion.button
            className={`game-btn ${activeGame === 'league' ? 'active' : ''}`}
            onClick={() => setActiveGame('league')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">⚔️</span>
            <span className="game-name">LEAGUE</span>
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-label">NAVIGATION</p>
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label-text">{item.label}</span>
            {item.badge && (
              <span className={`nav-badge ${item.badge === 'New' ? 'badge-new' : ''}`}>
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* AI Status */}
      <motion.div 
        className="ai-status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="status-indicator">
          <motion.div 
            className="status-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div className="status-text">
          <p className="status-title">AI Online</p>
          <p className="status-subtitle">Ready to assist</p>
        </div>
      </motion.div>

      {/* Settings */}
      <motion.button 
        className="settings-btn"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="settings-icon">⚙️</span>
        <span className="settings-text">Settings</span>
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;

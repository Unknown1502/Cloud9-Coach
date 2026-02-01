import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import './Dashboard.css';

const Players = ({ activeGame }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);

  const valorantPlayers = [
    { 
      id: 1, 
      name: 'OXY', 
      role: 'Duelist', 
      kda: 1.45, 
      acs: 285, 
      headshot: 28, 
      clutch: 42,
      matches: 24,
      winRate: 67,
      agents: ['Jett', 'Raze', 'Neon']
    },
    { 
      id: 2, 
      name: 'vanity', 
      role: 'Controller', 
      kda: 1.18, 
      acs: 215, 
      headshot: 22, 
      clutch: 35,
      matches: 24,
      winRate: 62,
      agents: ['Omen', 'Astra', 'Brimstone']
    },
    { 
      id: 3, 
      name: 'xeppaa', 
      role: 'Initiator', 
      kda: 1.12, 
      acs: 198, 
      headshot: 24, 
      clutch: 38,
      matches: 22,
      winRate: 59,
      agents: ['Sova', 'Fade', 'Skye']
    },
    { 
      id: 4, 
      name: 'moose', 
      role: 'Sentinel', 
      kda: 1.08, 
      acs: 185, 
      headshot: 21, 
      clutch: 31,
      matches: 23,
      winRate: 61,
      agents: ['Killjoy', 'Cypher', 'Chamber']
    },
    { 
      id: 5, 
      name: 'wippie', 
      role: 'Flex', 
      kda: 1.15, 
      acs: 205, 
      headshot: 23, 
      clutch: 36,
      matches: 24,
      winRate: 63,
      agents: ['Viper', 'Harbor', 'Sage']
    }
  ];

  const lolPlayers = [
    { 
      id: 1, 
      name: 'Berserker', 
      role: 'ADC', 
      kda: 3.2, 
      cs: 8.5, 
      dmg: 625, 
      gold: 425,
      matches: 24,
      winRate: 58,
      champions: ['Jinx', 'Aphelios', 'Zeri']
    },
    { 
      id: 2, 
      name: 'Blaber', 
      role: 'Jungle', 
      kda: 2.9, 
      cs: 5.2, 
      dmg: 385, 
      gold: 315,
      matches: 24,
      winRate: 54,
      champions: ['Lee Sin', 'Viego', 'Graves']
    },
    { 
      id: 3, 
      name: 'Jojopyun', 
      role: 'Mid', 
      kda: 2.7, 
      cs: 7.8, 
      dmg: 515, 
      gold: 395,
      matches: 22,
      winRate: 59,
      champions: ['Azir', 'Orianna', 'Sylas']
    },
    { 
      id: 4, 
      name: 'Fudge', 
      role: 'Top', 
      kda: 2.4, 
      cs: 7.2, 
      dmg: 425, 
      gold: 365,
      matches: 23,
      winRate: 57,
      champions: ['Gnar', 'Jayce', 'Renekton']
    },
    { 
      id: 5, 
      name: 'Vulcan', 
      role: 'Support', 
      kda: 3.5, 
      cs: 1.2, 
      dmg: 185, 
      gold: 245,
      matches: 24,
      winRate: 60,
      champions: ['Thresh', 'Nautilus', 'Alistar']
    }
  ];

  const players = activeGame === 'valorant' ? valorantPlayers : lolPlayers;

  useEffect(() => {
    if (players.length > 0) {
      setSelectedPlayer(players[0]);
    }
  }, [activeGame]);

  const getPlayerPerformanceData = (player) => {
    if (activeGame === 'valorant') {
      return [
        { match: 'M1', kda: 1.2, acs: 265 },
        { match: 'M2', kda: 1.6, acs: 295 },
        { match: 'M3', kda: 1.3, acs: 275 },
        { match: 'M4', kda: 1.5, acs: 290 },
        { match: 'M5', kda: 1.4, acs: 285 },
      ];
    } else {
      return [
        { match: 'M1', kda: 2.8, cs: 8.2 },
        { match: 'M2', kda: 3.5, cs: 8.8 },
        { match: 'M3', kda: 3.0, cs: 8.4 },
        { match: 'M4', kda: 3.3, cs: 8.6 },
        { match: 'M5', kda: 3.2, cs: 8.5 },
      ];
    }
  };

  const getPlayerRadarData = (player) => {
    if (activeGame === 'valorant') {
      return [
        { stat: 'Aim', value: 85 },
        { stat: 'Positioning', value: 78 },
        { stat: 'Utility', value: 82 },
        { stat: 'Clutch', value: player.clutch },
        { stat: 'Game Sense', value: 80 },
      ];
    } else {
      return [
        { stat: 'Mechanics', value: 85 },
        { stat: 'Vision', value: 72 },
        { stat: 'Teamfight', value: 88 },
        { stat: 'Laning', value: 80 },
        { stat: 'Objective', value: 75 },
      ];
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`dashboard ${activeGame}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className="dashboard-header" variants={itemVariants}>
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Players</h1>
            <p className="page-subtitle">
              Player performance and statistics
              <span className="ai-badge">⚡ AI-Powered</span>
            </p>
          </div>
        </div>
      </motion.header>

      {/* Player Roster */}
      <motion.section className="stats-grid" variants={itemVariants} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {players.map((player) => (
          <motion.div
            key={player.id}
            className={`stat-card ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            onClick={() => setSelectedPlayer(player)}
            style={{ cursor: 'pointer', border: selectedPlayer?.id === player.id ? '2px solid #00d4ff' : 'none' }}
          >
            <div className="stat-header">
              <span className="stat-label">{player.name}</span>
              <span className="stat-icon">🎮</span>
            </div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>{player.role}</div>
            <div className="stat-trend positive">
              <span className="trend-text">KDA: {player.kda}</span>
            </div>
            <div className="stat-trend" style={{ marginTop: '0.5rem' }}>
              <span className="trend-text">WR: {player.winRate}%</span>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {selectedPlayer && (
        <>
          {/* Player Stats */}
          <motion.section className="stats-grid" variants={itemVariants}>
            <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div className="stat-header">
                <span className="stat-label">KDA</span>
                <span className="stat-icon">🎯</span>
              </div>
              <div className="stat-value">{selectedPlayer.kda}</div>
              <div className="stat-trend positive">
                <span className="trend-icon">↗</span>
                <span className="trend-text">Above average</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div className="stat-header">
                <span className="stat-label">{activeGame === 'valorant' ? 'ACS' : 'CS/min'}</span>
                <span className="stat-icon">⚡</span>
              </div>
              <div className="stat-value">{activeGame === 'valorant' ? selectedPlayer.acs : selectedPlayer.cs}</div>
              <div className="stat-trend positive">
                <span className="trend-icon">↗</span>
                <span className="trend-text">Strong performance</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div className="stat-header">
                <span className="stat-label">{activeGame === 'valorant' ? 'HS%' : 'DMG/min'}</span>
                <span className="stat-icon">💥</span>
              </div>
              <div className="stat-value">{activeGame === 'valorant' ? `${selectedPlayer.headshot}%` : selectedPlayer.dmg}</div>
              <div className="stat-trend">
                <span className="trend-text">Consistent</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div className="stat-header">
                <span className="stat-label">Matches</span>
                <span className="stat-icon">🏆</span>
              </div>
              <div className="stat-value">{selectedPlayer.matches}</div>
              <div className="stat-trend positive">
                <span className="trend-text">WR: {selectedPlayer.winRate}%</span>
              </div>
            </motion.div>
          </motion.section>

          {/* Charts */}
          <div className="charts-row">
            <motion.div className="chart-card" variants={itemVariants}>
              <div className="chart-header">
                <h3 className="chart-title">Recent Performance</h3>
                <p className="chart-subtitle">Last 5 matches</p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={getPlayerPerformanceData(selectedPlayer)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="match" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(0,212,255,0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="kda" stroke="#00d4ff" strokeWidth={3} dot={{ fill: '#00d4ff', r: 5 }} />
                    <Line type="monotone" dataKey={activeGame === 'valorant' ? 'acs' : 'cs'} stroke="#ff6b9d" strokeWidth={3} dot={{ fill: '#ff6b9d', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div className="chart-card" variants={itemVariants}>
              <div className="chart-header">
                <h3 className="chart-title">Skill Breakdown</h3>
                <p className="chart-subtitle">Performance metrics</p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={getPlayerRadarData(selectedPlayer)}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="stat" stroke="rgba(255,255,255,0.7)" />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />
                    <Radar name={selectedPlayer.name} dataKey="value" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Champion/Agent Pool */}
          <motion.div className="insights-section" variants={itemVariants}>
            <div className="section-header">
              <h2 className="section-title">{activeGame === 'valorant' ? 'Agent Pool' : 'Champion Pool'}</h2>
            </div>
            <div className="insights-grid">
              {(activeGame === 'valorant' ? selectedPlayer.agents : selectedPlayer.champions).map((item, idx) => (
                <motion.div
                  key={idx}
                  className="insight-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="insight-content">
                    <h3 className="insight-title">{item}</h3>
                    <p className="insight-description">
                      {idx === 0 ? 'Most played - High proficiency' : idx === 1 ? 'Secondary pick - Versatile' : 'Situational pick - Effective'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Players;

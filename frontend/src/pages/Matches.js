import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Dashboard.css';

const Matches = ({ activeGame }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const valorantMatches = [
    {
      id: 1,
      date: '2026-01-28',
      opponent: 'Sentinels',
      result: 'W',
      score: '2-1',
      map: 'Ascent',
      duration: '42:15',
      rounds: 26,
      teamKDA: 1.35,
      highlights: ['OXY 28K', 'Clutch Round 24']
    },
    {
      id: 2,
      date: '2026-01-25',
      opponent: 'NRG',
      result: 'L',
      score: '1-2',
      map: 'Bind',
      duration: '38:42',
      rounds: 24,
      teamKDA: 0.95,
      highlights: ['Close Game', 'OT Loss']
    },
    {
      id: 3,
      date: '2026-01-22',
      opponent: '100 Thieves',
      result: 'W',
      score: '2-0',
      map: 'Haven',
      duration: '35:20',
      rounds: 26,
      teamKDA: 1.52,
      highlights: ['Dominant Win', 'vanity 15A']
    },
    {
      id: 4,
      date: '2026-01-19',
      opponent: 'Evil Geniuses',
      result: 'W',
      score: '2-1',
      map: 'Split',
      duration: '45:30',
      rounds: 28,
      teamKDA: 1.28,
      highlights: ['Comeback Win', 'xeppaa MVP']
    },
    {
      id: 5,
      date: '2026-01-16',
      opponent: 'FaZe Clan',
      result: 'L',
      score: '0-2',
      map: 'Fracture',
      duration: '32:15',
      rounds: 24,
      teamKDA: 0.82,
      highlights: ['Tough Loss', 'Strategy Issues']
    }
  ];

  const lolMatches = [
    {
      id: 1,
      date: '2026-01-28',
      opponent: 'Team Liquid',
      result: 'W',
      score: '1-0',
      duration: '34:25',
      kills: 18,
      deaths: 12,
      objectives: 'Baron x2, 4 Drakes',
      highlights: ['Berserker Penta', 'Baron Steal']
    },
    {
      id: 2,
      date: '2026-01-25',
      opponent: 'TSM',
      result: 'L',
      score: '0-1',
      duration: '42:18',
      kills: 15,
      deaths: 22,
      objectives: 'Baron x1, 2 Drakes',
      highlights: ['Late Game Throw', 'Elder Lost']
    },
    {
      id: 3,
      date: '2026-01-22',
      opponent: 'FlyQuest',
      result: 'W',
      score: '1-0',
      duration: '28:45',
      kills: 22,
      deaths: 8,
      objectives: 'Baron x1, Soul',
      highlights: ['Clean Game', 'Blaber Domination']
    },
    {
      id: 4,
      date: '2026-01-19',
      opponent: 'Golden Guardians',
      result: 'W',
      score: '1-0',
      duration: '31:20',
      kills: 19,
      deaths: 11,
      objectives: 'Baron x1, 3 Drakes',
      highlights: ['Jojopyun Carry', 'Mid Priority']
    },
    {
      id: 5,
      date: '2026-01-16',
      opponent: 'Evil Geniuses',
      result: 'L',
      score: '0-1',
      duration: '38:55',
      kills: 14,
      deaths: 20,
      objectives: 'Baron x0, 2 Drakes',
      highlights: ['Vision Issues', 'No Baron Control']
    }
  ];

  const matches = activeGame === 'valorant' ? valorantMatches : lolMatches;

  const getMatchTimeline = (match) => {
    if (activeGame === 'valorant') {
      return [
        { round: 1, team: 5, opponent: 7 },
        { round: 2, team: 8, opponent: 9 },
        { round: 3, team: 10, opponent: 10 },
        { round: 4, team: 12, opponent: 11 },
        { round: 5, team: 13, opponent: 13 },
      ];
    } else {
      return [
        { time: '5min', gold: 15, kills: 2 },
        { time: '10min', gold: 18, kills: 5 },
        { time: '15min', gold: 22, kills: 8 },
        { time: '20min', gold: 28, kills: 12 },
        { time: '25min', gold: 32, kills: 15 },
      ];
    }
  };

  const getPlayerPerformance = (match) => {
    if (activeGame === 'valorant') {
      return [
        { player: 'OXY', kills: 28, deaths: 18, assists: 12, acs: 312 },
        { player: 'vanity', kills: 18, deaths: 20, assists: 24, acs: 215 },
        { player: 'xeppaa', kills: 22, deaths: 19, assists: 18, acs: 245 },
        { player: 'moose', kills: 15, deaths: 21, assists: 16, acs: 185 },
        { player: 'wippie', kills: 19, deaths: 20, assists: 20, acs: 205 },
      ];
    } else {
      return [
        { player: 'Berserker', kills: 8, deaths: 2, assists: 6, cs: 285, dmg: 28500 },
        { player: 'Blaber', kills: 4, deaths: 3, assists: 10, cs: 165, dmg: 12800 },
        { player: 'Jojopyun', kills: 3, deaths: 4, assists: 9, cs: 268, dmg: 22400 },
        { player: 'Fudge', kills: 2, deaths: 2, assists: 8, cs: 245, dmg: 18200 },
        { player: 'Vulcan', kills: 1, deaths: 1, assists: 14, cs: 42, dmg: 5600 },
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
            <h1 className="page-title">Matches</h1>
            <p className="page-subtitle">
              Match history and detailed reviews
              <span className="ai-badge">⚡ AI-Powered</span>
            </p>
          </div>
        </div>
      </motion.header>

      {/* Match History */}
      <motion.section variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">Recent Matches</h2>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {matches.map((match) => (
            <motion.div
              key={match.id}
              className="insight-card"
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedMatch(match)}
              style={{ 
                cursor: 'pointer',
                border: selectedMatch?.id === match.id ? '2px solid #00d4ff' : '1px solid rgba(255,255,255,0.1)',
                background: match.result === 'W' ? 'rgba(0, 212, 255, 0.05)' : 'rgba(255, 107, 157, 0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      color: match.result === 'W' ? '#00d4ff' : '#ff6b9d'
                    }}>
                      {match.result}
                    </span>
                    <h3 className="insight-title" style={{ margin: 0 }}>vs {match.opponent}</h3>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '0.9rem'
                    }}>
                      {match.score}
                    </span>
                  </div>
                  <p className="insight-description" style={{ margin: 0 }}>
                    {match.date} • {activeGame === 'valorant' ? match.map : `${match.duration}`} • {match.highlights.join(', ')}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00d4ff' }}>
                    {activeGame === 'valorant' ? `${match.teamKDA} KDA` : `${match.kills}-${match.deaths}`}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    {match.duration}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {selectedMatch && (
        <>
          {/* Match Stats */}
          <motion.section className="stats-grid" variants={itemVariants}>
            <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div className="stat-header">
                <span className="stat-label">Result</span>
                <span className="stat-icon">{selectedMatch.result === 'W' ? '🏆' : '💔'}</span>
              </div>
              <div className="stat-value">{selectedMatch.result === 'W' ? 'Victory' : 'Defeat'}</div>
              <div className="stat-trend">
                <span className="trend-text">{selectedMatch.score}</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div className="stat-header">
                <span className="stat-label">Duration</span>
                <span className="stat-icon">⏱️</span>
              </div>
              <div className="stat-value">{selectedMatch.duration}</div>
              <div className="stat-trend">
                <span className="trend-text">{activeGame === 'valorant' ? `${selectedMatch.rounds} rounds` : 'Game time'}</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div className="stat-header">
                <span className="stat-label">{activeGame === 'valorant' ? 'Team KDA' : 'Kills'}</span>
                <span className="stat-icon">🎯</span>
              </div>
              <div className="stat-value">{activeGame === 'valorant' ? selectedMatch.teamKDA : selectedMatch.kills}</div>
              <div className="stat-trend">
                <span className="trend-text">{activeGame === 'valorant' ? 'Average' : `${selectedMatch.deaths} deaths`}</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div className="stat-header">
                <span className="stat-label">{activeGame === 'valorant' ? 'Map' : 'Objectives'}</span>
                <span className="stat-icon">🗺️</span>
              </div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                {activeGame === 'valorant' ? selectedMatch.map : selectedMatch.objectives.split(',')[0]}
              </div>
              <div className="stat-trend">
                <span className="trend-text">{activeGame === 'valorant' ? 'Played' : selectedMatch.objectives.split(',').slice(1).join(',')}</span>
              </div>
            </motion.div>
          </motion.section>

          {/* Match Timeline */}
          <div className="charts-row">
            <motion.div className="chart-card" variants={itemVariants}>
              <div className="chart-header">
                <h3 className="chart-title">{activeGame === 'valorant' ? 'Round Progression' : 'Gold & Kills Timeline'}</h3>
                <p className="chart-subtitle">Match flow analysis</p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={getMatchTimeline(selectedMatch)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey={activeGame === 'valorant' ? 'round' : 'time'} stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(0,212,255,0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    {activeGame === 'valorant' ? (
                      <>
                        <Line type="monotone" dataKey="team" stroke="#00d4ff" strokeWidth={3} dot={{ fill: '#00d4ff', r: 5 }} name="Cloud9" />
                        <Line type="monotone" dataKey="opponent" stroke="#ff6b9d" strokeWidth={3} dot={{ fill: '#ff6b9d', r: 5 }} name={selectedMatch.opponent} />
                      </>
                    ) : (
                      <>
                        <Line type="monotone" dataKey="gold" stroke="#00d4ff" strokeWidth={3} dot={{ fill: '#00d4ff', r: 5 }} name="Gold (K)" />
                        <Line type="monotone" dataKey="kills" stroke="#ff6b9d" strokeWidth={3} dot={{ fill: '#ff6b9d', r: 5 }} name="Kills" />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div className="chart-card" variants={itemVariants}>
              <div className="chart-header">
                <h3 className="chart-title">Player Performance</h3>
                <p className="chart-subtitle">Individual contributions</p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={getPlayerPerformance(selectedMatch)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="player" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(0,212,255,0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="kills" fill="#00d4ff" />
                    <Bar dataKey="deaths" fill="#ff6b9d" />
                    <Bar dataKey="assists" fill="#c084fc" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Key Moments */}
          <motion.div className="insights-section" variants={itemVariants}>
            <div className="section-header">
              <h2 className="section-title">Key Moments</h2>
            </div>
            <div className="insights-grid">
              {selectedMatch.highlights.map((highlight, idx) => (
                <motion.div
                  key={idx}
                  className="insight-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="insight-icon" style={{ fontSize: '2rem' }}>
                    {idx === 0 ? '⭐' : idx === 1 ? '🔥' : '💡'}
                  </div>
                  <div className="insight-content">
                    <h3 className="insight-title">{highlight}</h3>
                    <p className="insight-description">
                      {idx === 0 ? 'Game-changing moment that shifted momentum' : 
                       idx === 1 ? 'Critical play that impacted the outcome' : 
                       'Notable event during the match'}
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

export default Matches;

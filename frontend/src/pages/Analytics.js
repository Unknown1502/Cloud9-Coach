import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import './Dashboard.css';

const Analytics = ({ activeGame }) => {
  const [timeRange, setTimeRange] = useState('month');

  const winRateTrend = [
    { period: 'Week 1', winRate: 55, avgKDA: 1.2 },
    { period: 'Week 2', winRate: 62, avgKDA: 1.35 },
    { period: 'Week 3', winRate: 58, avgKDA: 1.18 },
    { period: 'Week 4', winRate: 67, avgKDA: 1.45 },
  ];

  const rolePerformance = activeGame === 'valorant' ? [
    { role: 'Duelist', performance: 85, games: 48 },
    { role: 'Controller', performance: 72, games: 48 },
    { role: 'Initiator', performance: 78, games: 44 },
    { role: 'Sentinel', performance: 68, games: 46 },
    { role: 'Flex', performance: 75, games: 48 },
  ] : [
    { role: 'Top', performance: 72, games: 46 },
    { role: 'Jungle', performance: 68, games: 48 },
    { role: 'Mid', performance: 78, games: 44 },
    { role: 'ADC', performance: 82, games: 48 },
    { role: 'Support', performance: 80, games: 48 },
  ];

  const mapWinRate = activeGame === 'valorant' ? [
    { name: 'Ascent', value: 68, games: 12 },
    { name: 'Bind', value: 55, games: 11 },
    { name: 'Haven', value: 72, games: 10 },
    { name: 'Split', value: 62, games: 13 },
    { name: 'Fracture', value: 48, games: 8 },
  ] : [
    { name: 'Blue Side', value: 62, games: 28 },
    { name: 'Red Side', value: 54, games: 26 },
  ];

  const objectiveControl = activeGame === 'valorant' ? [
    { objective: 'First Blood', rate: 58 },
    { objective: 'Pistol Rounds', rate: 52 },
    { objective: 'Eco Rounds', rate: 45 },
    { objective: 'Clutch Situations', rate: 38 },
  ] : [
    { objective: 'First Dragon', rate: 62 },
    { objective: 'First Baron', rate: 55 },
    { objective: 'First Tower', rate: 68 },
    { objective: 'Herald Control', rate: 58 },
  ];

  const strengthsWeaknesses = activeGame === 'valorant' ? {
    strengths: [
      { title: 'Aggressive Playstyle', score: 88, description: 'High first blood rate and early round dominance' },
      { title: 'Clutch Performance', score: 82, description: 'Strong individual plays in critical moments' },
      { title: 'Agent Diversity', score: 78, description: 'Flexible composition and role adaptation' },
    ],
    weaknesses: [
      { title: 'Eco Round Management', score: 45, description: 'Low win rate in economy-disadvantaged rounds' },
      { title: 'Retake Situations', score: 52, description: 'Struggles when opponents plant spike first' },
      { title: 'Map Pool Depth', score: 58, description: 'Inconsistent performance on certain maps' },
    ]
  } : {
    strengths: [
      { title: 'Early Game Pressure', score: 85, description: 'Strong laning phase and first tower control' },
      { title: 'Teamfight Execution', score: 82, description: 'Excellent coordination in 5v5 scenarios' },
      { title: 'Vision Control', score: 78, description: 'Superior ward placement and map awareness' },
    ],
    weaknesses: [
      { title: 'Baron Control', score: 55, description: 'Contested baron attempts with mixed results' },
      { title: 'Late Game Scaling', score: 58, description: 'Difficulty closing out extended games' },
      { title: 'Red Side Adaptation', score: 54, description: 'Lower win rate on red side' },
    ]
  };

  const COLORS = ['#00d4ff', '#ff6b9d', '#c084fc', '#fbbf24', '#34d399'];

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
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">
              Advanced statistics and trends
              <span className="ai-badge">⚡ AI-Powered</span>
            </p>
          </div>
          <div className="header-right">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="season">This Season</option>
            </select>
          </div>
        </div>
      </motion.header>

      {/* Key Metrics */}
      <motion.section className="stats-grid" variants={itemVariants}>
        <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div className="stat-header">
            <span className="stat-label">Overall Win Rate</span>
            <span className="stat-icon">🏆</span>
          </div>
          <div className="stat-value">63%</div>
          <div className="stat-trend positive">
            <span className="trend-icon">↗</span>
            <span className="trend-text">+9% vs last period</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div className="stat-header">
            <span className="stat-label">Avg Game Duration</span>
            <span className="stat-icon">⏱️</span>
          </div>
          <div className="stat-value">{activeGame === 'valorant' ? '38:24' : '33:45'}</div>
          <div className="stat-trend">
            <span className="trend-text">Consistent pacing</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div className="stat-header">
            <span className="stat-label">Performance Score</span>
            <span className="stat-icon">📊</span>
          </div>
          <div className="stat-value">78.5</div>
          <div className="stat-trend positive">
            <span className="trend-icon">↗</span>
            <span className="trend-text">Above league avg</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div className="stat-header">
            <span className="stat-label">Consistency Rating</span>
            <span className="stat-icon">🎯</span>
          </div>
          <div className="stat-value">82%</div>
          <div className="stat-trend positive">
            <span className="trend-icon">↗</span>
            <span className="trend-text">High stability</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Charts Row 1 */}
      <div className="charts-row">
        <motion.div className="chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h3 className="chart-title">Win Rate Trend</h3>
            <p className="chart-subtitle">Performance over time</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={winRateTrend}>
                <defs>
                  <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="winRate" stroke="#00d4ff" fillOpacity={1} fill="url(#colorWinRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h3 className="chart-title">{activeGame === 'valorant' ? 'Map Win Rates' : 'Side Win Rates'}</h3>
            <p className="chart-subtitle">Performance by {activeGame === 'valorant' ? 'map' : 'side'}</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={mapWinRate}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mapWinRate.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        <motion.div className="chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h3 className="chart-title">Role Performance</h3>
            <p className="chart-subtitle">Performance score by role</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={rolePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="role" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="performance" fill="#00d4ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h3 className="chart-title">Objective Control</h3>
            <p className="chart-subtitle">Success rate by objective type</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={objectiveControl} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="objective" type="category" stroke="rgba(255,255,255,0.5)" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="rate" fill="#ff6b9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Strengths */}
      <motion.div className="insights-section" variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">💪 Team Strengths</h2>
        </div>
        <div className="insights-grid">
          {strengthsWeaknesses.strengths.map((strength, idx) => (
            <motion.div
              key={idx}
              className="insight-card"
              whileHover={{ scale: 1.02 }}
              style={{ background: 'rgba(0, 212, 255, 0.05)' }}
            >
              <div className="insight-icon" style={{ fontSize: '2rem', color: '#00d4ff' }}>
                ✓
              </div>
              <div className="insight-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 className="insight-title">{strength.title}</h3>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#00d4ff' 
                  }}>
                    {strength.score}
                  </span>
                </div>
                <p className="insight-description">{strength.description}</p>
                <div style={{ 
                  marginTop: '0.5rem', 
                  height: '4px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${strength.score}%`, 
                    background: '#00d4ff',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weaknesses */}
      <motion.div className="insights-section" variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">⚠️ Areas for Improvement</h2>
        </div>
        <div className="insights-grid">
          {strengthsWeaknesses.weaknesses.map((weakness, idx) => (
            <motion.div
              key={idx}
              className="insight-card"
              whileHover={{ scale: 1.02 }}
              style={{ background: 'rgba(255, 107, 157, 0.05)' }}
            >
              <div className="insight-icon" style={{ fontSize: '2rem', color: '#ff6b9d' }}>
                !
              </div>
              <div className="insight-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 className="insight-title">{weakness.title}</h3>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#ff6b9d' 
                  }}>
                    {weakness.score}
                  </span>
                </div>
                <p className="insight-description">{weakness.description}</p>
                <div style={{ 
                  marginTop: '0.5rem', 
                  height: '4px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${weakness.score}%`, 
                    background: '#ff6b9d',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div className="insights-section" variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">🎯 AI Recommendations</h2>
        </div>
        <div className="insights-grid">
          <motion.div className="insight-card" whileHover={{ scale: 1.02 }}>
            <div className="insight-icon" style={{ fontSize: '2rem' }}>🔍</div>
            <div className="insight-content">
              <h3 className="insight-title">Focus on Weak Maps</h3>
              <p className="insight-description">
                Dedicate practice time to {activeGame === 'valorant' ? 'Fracture and Bind' : 'red side strategies'} to improve overall consistency
              </p>
            </div>
          </motion.div>

          <motion.div className="insight-card" whileHover={{ scale: 1.02 }}>
            <div className="insight-icon" style={{ fontSize: '2rem' }}>📈</div>
            <div className="insight-content">
              <h3 className="insight-title">Leverage Strengths</h3>
              <p className="insight-description">
                Continue aggressive early game strategies - they're working well and creating winning opportunities
              </p>
            </div>
          </motion.div>

          <motion.div className="insight-card" whileHover={{ scale: 1.02 }}>
            <div className="insight-icon" style={{ fontSize: '2rem' }}>🎓</div>
            <div className="insight-content">
              <h3 className="insight-title">Strategic Review</h3>
              <p className="insight-description">
                Analyze {activeGame === 'valorant' ? 'eco round' : 'baron control'} VODs to identify patterns and develop counter-strategies
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;

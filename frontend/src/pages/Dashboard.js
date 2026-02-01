import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ activeGame }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [activeGame]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/dashboard/${activeGame}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const performanceTrend = [
    { week: 'W1', performance: 65, avg: 60 },
    { week: 'W2', performance: 68, avg: 60 },
    { week: 'W3', performance: 72, avg: 60 },
    { week: 'W4', performance: 70, avg: 60 },
    { week: 'W5', performance: 75, avg: 60 },
    { week: 'W6', performance: 78, avg: 60 },
  ];

  const playerRadarData = [
    { stat: 'Aim', value: 85 },
    { stat: 'Game Sense', value: 78 },
    { stat: 'Positioning', value: 82 },
    { stat: 'Utility', value: 75 },
    { stat: 'Clutch', value: 88 },
    { stat: 'Communication', value: 80 },
  ];

  const stats = dashboardData?.stats || {
    win_rate: activeGame === 'valorant' ? 64 : 58,
    avg_kda: activeGame === 'valorant' ? 1.24 : 2.8,
    first_blood_rate: activeGame === 'valorant' ? 52 : 48,
    clutch_rate: activeGame === 'valorant' ? 38 : 42,
    total_matches: dashboardData?.stats?.total_matches || 0
  };

  const topPlayers = dashboardData?.players?.slice(0, 3) || [
    { name: activeGame === 'valorant' ? 'OXY' : 'Berserker', avg_kda: activeGame === 'valorant' ? 1.45 : 3.2, matches_played: 24 },
    { name: activeGame === 'valorant' ? 'vanity' : 'Blaber', avg_kda: activeGame === 'valorant' ? 1.18 : 2.9, matches_played: 24 },
    { name: activeGame === 'valorant' ? 'xeppaa' : 'Jojopyun', avg_kda: activeGame === 'valorant' ? 1.12 : 2.7, matches_played: 22 },
  ];

  const insights = activeGame === 'valorant' ? [
    {
      type: 'critical',
      title: 'OXY Opening Impact Critical',
      description: 'Team loses 78% of rounds when OXY dies without KAST contribution.',
      metric: '78%',
      metricLabel: 'loss rate'
    },
    {
      type: 'warning',
      title: 'Split Pistol Rounds',
      description: 'Only 35% win rate on Split pistol rounds. Strategy adjustment needed.',
      metric: '35%',
      metricLabel: 'win rate'
    }
  ] : [
    {
      type: 'critical',
      title: 'Early Game Pathing',
      description: 'Topside ganks pre-6 minutes have only 22% success rate.',
      metric: '22%',
      metricLabel: 'success rate'
    },
    {
      type: 'warning',
      title: 'Vision Control',
      description: 'Team average 28 vision score - below optimal threshold of 35.',
      metric: '28',
      metricLabel: 'avg score'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
      {/* Header */}
      <motion.header className="dashboard-header" variants={itemVariants}>
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              {activeGame === 'valorant' ? 'VALORANT' : 'League of Legends'} Performance Overview
              <span className="ai-badge">⚡ AI-Powered</span>
            </p>
          </div>
          <div className="header-right">
            <motion.button 
              className="refresh-btn"
              onClick={fetchDashboardData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="refresh-icon">🔄</span>
              Refresh Data
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Stats Grid */}
      <motion.section className="stats-grid" variants={itemVariants}>
        <motion.div 
          className="stat-card win-rate"
          whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="stat-header">
            <span className="stat-label">Win Rate</span>
            <span className="stat-icon">🏆</span>
          </div>
          <div className="stat-value">{loading ? '...' : `${stats.win_rate}%`}</div>
          <div className="stat-trend positive">
            <span className="trend-icon">↗</span>
            <span className="trend-text">+8% vs last month</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card kda"
          whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="stat-header">
            <span className="stat-label">Avg KDA</span>
            <span className="stat-icon">🎯</span>
          </div>
          <div className="stat-value">{loading ? '...' : stats.avg_kda}</div>
          <div className="stat-trend negative">
            <span className="trend-icon">↘</span>
            <span className="trend-text">-3% vs last month</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card first-blood"
          whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="stat-header">
            <span className="stat-label">First Blood %</span>
            <span className="stat-icon">⚡</span>
          </div>
          <div className="stat-value">{loading ? '...' : `${stats.first_blood_rate}%`}</div>
          <div className="stat-trend positive">
            <span className="trend-icon">↗</span>
            <span className="trend-text">+12% vs last month</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card clutch"
          whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="stat-header">
            <span className="stat-label">Clutch Rate</span>
            <span className="stat-icon">💪</span>
          </div>
          <div className="stat-value">{loading ? '...' : `${stats.clutch_rate}%`}</div>
          <div className="stat-trend negative">
            <span className="trend-icon">↘</span>
            <span className="trend-text">-5% vs last month</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Charts Section */}
      <div className="charts-row">
        {/* Performance Trend */}
        <motion.div className="chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h3 className="chart-title">Performance Trend</h3>
            <p className="chart-subtitle">Last 6 weeks vs league average</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeGame === 'valorant' ? '#FF4655' : '#0AC8B9'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={activeGame === 'valorant' ? '#FF4655' : '#0AC8B9'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="performance" 
                  stroke={activeGame === 'valorant' ? '#FF4655' : '#0AC8B9'}
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPerformance)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Player Radar */}
        <motion.div className="chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h3 className="chart-title">Top Player Skills</h3>
            <p className="chart-subtitle">{topPlayers[0]?.name || 'Player'} performance breakdown</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={playerRadarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="stat" stroke="rgba(255,255,255,0.5)" />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />
                <Radar 
                  name="Player" 
                  dataKey="value" 
                  stroke={activeGame === 'valorant' ? '#FF4655' : '#0AC8B9'}
                  fill={activeGame === 'valorant' ? '#FF4655' : '#0AC8B9'}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Players and Insights */}
      <div className="bottom-row">
        {/* Top Players */}
        <motion.div className="players-card" variants={itemVariants}>
          <div className="card-header">
            <h3 className="card-title">Top Performers</h3>
            <p className="card-subtitle">Based on recent matches</p>
          </div>
          <div className="players-list">
            {topPlayers.map((player, index) => (
              <motion.div 
                key={player.name}
                className="player-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="player-rank">#{index + 1}</div>
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-matches">{player.matches_played} matches</div>
                </div>
                <div className="player-kda">
                  <div className="kda-value">{player.avg_kda}</div>
                  <div className="kda-label">KDA</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div className="insights-card" variants={itemVariants}>
          <div className="card-header">
            <h3 className="card-title">
              <span className="ai-icon">⚡</span>
              AI Insights
            </h3>
            <p className="card-subtitle">Updated 5m ago</p>
          </div>
          <div className="insights-list">
            {insights.map((insight, index) => (
              <motion.div 
                key={index}
                className={`insight-item ${insight.type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="insight-icon">
                  {insight.type === 'critical' ? '⚠️' : '💡'}
                </div>
                <div className="insight-content">
                  <h4 className="insight-title">{insight.title}</h4>
                  <p className="insight-description">{insight.description}</p>
                  <div className="insight-metric">
                    <span className="metric-value">{insight.metric}</span>
                    <span className="metric-label">{insight.metricLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

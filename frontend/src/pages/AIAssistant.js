import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:8000';

const AIAssistant = ({ activeGame }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your AI Assistant Coach for ${activeGame === 'valorant' ? 'VALORANT' : 'League of Legends'}. I can help you with:\n\n🎯 **Main Features:**\n• Personalized Player Insights - Analyze individual performance with data-backed feedback\n• Automated Macro Review - Generate game review agendas from match data\n• Hypothetical Predictions - "What if" scenario analysis\n\n💡 **Quick Actions:**\nUse the buttons below to access these features, or ask me anything!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [formData, setFormData] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mainFeatures = [
    {
      id: 'personalized-insights',
      title: '🎯 Personalized Player Insights',
      description: 'Analyze individual player performance with data-backed feedback',
      color: '#00d4ff'
    },
    {
      id: 'macro-review',
      title: '📊 Automated Macro Review',
      description: 'Generate structured game review agenda from match data',
      color: '#ff6b6b'
    },
    {
      id: 'hypothetical-prediction',
      title: '🔮 Hypothetical Predictions',
      description: 'Analyze "what if" scenarios and predict outcomes',
      color: '#4ecdc4'
    }
  ];

  // API Integration Functions
  const callPersonalizedInsights = async (playerName, matchData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assistant/personalized-insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: playerName,
          match_data: matchData,
          game: activeGame
        })
      });
      return await response.json();
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  };

  const callMacroReview = async (matchData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assistant/macro-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_data: matchData,
          game: activeGame
        })
      });
      return await response.json();
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  };

  const callHypotheticalPrediction = async (scenario) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assistant/predict-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: activeGame,
          scenario: scenario
        })
      });
      return await response.json();
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  };

  const formatInsightsResponse = (data) => {
    let response = `**🎯 Personalized Insights for ${data.player_name}**\n\n`;
    
    if (data.data_points && data.data_points.length > 0) {
      response += `**📊 Key Data Points:**\n`;
      data.data_points.forEach(dp => {
        response += `• ${dp.metric}: ${dp.value}\n`;
        if (dp.context) response += `  ↳ ${dp.context}\n`;
      });
      response += `\n`;
    }
    
    if (data.insights && data.insights.length > 0) {
      response += `**💡 Insights:**\n`;
      data.insights.forEach(insight => {
        const icon = insight.severity === 'critical' ? '🔴' : insight.severity === 'high' ? '🟠' : '🟡';
        response += `${icon} ${insight.finding}\n`;
        if (insight.explanation) response += `  ↳ ${insight.explanation}\n`;
      });
      response += `\n`;
    }
    
    if (data.strategic_recommendations && data.strategic_recommendations.length > 0) {
      response += `**🎯 Recommendations:**\n`;
      data.strategic_recommendations.forEach(rec => {
        response += `• [${rec.priority.toUpperCase()}] ${rec.recommendation}\n`;
        if (rec.action) response += `  ↳ Action: ${rec.action}\n`;
      });
    }
    
    if (data.ai_commentary) {
      response += `\n**🤖 AI Analysis:**\n${data.ai_commentary}`;
    }
    
    return response;
  };

  const formatMacroReviewResponse = (data) => {
    let response = `**📊 Automated Macro Review**\n\n`;
    response += `Match: ${data.match_id || 'Unknown'}\n`;
    if (data.map) response += `Map: ${data.map}\n`;
    if (data.final_score) response += `Score: ${data.final_score}\n`;
    response += `\n`;
    
    if (data.agenda_items && data.agenda_items.length > 0) {
      response += `**📋 Review Agenda:**\n\n`;
      data.agenda_items.forEach((item, idx) => {
        const statusIcon = item.status === 'critical' ? '🔴' : item.status === 'concern' ? '🟠' : '🟢';
        response += `${idx + 1}. ${statusIcon} **${item.category}**\n`;
        if (item.timestamp) response += `   Time: ${item.timestamp}\n`;
        if (item.detail) response += `   ${item.detail}\n`;
        if (item.issue) response += `   Issue: ${item.issue}\n`;
        if (item.notes) response += `   Notes: ${item.notes}\n`;
        response += `\n`;
      });
    }
    
    if (data.ai_summary) {
      response += `**🤖 AI Summary:**\n${data.ai_summary}`;
    }
    
    return response;
  };

  const formatPredictionResponse = (data) => {
    let response = `**🔮 Hypothetical Scenario Analysis**\n\n`;
    response += `**Scenario:** ${data.scenario}\n\n`;
    
    if (data.game_state && Object.keys(data.game_state).length > 0) {
      response += `**📊 Game State:**\n`;
      Object.entries(data.game_state).forEach(([key, value]) => {
        response += `• ${key.replace(/_/g, ' ')}: ${value}\n`;
      });
      response += `\n`;
    }
    
    if (data.original_action) {
      response += `**❌ Original Action:**\n`;
      response += `Action: ${data.original_action.action}\n`;
      response += `Success Probability: ${data.original_action.success_probability}\n`;
      response += `Expected Value: ${data.original_action.expected_value}\n`;
      if (data.original_action.outcome) response += `Outcome: ${data.original_action.outcome}\n`;
      response += `\n`;
    }
    
    if (data.alternative_action) {
      response += `**✅ Alternative Action:**\n`;
      response += `Action: ${data.alternative_action.action}\n`;
      response += `Success Probability: ${data.alternative_action.success_probability}\n`;
      response += `Expected Value: ${data.alternative_action.expected_value}\n`;
      if (data.alternative_action.outcome) response += `Outcome: ${data.alternative_action.outcome}\n`;
      response += `\n`;
    }
    
    if (data.contest_analysis) {
      response += `**⚔️ Contest Analysis:**\n`;
      Object.entries(data.contest_analysis).forEach(([key, value]) => {
        response += `• ${key.replace(/_/g, ' ')}: ${value}\n`;
      });
      response += `\n`;
    }
    
    if (data.concede_analysis) {
      response += `**🛡️ Concede Analysis:**\n`;
      Object.entries(data.concede_analysis).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          response += `• ${key.replace(/_/g, ' ')}:\n`;
          value.forEach(item => response += `  - ${item}\n`);
        } else {
          response += `• ${key.replace(/_/g, ' ')}: ${value}\n`;
        }
      });
      response += `\n`;
    }
    
    if (data.recommendation) {
      response += `**💡 Recommendation:**\n${data.recommendation}\n\n`;
    }
    
    if (data.confidence) {
      response += `**Confidence Level:** ${data.confidence.toUpperCase()}\n`;
    }
    
    if (data.ai_analysis) {
      response += `\n**🤖 AI Analysis:**\n${data.ai_analysis}`;
    }
    
    return response;
  };

  const handleFeatureClick = async (featureId) => {
    setActiveFeature(featureId);
    
    const userMessage = {
      role: 'user',
      content: `Activating ${featureId.replace(/-/g, ' ')}...`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      let result;
      
      if (featureId === 'personalized-insights') {
        // Demo data for personalized insights
        const demoMatchData = activeGame === 'valorant' ? {
          rounds: [
            { round_num: 1, attackers: [{ name: 'OXY', kast: true, deaths: 0, kills: 2 }], defenders: [], won_by: 'attackers' },
            { round_num: 2, attackers: [{ name: 'OXY', kast: false, deaths: 1, kills: 0, first_death: true }], defenders: [], won_by: 'defenders' }
          ]
        } : {
          games: [{
            blue_team: { players: [{ summonerName: 'Berserker', role: 'ADC', stats: { kills: 8, deaths: 2, assists: 12, totalDamageDealtToChampions: 25000 } }] },
            duration: 1800
          }]
        };
        
        result = await callPersonalizedInsights(activeGame === 'valorant' ? 'OXY' : 'Berserker', demoMatchData);
        const aiResponse = {
          role: 'assistant',
          content: formatInsightsResponse(result),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        
      } else if (featureId === 'macro-review') {
        // Demo data for macro review
        const demoMatchData = activeGame === 'valorant' ? {
          match_id: 'demo_match_001',
          map: 'Ascent',
          final_score: '13-11',
          rounds: [
            { round_num: 1, team_won: true },
            { round_num: 2, buy_type: 'force', team_won: false }
          ]
        } : {
          series_id: 'demo_series_001',
          games: [{ duration: 2100 }],
          events: { first_drake: { secured: false } }
        };
        
        result = await callMacroReview(demoMatchData);
        const aiResponse = {
          role: 'assistant',
          content: formatMacroReviewResponse(result),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        
      } else if (featureId === 'hypothetical-prediction') {
        // Demo scenario
        const demoScenario = activeGame === 'valorant' ? {
          question: "On Round 22 (score 10-11) on Haven, we attempted a 3v5 retake on C-site and lost. Would it have been better to save?",
          round: 22,
          score: "10-11",
          situation: "3v5 retake",
          site: "C",
          time: "15s",
          weapons: "3 rifles",
          enemy_utility: "full"
        } : {
          question: "C9 contested Drake at 24:15 and everybody died. Would it have been better to not contest?",
          timestamp: "24:15",
          gold_diff: -2500,
          level_diff: -1.5,
          vision: "poor",
          soul_point: false,
          other_objectives: ["mid T2", "bot T2"]
        };
        
        result = await callHypotheticalPrediction(demoScenario);
        const aiResponse = {
          role: 'assistant',
          content: formatPredictionResponse(result),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }
      
    } catch (error) {
      const errorResponse = {
        role: 'assistant',
        content: `❌ Error: ${error.message}\n\nMake sure the backend server is running at ${API_BASE_URL}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
    
    setIsTyping(false);
    setActiveFeature(null);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simple response for general chat
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: `I received your message: "${userMessage.content}"\n\nFor detailed analysis, please use one of the main features above:\n• 🎯 Personalized Player Insights\n• 📊 Automated Macro Review\n• 🔮 Hypothetical Predictions\n\nThese features connect to the AI backend for comprehensive analysis!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
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
            <h1 className="page-title">AI Assistant</h1>
            <p className="page-subtitle">
              Chat with AI for insights and recommendations
              <span className="ai-badge">⚡ AI-Powered</span>
            </p>
          </div>
        </div>
      </motion.header>

      {/* Main Features */}
      <motion.section variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">AI-Powered Features</h2>
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Click a feature to see it in action with demo data</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {mainFeatures.map((feature) => (
            <motion.button
              key={feature.id}
              className="stat-card"
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              onClick={() => handleFeatureClick(feature.id)}
              disabled={isTyping}
              style={{ 
                cursor: isTyping ? 'not-allowed' : 'pointer',
                border: `2px solid ${feature.color}40`,
                background: `linear-gradient(135deg, ${feature.color}10 0%, ${feature.color}05 100%)`,
                textAlign: 'left',
                padding: '1.5rem',
                opacity: isTyping ? 0.5 : 1
              }}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: feature.color }}>
                  {feature.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.5' }}>
                {feature.description}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: feature.color, fontSize: '0.85rem', fontWeight: 'bold' }}>
                <span>Try Demo</span>
                <span>→</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Chat Container */}
      <motion.div 
        className="chart-card" 
        variants={itemVariants}
        style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
      >
        {/* Messages */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%'
              }}
            >
              <div style={{
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                background: message.role === 'user' 
                  ? 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)'
                  : 'rgba(255,255,255,0.05)',
                border: message.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  opacity: 0.7, 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>{message.role === 'user' ? '👤 You' : '🤖 AI Coach'}</span>
                  <span>•</span>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ alignSelf: 'flex-start' }}
            >
              <div style={{
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>🤖 AI Coach is typing</span>
                  <span className="typing-dots">
                    <span style={{ animation: 'blink 1.4s infinite' }}>.</span>
                    <span style={{ animation: 'blink 1.4s infinite 0.2s' }}>.</span>
                    <span style={{ animation: 'blink 1.4s infinite 0.4s' }}>.</span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: '1rem'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your team's performance..."
            style={{
              flex: 1,
              padding: '1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              padding: '1rem 2rem',
              background: input.trim() && !isTyping 
                ? 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)'
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              opacity: input.trim() && !isTyping ? 1 : 0.5
            }}
          >
            Send 🚀
          </motion.button>
        </div>
      </motion.div>

      <style>{`
        @keyframes blink {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default AIAssistant;

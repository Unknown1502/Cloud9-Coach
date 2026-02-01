import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssistantCoach.css';

function AssistantCoach() {
  const [activeDemo, setActiveDemo] = useState(null);
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);
  
  const [playerName, setPlayerName] = useState('Blaber');
  const [game, setGame] = useState('lol');

  useEffect(() => {
    const loadMatchData = async () => {
      try {
        const response = await fetch('/sample_cloud9_match.json');
        const data = await response.json();
        setMatchData(data);
      } catch (error) {
        console.error('Error loading match data:', error);
        try {
          const response = await axios.get('http://localhost:8000/data/sample_cloud9_match.json');
          setMatchData(response.data);
        } catch (backendError) {
          console.error('Error loading from backend:', backendError);
        }
      }
    };
    loadMatchData();
  }, []);

  const fetchPersonalizedInsights = async () => {
    setLoading(true);
    try {
      if (!matchData) {
        alert('Match data is still loading. Please wait a moment and try again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('http://localhost:8000/assistant/personalized-insights', {
        player_name: playerName,
        match_data: matchData,
        game: game
      });
      setDemoData({ ...demoData, personalized_insights: response.data });
      setActiveDemo('insights');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching insights:', error);
      alert('Error: ' + (error.response?.data?.detail || error.message));
      setLoading(false);
    }
  };

  const fetchMacroReview = async () => {
    setLoading(true);
    try {
      if (!matchData) {
        alert('Match data is still loading. Please wait a moment and try again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('http://localhost:8000/assistant/macro-review', {
        match_data: matchData,
        game: game
      });
      setDemoData({ ...demoData, macro_review: response.data });
      setActiveDemo('review');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching review:', error);
      alert('Error: ' + (error.response?.data?.detail || error.message));
      setLoading(false);
    }
  };

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const scenarioData = {
        question: "C9 contested Drake at 24:15 and everybody died. Would it have been better to not contest?",
        timestamp: "24:15",
        gold_diff: -2500,
        level_diff: -1.5,
        vision: "poor",
        soul_point: false,
        other_objectives: ["mid T2", "bot T2"]
      };
      
      const response = await axios.post('http://localhost:8000/assistant/predict-scenario', {
        game: game,
        scenario: scenarioData
      });
      setDemoData({ ...demoData, hypothetical_prediction: response.data });
      setActiveDemo('prediction');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setLoading(false);
    }
  };

  const renderInsights = () => {
    if (!demoData?.personalized_insights) return null;
    const insights = demoData.personalized_insights;

    return (
      <div className="content-card">
        <h2>📊 Personalized Player Insights: {insights.player_name}</h2>

        {/* Data Points */}
        <div style={{ marginBottom: '30px' }}>
          <h3>📈 Data Points</h3>
          {insights.data_points && insights.data_points.map((dp, idx) => (
            <div key={idx} className="info-box" style={{ marginBottom: '12px' }}>
              <div className="info-label">{dp.metric}</div>
              <div className="info-value" style={{ fontSize: '20px', marginBottom: '5px' }}>{dp.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{dp.context}</div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div style={{ marginBottom: '30px' }}>
          <h3>💡 Key Insights</h3>
          {insights.insights && insights.insights.map((insight, idx) => (
            <div key={idx} className={`alert-box alert-${insight.severity === 'critical' ? 'warning' : insight.severity === 'high' ? 'danger' : 'info'}`}>
              <span className={`priority-badge priority-${insight.severity}`}>
                {insight.severity.toUpperCase()}
              </span>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{insight.finding}</div>
              <div style={{ fontSize: '14px' }}>{insight.explanation}</div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: '20px' }}>
          <h3>🎯 Strategic Recommendations</h3>
          {insights.strategic_recommendations && insights.strategic_recommendations.map((rec, idx) => (
            <div key={idx} className="recommendation-card">
              <span className="priority-badge priority-high">
                {rec.priority.toUpperCase()} PRIORITY
              </span>
              <div className="recommendation-title">{rec.recommendation}</div>
              <div className="recommendation-action">Action: {rec.action}</div>
            </div>
          ))}
        </div>

        {/* AI Commentary */}
        {insights.ai_commentary && (
          <div className="ai-commentary">
            <h4><span>🤖</span> AI Coach Commentary</h4>
            <p>{insights.ai_commentary}</p>
          </div>
        )}
      </div>
    );
  };

  const renderMacroReview = () => {
    if (!demoData?.macro_review) return null;
    const review = demoData.macro_review;

    return (
      <div className="content-card">
        <h2>📋 Automated Game Review Agenda</h2>

        {/* Match Info */}
        <div className="info-box">
          <div className="info-box-grid">
            <div className="info-item">
              <span className="info-label">Tournament</span>
              <div className="info-value">{review.tournament || 'Unknown'}</div>
            </div>
            <div className="info-item">
              <span className="info-label">Match ID</span>
              <div className="info-value">{review.match_id}</div>
            </div>
            {review.teams && (
              <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                <span className="info-label">Teams</span>
                <div className="info-value">{review.teams.join(' vs ')}</div>
              </div>
            )}
          </div>
        </div>

        {/* Agenda Items */}
        <div style={{ marginBottom: '30px' }}>
          <h3>📝 Review Points</h3>
          {review.agenda_items && review.agenda_items.map((item, idx) => (
            <div key={idx} className="agenda-item">
              <div className="agenda-header">
                <div className="agenda-category">{item.category}</div>
                {item.timestamp && (
                  <span className="timestamp-badge">⏰ {item.timestamp}</span>
                )}
              </div>
              
              {item.issue && (
                <div className="alert-box alert-warning" style={{ marginBottom: '10px' }}>
                  <strong>Issue:</strong> {item.issue}
                </div>
              )}
              
              {item.detail && (
                <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                  <strong>Details:</strong> {item.detail}
                </div>
              )}
              
              {item.notes && (
                <div className="alert-box alert-success">
                  <strong>💡 Coach Notes:</strong> {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Summary */}
        {review.ai_summary && (
          <div className="ai-commentary">
            <h4><span>🤖</span> AI Strategic Summary</h4>
            <p>{review.ai_summary}</p>
          </div>
        )}
      </div>
    );
  };

  const renderPrediction = () => {
    if (!demoData?.hypothetical_prediction) return null;
    const prediction = demoData.hypothetical_prediction;

    return (
      <div className="content-card">
        <h2>🔮 Hypothetical Scenario Prediction</h2>

        {/* Scenario */}
        <div className="info-box" style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>❓ Question</h3>
          <p style={{ margin: 0, fontSize: '16px', fontStyle: 'italic' }}>{prediction.scenario}</p>
        </div>

        {/* Game State */}
        {prediction.game_state && Object.keys(prediction.game_state).length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h3>🎮 Game State Analysis</h3>
            <div className="info-box">
              {Object.entries(prediction.game_state).map(([key, value]) => (
                <div key={key} className="info-item" style={{ marginBottom: '8px' }}>
                  <span className="info-label">{key.replace(/_/g, ' ')}</span>
                  <span className="info-value">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Comparison */}
        <div className="comparison-grid">
          {/* Original Action */}
          {(prediction.original_action || prediction.contest_analysis) && (
            <div className="comparison-card comparison-card-bad">
              <h3 style={{ color: 'var(--danger)' }}>
                ❌ {game === 'valorant' ? 'Original Action' : 'Contest Drake'}
              </h3>
              {Object.entries(prediction.original_action || prediction.contest_analysis).map(([key, value]) => (
                <div key={key} className="comparison-item">
                  <div className="comparison-label">{key.replace(/_/g, ' ')}</div>
                  <div className="comparison-value">{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Alternative Action */}
          {(prediction.alternative_action || prediction.concede_analysis) && (
            <div className="comparison-card comparison-card-good">
              <h3 style={{ color: 'var(--success)' }}>
                ✅ {game === 'valorant' ? 'Alternative Action' : 'Concede Drake'}
              </h3>
              {Object.entries(prediction.alternative_action || prediction.concede_analysis).map(([key, value]) => (
                <div key={key} className="comparison-item">
                  <div className="comparison-label">{key.replace(/_/g, ' ')}</div>
                  <div className="comparison-value">
                    {Array.isArray(value) ? (
                      <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        {value.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    ) : value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendation */}
        {prediction.recommendation && (
          <div className="alert-box alert-info" style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>
              🎯 Strategic Recommendation
            </h4>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
              {prediction.recommendation}
            </p>
            <div style={{ 
              marginTop: '15px',
              padding: '10px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Confidence Level: <span style={{ color: prediction.confidence === 'high' ? 'var(--success)' : 'var(--warning)' }}>
                {prediction.confidence?.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {prediction.ai_analysis && (
          <div className="ai-commentary">
            <h4><span>🤖</span> AI Strategic Context</h4>
            <p>{prediction.ai_analysis}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="assistant-coach-container">
      <header className="coach-header">
        <h1>🏆 Cloud9 Assistant Coach</h1>
        <p className="subtitle">
          Comprehensive AI-powered coaching platform demonstrating all three core capabilities: 
          Personalized Insights, Macro Review Generation, and Hypothetical Scenario Prediction
        </p>
      </header>

      {/* Main Demo Buttons */}
      <div className="demo-buttons-grid">
        <div className="demo-button-card">
          <h3>📊 Personalized Player Insights</h3>
          <p>Analyze individual player performance with data-backed feedback and impact analysis</p>
          <button onClick={fetchPersonalizedInsights} disabled={loading}>
            {loading ? 'Loading...' : 'Run Analysis'}
          </button>
        </div>

        <div className="demo-button-card">
          <h3>📋 Automated Macro Review</h3>
          <p>Generate critical decision points and strategic moments from match data</p>
          <button onClick={fetchMacroReview} disabled={loading}>
            {loading ? 'Loading...' : 'Generate Review'}
          </button>
        </div>

        <div className="demo-button-card">
          <h3>🔮 Hypothetical Prediction</h3>
          <p>"What if" analysis using historical data and game state modeling</p>
          <button onClick={fetchPrediction} disabled={loading}>
            {loading ? 'Loading...' : 'Run Prediction'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}

      {/* Results Display */}
      <div>
        {activeDemo === 'insights' && renderInsights()}
        {activeDemo === 'review' && renderMacroReview()}
        {activeDemo === 'prediction' && renderPrediction()}
      </div>

      {!activeDemo && !loading && (
        <div className="content-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
          <h3 style={{ marginBottom: '15px' }}>Get Started</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Click any of the three buttons above to see the Assistant Coach in action. 
            Each button demonstrates one of the core capabilities with real match data analysis.
          </p>
        </div>
      )}
    </div>
  );
}

export default AssistantCoach;

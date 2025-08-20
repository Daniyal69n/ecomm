import React, { useState, useEffect } from 'react';
import { checkServerHealth } from '../services/errorHandler';

const MongoDBTroubleshooter = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const healthStatus = await checkServerHealth();
      setHealth(healthStatus);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({
        status: 'Server not reachable',
        database: { status: 'unknown' },
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="card border-info">
        <div className="card-body text-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Checking...</span>
          </div>
          <p className="mt-2 mb-0">Checking server status...</p>
        </div>
      </div>
    );
  }

  const isDbConnected = health?.database?.status === 'connected';
  const isServerReachable = health?.status !== 'Server not reachable';

  return (
    <div className={`card border-${isDbConnected ? 'success' : 'warning'} mb-3`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          {isDbConnected ? '🟢' : '⚠️'} Database Connection Status
        </h6>
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={checkHealth}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Server Status:</h6>
            <p className={`badge ${isServerReachable ? 'bg-success' : 'bg-danger'}`}>
              {health?.status || 'Unknown'}
            </p>
            {health?.port && (
              <p className="small text-muted">Running on port {health.port}</p>
            )}
          </div>
          <div className="col-md-6">
            <h6>Database Status:</h6>
            <p className={`badge ${isDbConnected ? 'bg-success' : 'bg-warning text-dark'}`}>
              {health?.database?.status || 'Unknown'}
            </p>
            {health?.database?.host && (
              <p className="small text-muted">Host: {health.database.host}</p>
            )}
          </div>
        </div>

        {!isDbConnected && isServerReachable && (
          <div className="alert alert-warning mt-3">
            <h6>⚠️ MongoDB Atlas Connection Failed</h6>
            <p className="mb-2">{health?.database?.message}</p>
            
            <h6>🔧 Troubleshooting Steps:</h6>
            <ol className="mb-3">
              <li><strong>Check your internet connection</strong> - Try browsing to other websites</li>
              <li><strong>Use mobile hotspot</strong> - Switch to mobile data temporarily</li>
              <li><strong>Change DNS settings:</strong>
                <ul>
                  <li>Primary: 8.8.8.8</li>
                  <li>Secondary: 8.8.4.4</li>
                </ul>
              </li>
              <li><strong>Check firewall/antivirus</strong> - Temporarily disable to test</li>
              <li><strong>Try VPN connection</strong> - Some ISPs block MongoDB Atlas</li>
              <li><strong>Wait and retry</strong> - Network issues often resolve themselves</li>
            </ol>

            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-primary"
                onClick={checkHealth}
              >
                Test Connection
              </button>
              <a 
                href="https://cloud.mongodb.com/v2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                Open MongoDB Atlas
              </a>
            </div>
          </div>
        )}

        {!isServerReachable && (
          <div className="alert alert-danger mt-3">
            <h6>❌ Server Not Reachable</h6>
            <p>The backend server is not responding. Please check:</p>
            <ul>
              <li>Server is running on port 5001</li>
              <li>No firewall blocking localhost connections</li>
              <li>Backend dependencies are installed</li>
            </ul>
          </div>
        )}

        <div className="mt-3">
          <small className="text-muted">
            Last checked: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Never'}
          </small>
        </div>
      </div>
    </div>
  );
};

export default MongoDBTroubleshooter;

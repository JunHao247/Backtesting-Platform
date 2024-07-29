import React from 'react';
import './css/Analysis.css';

const Analysis = ({ metrics }) => {
  if (!metrics) {
    return <div>No data to display. Please run a backtest first.</div>;
  }

  return (
    <div className="analysis">
      <h2>Backtest Analysis</h2>
      <div className="metrics">
        <h3>Metrics</h3>
        <ul>
          <li>Cumulative Returns: {(metrics.cumulative_returns * 100).toFixed(2)}%</li>
          <li>Average Daily Returns: {(metrics.avg_daily_returns * 100).toFixed(2)}%</li>
          <li>Volatility: {(metrics.volatility * 100).toFixed(2)}%</li>
          <li>Sharpe Ratio: {metrics.sharpe_ratio.toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );
};

export default Analysis;

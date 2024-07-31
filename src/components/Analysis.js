import React from 'react';
import './css/Analysis.css';

const Analysis = ({ metrics }) => {
    if (!metrics) {
    return <div>No data to display. Please run a backtest first.</div>;
  }
  return (
    <div className="analysis">
      <h2>Analysis</h2>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cumulative Returns</td>
            <td>{metrics.cumulative_returns.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Annualized Volatility</td>
            <td>{metrics.annualized_volatility.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Sharpe Ratio</td>
            <td>{metrics.sharpe_ratio.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Max Drawdown</td>
            <td>{metrics.max_drawdown.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Sortino Ratio</td>
            <td>{metrics.sortino_ratio.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Analysis;

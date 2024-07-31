import React from 'react';
import './css/Analysis.css';

const Analysis = ({ metrics }) => {
  if (!metrics) {
    return <div className="no-data-message">No data to display. Please run a backtest first.</div>;
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
      <div className="metric-descriptions">
        <h3>Metric Descriptions</h3>
        <ul>
          <li>
            <strong>Cumulative Returns:</strong> The total return on an investment over a set period of time.
          </li>
          <li>
            <strong>Annualized Volatility:</strong> A measure of the dispersion of returns for a given security or market index, typically expressed as a percentage.
          </li>
          <li>
            <strong>Sharpe Ratio:</strong> A measure of risk-adjusted return, calculated by dividing the portfolio's excess return by its standard deviation.
          </li>
          <li>
            <strong>Max Drawdown:</strong> The maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained.
          </li>
          <li>
            <strong>Sortino Ratio:</strong> A variation of the Sharpe ratio that differentiates harmful volatility from total overall volatility by using the asset's standard deviation of negative asset returns.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Analysis;

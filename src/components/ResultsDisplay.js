import React from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ResultsDisplay = ({ results }) => {
  const formatDate = (timestamp) => moment(timestamp).format('MMM DD, YYYY');

  const hasShortMavg = results && results.some(result => 'short_mavg' in result);
  const hasLongMavg = results && results.some(result => 'long_mavg' in result);

  const priceChartData = results ? {
    labels: results.map(result => formatDate(result.timestamp)),
    datasets: [
      {
        label: 'Close Price',
        data: results.map(result => result.close),
        borderColor: '#02FFC7',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 2,
        fill: false,
        pointRadius: 1,
      },
      ...(hasShortMavg ? [{
        label: 'Short Moving Average',
        data: results.map(result => result.short_mavg),
        borderColor: '#FF1493', // Deep pink
        backgroundColor: 'rgba(255, 20, 147, 0.2)',
        borderWidth: 2,
        fill: false,
        pointRadius: 0, // Remove points for moving average
      }] : []),
      ...(hasLongMavg ? [{
        label: 'Long Moving Average',
        data: results.map(result => result.long_mavg),
        borderColor: '#1E90FF', // Dodger blue
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        borderWidth: 2,
        fill: false,
        pointRadius: 0, // Remove points for moving average
      }] : []),
      {
        label: 'Buy Signal',
        data: results.map(result => (result.positions === 1 ? result.close : null)),
        borderColor: '#00FF00', // Bright green
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        borderWidth: 0,
        fill: false,
        pointRadius: results.map(result => (result.positions === 1 ? 6 : 0)),
        pointBorderWidth: results.map(result => (result.positions === 1 ? 3 : 0)),
        pointStyle: 'triangle',
      },
      {
        label: 'Sell Signal',
        data: results.map(result => (result.positions === -1 ? result.close : null)),
        borderColor: '#FF0000', // Bright red
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderWidth: 0,
        fill: false,
        pointRadius: results.map(result => (result.positions === -1 ? 6 : 0)),
        pointBorderWidth: results.map(result => (result.positions === -1 ? 3 : 0)),
        pointStyle: 'triangle',
        rotation: 180,
      },
    ],
  } : null;

  const portfolioChartData = results ? {
    labels: results.map(result => formatDate(result.timestamp)),
    datasets: [
      {
        label: 'Portfolio Value',
        data: results.map(result => result.portfolio_value),
        borderColor: '#9370DB', // Medium purple
        backgroundColor: 'rgba(147, 112, 219, 0.2)',
        borderWidth: 2,
        fill: false,
        pointRadius: 2,
      },
      {
        label: 'Buy and Hold Value',
        data: results.map((result, index) => result.close * (results[0].portfolio_value / results[0].close)),
        borderColor: '#FFD700', // Gold
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderWidth: 2,
        fill: false,
        pointRadius: 2,
      }
    ],
  } : null;

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white', // Change legend text color
          font: {
            size: 14, // Change legend font size
          },
        },
      },

      tooltip: {
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Change x-axis text color
          font: {
            size: 12, // Change x-axis font size
          },
        },
      },
      y: {
        ticks: {
          color: 'white', // Change y-axis text color
          font: {
            size: 12, // Change y-axis font size
          },
        },
      },
    },
  };

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="results-section">
      <div className="chart-container">
        <h2 style={{ color: 'cyan' }}>Buy/Sell Signal Graph</h2>
        <Line data={priceChartData} options={chartOptions} />
      </div>
      <div className="chart-container">
        <h2 style={{ color: 'cyan' }}>Portfolio Graph</h2>
        <Line data={portfolioChartData} options={chartOptions} />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
              {hasShortMavg && <th>Short MAvg</th>}
              {hasLongMavg && <th>Long MAvg</th>}
              <th>Quote Asset Volume</th>
              <th>Signal</th>
              <th>Positions</th>
              <th>Portfolio Value</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{formatDate(result.timestamp)}</td>
                <td>{Math.round(result.open)}</td>
                <td>{Math.round(result.high)}</td>
                <td>{Math.round(result.low)}</td>
                <td>{Math.round(result.close)}</td>
                <td>{Math.round(result.volume)}</td>
                {hasShortMavg && <td>{Math.round(result.short_mavg)}</td>}
                {hasLongMavg && <td>{Math.round(result.long_mavg)}</td>}
                <td>{Math.round(result.quoteAssetVolume)}</td>
                <td>{result.signal}</td>
                <td>{result.positions}</td>
                <td>{Math.round(result.portfolio_value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsDisplay;

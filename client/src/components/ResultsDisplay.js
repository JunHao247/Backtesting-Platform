import React from 'react';
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
  // Case 1: No `results` prop provided or `results` is null or undefined
  if (results === null || results === undefined) {
    return ;
  }

  // Case 2: `results` is an empty array
  if (results.length === 0) {
    return <div>No results to display</div>;
  }

  // Case 3: `results` is not an array (unexpected data type)
  if (!Array.isArray(results)) {
    console.error('Invalid data format: `results` should be an array');
    return <div>Error: Invalid data format</div>;
  }

  // Function to format timestamp to month-day format
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
  };

  // Prepare data for the price and moving averages chart
  const priceChartData = {
    labels: results.map(result => formatDate(result.timestamp)),
    datasets: [
      {
        label: 'Close Price',
        data: results.map(result => result.close),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Short Moving Average',
        data: results.map(result => result.short_mavg),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'Long Moving Average',
        data: results.map(result => result.long_mavg),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
      {
        label: 'Buy Signal',
        data: results.map(result => (result.positions === 1 ? result.close : null)),
        borderColor: 'rgba(0, 200, 0, 1)', // Adjusted color to a bolder green
        backgroundColor: 'rgba(0, 200, 0, 0.5)',
        fill: false,
        pointRadius: results.map(result => (result.positions === 1 ? 8 : 0)),
        pointBorderWidth: results.map(result => (result.positions === 1 ? 3 : 0)),
        pointStyle: 'triangle',
      },
      {
        label: 'Sell Signal',
        data: results.map(result => (result.positions === -1 ? result.close : null)),
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        fill: false,
        pointRadius: results.map(result => (result.positions === -1 ? 8 : 0)),
        pointBorderWidth: results.map(result => (result.positions === -1 ? 3 : 0)),
        pointStyle: 'rectRot',
      },
    ],
  };

  // Prepare data for the portfolio value chart
  const portfolioChartData = {
    labels: results.map(result => formatDate(result.timestamp)),
    datasets: [
      {
        label: 'Portfolio Value',
        data: results.map(result => result.portfolio_value),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Backtest Results</h2>
      <Line data={priceChartData} />

      <h2>Portfolio Value</h2>
      <Line data={portfolioChartData} />

      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
            <th>Signal</th>
            <th>Positions</th>
            <th>Portfolio Value</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{formatDate(result.timestamp)}</td>
              <td>{result.open}</td>
              <td>{result.high}</td>
              <td>{result.low}</td>
              <td>{result.close}</td>
              <td>{result.volume}</td>
              <td>{result.signal}</td>
              <td>{result.positions}</td>
              <td>{result.portfolio_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsDisplay;

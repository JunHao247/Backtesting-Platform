import React, { useState } from 'react';
import axios from 'axios';
import ResultsDisplay from './ResultsDisplay';

// Define a default strategy
const defaultStrategy = `
def strategy(data):
    short_window = 5
    long_window = 20
    data['short_mavg'] = data['close'].rolling(window=short_window, min_periods=1).mean()
    data['long_mavg'] = data['close'].rolling(window=long_window, min_periods=1).mean()
    data['signal'] = 0
    data.loc[short_window:, 'signal'] = np.where(data.loc[short_window:, 'short_mavg'] > data.loc[short_window:, 'long_mavg'], 1, 0)
    data['positions'] = data['signal'].diff()
    return data
`;

const BacktestForm = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [startDate, setStartDate] = useState('2024-07-01');
  const [endDate, setEndDate] = useState('2024-07-15');
  const [strategy, setStrategy] = useState(defaultStrategy);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/backtest', {
        symbol,
        startDate,
        endDate,
        strategy,
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to run backtest');
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Symbol:
          <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </label>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Strategy:
          <textarea value={strategy} onChange={(e) => setStrategy(e.target.value)} />
        </label>
        <button type="submit">Run Backtest</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default BacktestForm;

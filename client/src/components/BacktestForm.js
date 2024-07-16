import React, { useState } from 'react';
import axios from 'axios';
import ResultsDisplay from './ResultsDisplay';
import TickerSelector from './TickerSelector';
import DateRangePicker from './DateRangePicker';
import StrategyEditor from './StrategyEditor';

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
  const [initialCash, setInitialCash] = useState(10000);
  const [strategy, setStrategy] = useState(defaultStrategy);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const checkSymbolValidity = async (symbol) => {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/exchangeInfo?symbol=${symbol}`);
      return response.status === 200;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be greater than end date');
      return;
    }

    if (initialCash <= 0) {
      setError('Initial cash must be greater than 0');
      return;
    }

    const isSymbolValid = await checkSymbolValidity(symbol);
    if (!isSymbolValid) {
      setError('The symbol is incorrect or does not exist');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/backtest', {
        symbol,
        startDate,
        endDate,
        initialCash,
        strategy,
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to run backtest');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f8f8', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>Crypto Backtesting Platform</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>
          Cryptocurrency Ticker:
          <TickerSelector onTickerChange={setSymbol} />
        </label>
        <label>
          Start Date:
          <DateRangePicker onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
        </label>
        <label>
          Initial Cash:
          <input type="number" value={initialCash} onChange={(e) => setInitialCash(parseFloat(e.target.value))} />
        </label>
        <label>
          Python Code:
          <StrategyEditor onStrategyChange={setStrategy} presetStrategy={defaultStrategy} /> {/* Pass preset strategy */}
        </label>
        <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Run Backtest</button>
      </form>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default BacktestForm;

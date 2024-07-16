import React, { useState } from 'react';
import axios from 'axios';
import TickerSelector from './TickerSelector';
import DateRangePicker from './DateRangePicker';
import StrategyEditor from './StrategyEditor';

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

const BacktestForm = ({ onResults }) => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [initialCash, setInitialCash] = useState(10000);
  const [strategy, setStrategy] = useState(defaultStrategy);
  const [error, setError] = useState(null);

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

    try {
      const response = await axios.post('http://localhost:3000/api/backtest', {
        symbol,
        startDate,
        endDate,
        initialCash,
        strategy,
      });
      onResults(response.data);
    } catch (err) {
      setError('Failed to run backtest');
      console.error(err);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="leftContainer">
          <label>
            Cryptocurrency Ticker:
            <TickerSelector onTickerChange={setSymbol} />
          </label>
          <label>
            Date Range:
            <DateRangePicker onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
          </label>
          <label>
            Initial Cash:
            <input type="number" value={initialCash} onChange={(e) => setInitialCash(parseFloat(e.target.value))} />
          </label>
        </div>
        <div className="rightContainer">
          <label>
            Python Code:
            <StrategyEditor onStrategyChange={setStrategy} presetStrategy={defaultStrategy} />
          </label>
          <button type="submit">Run Backtest</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default BacktestForm;

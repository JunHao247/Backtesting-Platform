import React, { useState } from 'react';
import axios from 'axios';
import TickerSelector from './TickerSelector';
import DateRangePicker from './DateRangePicker';
import StrategyEditor from './StrategyEditor';

const defaultStrategies = {
  'Moving Average Crossover': `
def strategy(data):
    short_window = 5
    long_window = 20
    data['short_mavg'] = data['close'].rolling(window=short_window, min_periods=1).mean()
    data['long_mavg'] = data['close'].rolling(window=long_window, min_periods=1).mean()
    data['signal'] = 0
    data.loc[short_window:, 'signal'] = np.where(data.loc[short_window:, 'short_mavg'] > data.loc[short_window:, 'long_mavg'], 1, 0)
    data['positions'] = data['signal'].diff()
    return data
  `,
  'Momentum Strategy': `
def strategy(data, window=20):
    data = data.copy()  # Make a copy of the DataFrame
    data['momentum'] = data['close'].diff(window)
    data['signal'] = 0
    data.loc[window:, 'signal'] = np.where(data['momentum'][window:] > 0, 1, 0)
    data['positions'] = data['signal'].diff()
    return data
  `,
  'Breakout Strategy': `
def strategy(data, window=20):
    data = data.copy()  # Make a copy of the DataFrame
    data['rolling_max'] = data['high'].rolling(window=window).max()
    data['rolling_min'] = data['low'].rolling(window=window).min()
    data['signal'] = 0
    data['signal'] = np.where(data['close'] > data['rolling_max'].shift(1), 1, data['signal'])
    data['signal'] = np.where(data['close'] < data['rolling_min'].shift(1), -1, data['signal'])
    data['positions'] = data['signal'].diff()
    return data
  `,
  'Custom Strategy': '', 
  'AI-Based Strategy': 'ai',
  'Custom AI Strategy': 'custom_ai',
};

const BacktestForm = ({ onResults }) => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [initialCash, setInitialCash] = useState(10000);
  const [selectedStrategy, setSelectedStrategy] = useState(Object.keys(defaultStrategies)[0]);
  const [strategy, setStrategy] = useState(defaultStrategies[selectedStrategy]);
  const [modelFile, setModelFile] = useState(null);
  const [trainingScript, setTrainingScript] = useState(null);
  const [error, setError] = useState(null);
  const [sessionId] = useState(`session-${Date.now()}`);


  const handleStrategyChange = (e) => {
    const newStrategy = e.target.value;
    setSelectedStrategy(newStrategy);
    setStrategy(defaultStrategies[newStrategy]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === 'modelFile') {
      setModelFile(file);
    } else if (e.target.name === 'trainingScript') {
      setTrainingScript(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be greater than end date');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (selectedStrategy === 'AI-Based Strategy' && diffDays < 30) {
      setError('AI-Based Strategy requires at least 30 days of data');
      return;
    }

    if (initialCash <= 0) {
      setError('Initial cash must be greater than 0');
      return;
    }

    const formData = new FormData();
    formData.append('symbol', symbol);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('initialCash', initialCash);
    formData.append('strategy', strategy);
    formData.append('sessionId', sessionId);


    if (selectedStrategy === 'Custom AI Strategy') {
      if (!modelFile || !trainingScript) {
        setError('Please upload both model and training script files for Custom AI Strategy');
        return;
      }
      formData.append('modelFile', modelFile);
      formData.append('trainingScript', trainingScript);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/backtest', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onResults(response.data);
    } catch (err) {
      setError('Failed to run backtest');
      console.error(err);
    }
  };

  const setCustomStrategy = (newStrategyCode) => {
    if (['Moving Average Crossover', 'Momentum Strategy', 'Breakout Strategy'].includes(selectedStrategy)) {
      setSelectedStrategy('Custom Strategy');
    }
    setStrategy(newStrategyCode);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="leftContainer">
          <label>
            Cryptocurrency Ticker:
            <TickerSelector value={symbol} onTickerChange={setSymbol} />
          </label>
          <label>
            Date Range:
            <DateRangePicker onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
          </label>
          <label>
            Initial Cash:
            <input type="number" value={initialCash} onChange={(e) => setInitialCash(parseFloat(e.target.value))} />
          </label>
          <label>
            Strategy:
            <select value={selectedStrategy} onChange={handleStrategyChange}>
              {Object.keys(defaultStrategies).map((strat) => (
                <option key={strat} value={strat}>
                  {strat}
                </option>
              ))}
            </select>
          </label>
          {selectedStrategy === 'Custom AI Strategy' && (
            <div>
              <label>
                Model File:
                <input type="file" name="modelFile" onChange={handleFileChange} />
              </label>
              <label>
                Training Script:
                <input type="file" name="trainingScript" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </div>
        <div className="rightContainer">
          <label>
            Python Code:
            <StrategyEditor onStrategyChange={setStrategy} presetStrategy={strategy} setCustomStrategy={setCustomStrategy}/>
          </label>
          <button type="submit">Run Backtest</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default BacktestForm;

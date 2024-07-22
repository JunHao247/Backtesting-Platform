import React from 'react';

const Documentation = () => {
  return (
    <div className="documentation">
      <h2>Documentation</h2>
      <p>Welcome to the Crypto Backtesting Platform documentation. Here you can find information on how to use the platform, create strategies, and interpret results.</p>
      <br></br>
      <h3>Creating Strategies</h3>
      <p>To create a strategy, you need to define a function named <code>strategy</code> that takes a DataFrame as input and returns a DataFrame with buy/sell signals.</p>
      <pre>
        {`
def strategy(data):
    short_window = 5
    long_window = 20
    data['short_mavg'] = data['close'].rolling(window=short_window, min_periods=1).mean()
    data['long_mavg'] = data['close'].rolling(window=long_window, min_periods=1).mean()
    data['signal'] = 0
    data.loc[short_window:, 'signal'] = np.where(data.loc[short_window:, 'short_mavg'] > data.loc[short_window:, 'long_mavg'], 1, 0)
    data['positions'] = data['signal'].diff()
    return data
        `}
      </pre>
      <h3>Interpreting Results</h3>
      <br></br>
      <p>The results of the backtest will show the buy/sell signals along with the portfolio value over time. You can use this information to evaluate the performance of your strategy.</p>
    </div>
  );
};

export default Documentation;

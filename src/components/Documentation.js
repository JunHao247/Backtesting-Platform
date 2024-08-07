import React from 'react';
import './css/Documentation.css';

const Documentation = () => {
  return (
    <div className="documentation">
      <h2>Documentation</h2>
      
      <section>
        <h3>Database Schema</h3>
        <p>The parameters listed below can be retrieved and edited in the trading strategy under the <b>"Backtest"</b> tab:</p>
        <div className="database-schema">
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>timestamp</td>
                <td>The timestamp of the kline/candlestick.</td>
              </tr>
              <tr>
                <td>open</td>
                <td>Opening price during the kline interval.</td>
              </tr>
              <tr>
                <td>high</td>
                <td>Highest price during the kline interval.</td>
              </tr>
              <tr>
                <td>low</td>
                <td>Lowest price during the kline interval.</td>
              </tr>
              <tr>
                <td>close</td>
                <td>Closing price during the kline interval.</td>
              </tr>
              <tr>
                <td>volume</td>
                <td>Trading volume during the kline interval.</td>
              </tr>
              <tr>
                <td>quoteAssetVolume</td>
                <td>Volume of the quote asset traded.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      
      <section>
        <h3>Creating Strategies</h3>
        <p>To create a strategy, define a function named <code>strategy</code> that takes a DataFrame as input and returns a DataFrame with buy/sell signals.</p>
        <p>Below is an example of a Double Moving Average Crossover strategy:</p>
        <pre>
          <code>
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
          </code>
        </pre>
      </section>

      <section>
        <h3>Uploading Custom AI Trained Model</h3>
        <p>To upload a custom AI trained model, write the training model in Python and save it as a <b>".py"</b> file. Additionally, generate a <b>".pkl"</b> file from the training model.</p>
        <p>Below is an example of how to train a machine learning model using historical data and generate the pkl file:</p>
        <pre>
          <code>
{`
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load historical data
historical_data = pd.read_csv('historical_data.csv')

# Preprocess data
historical_data['momentum'] = historical_data['close'].diff(20)
historical_data.dropna(inplace=True)

# Features and target
X = historical_data[['close', 'momentum']]
y = np.where(historical_data['momentum'] > 0, 1, 0)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train RandomForest model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save the trained model
joblib.dump(rf_model, 'testing_modelFile.pkl')

print('Model training complete and saved')
`}
          </code>
        </pre>
        <p>** Note: <code>joblib.dump</code> generates the <code>testing_modelFile.pkl</code>. There is no specific naming convention required for the pkl file.</p>
      </section>

      <section>
        <h3>Real-Time Order Book</h3>
        <p>The real-time order book allows you to view the current market depth for a given cryptocurrency ticker. It includes the following features:</p>
        <ul>
          <li>Real-time bids and asks with their respective prices and volumes.</li>
          <li>Liquidity information including total bid volume, total ask volume, spread, average bid price, average ask price, and liquidity ratio.</li>
          <li>Historical data for the last 24 hours to compare with the current market conditions.</li>
        </ul>
        <h4>Insights</h4>
        <ul>
          <li><b>Total Bid Volume:</b> Sum of all bid volumes.</li>
          <li><b>Total Ask Volume:</b> Sum of all ask volumes.</li>
          <li><b>Spread:</b> Difference between the highest bid price and the lowest ask price.</li>
          <li><b>Average Bid Price:</b> Weighted average price of all bids.</li>
          <li><b>Average Ask Price:</b> Weighted average price of all asks.</li>
          <li><b>Liquidity Ratio:</b> Ratio of total bid volume to total ask volume.</li>
        </ul>
      </section>

      <section>
        <h3>Analysis</h3>
        <p>Run a backtest to generate additional metrics. The metrics available are:</p>
        <ul>
          <li><b>Cumulative Returns:</b> The total return on an investment over a set period of time.</li>
          <li><b>Annualized Volatility:</b> A measure of the dispersion of returns for a given security or market index, typically expressed as a percentage.</li>
          <li><b>Sharpe Ratio:</b> A measure of risk-adjusted return, calculated by dividing the portfolio's excess return by its standard deviation.</li>
          <li><b>Max Drawdown:</b> The maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained.</li>
          <li><b>Sortino Ratio:</b> A variation of the Sharpe ratio that differentiates harmful volatility from total overall volatility by using the asset's standard deviation of negative asset returns.</li>
        </ul>
      </section>
    </div>
  );
};

export default Documentation;

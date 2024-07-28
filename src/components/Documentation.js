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
        <code>
{`def strategy(data):
    short_window = 5
    long_window = 20
    data['short_mavg'] = data['close'].rolling(window=short_window, min_periods=1).mean()
    data['long_mavg'] = data['close'].rolling(window=long_window, min_periods=1).mean()
    data['signal'] = 0
    data.loc[short_window:, 'signal'] = np.where(data.loc[short_window:, 'short_mavg'] > data.loc[short_window:, 'long_mavg'], 1, 0)
    data['positions'] = data['signal'].diff()
    return data`}
        </code>
      </pre>

      <h3>Training Model Example</h3>
      <p>Below is an example of how to train a machine learning model using historical data:</p>
      <pre>
        <code>
{`import pandas as pd
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

# Evaluate the model
rf_accuracy = accuracy_score(y_test, rf_model.predict(X_test))

# Save the trained model
joblib.dump(rf_model, 'testing_modelFile.pkl')

print(f'Model training complete and saved with accuracy: {rf_accuracy}')`}
        </code>
      </pre>

      <h3>Interpreting Results</h3>
      <p>The results of the backtest will show the buy/sell signals along with the portfolio value over time. You can use this information to evaluate the performance of your strategy.</p>
    </div>
  );
};

export default Documentation;

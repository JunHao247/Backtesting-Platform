import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import joblib
import os
import requests

def fetch_historical_data(symbol, start, end):
    base_url = 'https://api.binance.com/api/v3/klines'
    params = {
        'symbol': symbol,
        'interval': '1d',
        'startTime': start,
        'endTime': end
    }
    response = requests.get(base_url, params=params)
    data = response.json()
    df = pd.DataFrame(data, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume', 'close_time', 'quote_asset_volume', 'number_of_trades', 'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    df.set_index('timestamp', inplace=True)
    df = df[['open', 'high', 'low', 'close', 'volume']].astype(float)
    return df

def train_model(data, symbol):
    data['momentum'] = data['close'].diff(20)
    data.loc[:, 'signal'] = np.where(data['momentum'] > 0, 1, 0)
    data = data.dropna()

    X = data[['close', 'momentum']]
    y = data['signal']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_accuracy = accuracy_score(y_test, rf_model.predict(X_test))

    svm_model = SVC()
    svm_model.fit(X_train, y_train)
    svm_accuracy = accuracy_score(y_test, svm_model.predict(X_test))

    model_dir = 'models'
    os.makedirs(model_dir, exist_ok=True)
    
    joblib.dump(rf_model, f'{model_dir}/rf_model_{symbol}.pkl')
    joblib.dump(svm_model, f'{model_dir}/svm_model_{symbol}.pkl')

    print(f'{symbol} - Random Forest Accuracy: {rf_accuracy}')
    print(f'{symbol} - SVM Accuracy: {svm_accuracy}')

if __name__ == "__main__":
    symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']  # Add more symbols as needed
    start = '1483228800000'  # Example start timestamp for 2017-01-01
    end = '1704067199000'    # Example end timestamp for 2024-01-01

    for symbol in symbols:
        historical_data = fetch_historical_data(symbol, start, end)
        train_model(historical_data, symbol)

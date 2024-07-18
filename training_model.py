import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import joblib
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

def train_initial_model(data):
    data['momentum'] = data['close'].diff(20)
    data = data.dropna().copy()  # Use .copy() to avoid SettingWithCopyWarning
    data.loc[:, 'signal'] = np.where(data['momentum'] > 0, 1, 0)
    
    X = data[['close', 'momentum']]
    y = data['signal']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Random Forest Classifier
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_y_pred = rf_model.predict(X_test)
    print(f'Random Forest Accuracy: {accuracy_score(y_test, rf_y_pred)}')
    joblib.dump(rf_model, 'rf_training_model.pkl')

    # Support Vector Machine Classifier
    svm_model = SVC(kernel='linear', probability=True)
    svm_model.fit(X_train, y_train)
    svm_y_pred = svm_model.predict(X_test)
    print(f'SVM Accuracy: {accuracy_score(y_test, svm_y_pred)}')
    joblib.dump(svm_model, 'svm_training_model.pkl')

if __name__ == "__main__":
    symbol = 'BTCUSDT'
    start = '1262304000000'  # Start timestamp for 2010
    end = '1711929600000'  # End timestamp for 2024
    historical_data = fetch_historical_data(symbol, start, end)
    train_initial_model(historical_data)

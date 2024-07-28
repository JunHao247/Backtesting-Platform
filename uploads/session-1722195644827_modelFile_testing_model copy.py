import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def prepare_data(data):
    data['momentum'] = data['close'].diff(20)
    data.dropna(inplace=True)
    return data

def train_model(data, model_file):
    X = data[['close', 'momentum']]
    y = np.where(data['momentum'] > 0, 1, 0)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    joblib.dump(rf_model, model_file)
    print('Model training complete and saved')

def main():
    data = pd.read_csv('historical_data.csv')
    data = prepare_data(data)
    model_file = 'testing_modelFile.pkl'
    train_model(data, model_file)

if __name__ == "__main__":
    main()

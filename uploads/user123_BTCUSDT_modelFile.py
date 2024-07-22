import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
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
joblib.dump(rf_model, 'user123_BTCUSDT_modelFile.pkl')  # Replace 'user123' and 'BTCUSDT' with actual userId and symbol

print('Model training complete and saved')

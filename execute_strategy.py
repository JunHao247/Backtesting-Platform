import sys
import json
import pandas as pd
import numpy as np
import joblib
import os

def run_user_strategy(data, strategy_code):
    env = {'pd': pd, 'np': np}
    exec(strategy_code, env)
    strategy = env['strategy']
    return strategy(data)

def calculate_portfolio_value(data, initial_cash):
    cash = initial_cash
    holdings = 0
    portfolio_values = []
    for index, row in data.iterrows():
        if row['positions'] == 1:
            if cash > 0:
                holdings = cash / row['close']
                cash = 0
        elif row['positions'] == -1:
            if holdings > 0:
                cash = holdings * row['close']
                holdings = 0
        portfolio_value = cash + holdings * row['close']
        portfolio_values.append(portfolio_value)
    data.loc[:, 'portfolio_value'] = portfolio_values
    return data

def apply_ai_strategy(data, symbol):
    model_dir = 'models'
    rf_model_path = f'{model_dir}/rf_model_{symbol}.pkl'
    svm_model_path = f'{model_dir}/svm_model_{symbol}.pkl'

    if not os.path.exists(rf_model_path) or not os.path.exists(svm_model_path):
        raise ValueError(f"Model files for {symbol} do not exist")

    rf_model = joblib.load(rf_model_path)
    svm_model = joblib.load(svm_model_path)

    data['momentum'] = data['close'].diff(20)
    data = data.dropna().copy()

    if data.shape[0] == 0:
        raise ValueError("Insufficient data after processing for AI strategy.")

    X = data[['close', 'momentum']]
    rf_predictions = rf_model.predict(X)
    svm_predictions = svm_model.predict(X)

    # Combine predictions (here simply averaging, but you can use other methods)
    combined_predictions = (rf_predictions + svm_predictions) / 2
    data.loc[:, 'signal'] = np.where(combined_predictions > 0.5, 1, 0)
    data.loc[:, 'positions'] = data['signal'].diff()
    return data

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        data = pd.DataFrame(input_data['data'])
        strategy_code = input_data['strategy']
        initial_cash = float(input_data.get('initialCash'))
        symbol = input_data['symbol']

        if strategy_code == 'ai':
            result = apply_ai_strategy(data, symbol)
        else:
            result = run_user_strategy(data, strategy_code)

        result = calculate_portfolio_value(result, initial_cash)
        result = result.replace({np.nan: None})
        result_dict = result.to_dict(orient='records')
        for row in result_dict:
            if isinstance(row['timestamp'], pd.Timestamp):
                row['timestamp'] = row['timestamp'].isoformat()
        output = json.dumps(result_dict)
        print(output)
    except Exception as e:
        error_message = f"Error: {str(e)}"
        print(json.dumps({"error": error_message}), file=sys.stderr)
        sys.exit(1)

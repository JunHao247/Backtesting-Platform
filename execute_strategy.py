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

def calculate_buy_and_hold(data, initial_cash):
    buy_price = data.iloc[0]['close']
    holdings = initial_cash / buy_price
    data['buy_and_hold_value'] = data['close'] * holdings
    return data

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


def calculate_metrics(data):
    metrics = {}
    metrics['cumulative_returns'] = data['portfolio_value'].iloc[-1] / data['portfolio_value'].iloc[0] - 1
    metrics['annualized_volatility'] = data['portfolio_value'].pct_change().std() * np.sqrt(252)
    metrics['sharpe_ratio'] = metrics['cumulative_returns'] / metrics['annualized_volatility']
    metrics['max_drawdown'] = ((data['portfolio_value'].cummax() - data['portfolio_value']) / data['portfolio_value'].cummax()).max()
    metrics['sortino_ratio'] = metrics['cumulative_returns'] / data['portfolio_value'].pct_change().clip(upper=0).std()
    return metrics

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        data = pd.DataFrame(input_data['data'])
        strategy_code = input_data['strategy']
        initial_cash = float(input_data.get('initialCash'))
        symbol = input_data['symbol']
        model_file = input_data.get('modelFile')
        training_script = input_data.get('trainingScript')

        # Ensure no column has 'undefined' values
        data = data.replace({None: np.nan, 'undefined': np.nan})
        data = data.fillna(0)

        if strategy_code == 'ai':
            result = apply_ai_strategy(data, symbol)
        elif strategy_code == 'custom_ai':
            if not model_file or not training_script:
                raise ValueError("Both model file and training script are required for custom AI strategy")
            result = apply_custom_ai_strategy(data, model_file, strategy_code)
        else:
            result = run_user_strategy(data, strategy_code)

        result = calculate_portfolio_value(result, initial_cash)
        result = calculate_buy_and_hold(result, initial_cash)
        metrics = calculate_metrics(result)
        result = result.replace({np.nan: None})
        result_dict = result.to_dict(orient='records')
        for row in result_dict:
            if isinstance(row['timestamp'], pd.Timestamp):
                row['timestamp'] = row['timestamp'].isoformat()
        output = json.dumps({"results": result_dict, "metrics": metrics})
        print(output)
    except Exception as e:
        error_message = f"Error: {str(e)}"
        print(json.dumps({"error": error_message}), file=sys.stderr)
        sys.exit(1)

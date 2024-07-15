import sys
import json
import pandas as pd
import numpy as np

def run_user_strategy(data, strategy_code):
    # Define a safe execution environment
    env = {
        'pd': pd,
        'np': np,
    }
    exec(strategy_code, env)
    strategy = env['strategy']
    return strategy(data)

def calculate_portfolio_value(data, initial_cash):
    cash = initial_cash
    holdings = 0
    portfolio_value = initial_cash
    portfolio_values = []

    for index, row in data.iterrows():
        if row['positions'] == 1:  # Buy signal
            if cash > 0:
                holdings = cash / row['close']
                cash = 0
        elif row['positions'] == -1:  # Sell signal
            if holdings > 0:
                cash = holdings * row['close']
                holdings = 0
        portfolio_value = cash + holdings * row['close']
        portfolio_values.append(portfolio_value)

    data['portfolio_value'] = portfolio_values

    return data

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        data = pd.DataFrame(input_data['data'])
        strategy_code = input_data['strategy']
        initial_cash = 10000  # Set initial cash

        try:
            result = run_user_strategy(data, strategy_code)
            result = calculate_portfolio_value(result, initial_cash)
            
            # Clean up the result
            result = result.replace({np.nan: None})  # Replace NaN with None
            result_dict = result.to_dict(orient='records')
            
            for row in result_dict:
                if isinstance(row['timestamp'], pd.Timestamp):
                    row['timestamp'] = row['timestamp'].isoformat()
            
            # Ensure only the result JSON is printed to stdout
            output = json.dumps(result_dict)
            print(output)
        except Exception as e:
            error_message = f"Error: {str(e)}"
            print(json.dumps({"error": error_message}), file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        error_message = f"Error loading input data: {str(e)}"
        print(json.dumps({"error": error_message}), file=sys.stderr)
        sys.exit(1)

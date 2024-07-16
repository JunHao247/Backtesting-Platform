This project aims to assist researchers in backtesting their custom trading strategies with cryptocurrency data derived from Binance.

In the project directory `client`, you can run:

`npm start`

## Troubleshooting

### macOS Security Warning for fsevents.node

If you encounter a security warning about `fsevents.node` when running the application on macOS, you can resolve it by running the following commands in your terminal:

1. **Navigate to your project directory**:

    ```bash
    cd /path/to/your/project
    ```

2. **Remove `node_modules` and reinstall packages**:

    ```bash
    rm -rf node_modules
    npm install
    ```


Alternatively, you can clone the repository directly from GitHub to avoid this issue:

```bash
git clone https://github.com/your-username/your-repository-name.git

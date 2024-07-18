This project aims to assist researchers in backtesting their custom trading strategies with cryptocurrency data derived from Binance.

## Set Up

Step 1: 
Create an `.env` file in the project directory,

Input 2 parameters:

BINANCE_API_KEY = (Your own BINANCE API KEY)

BINANCE_API_SECRET = (Your own BINANCE API SECRET)

Step 2: 
In the project directory, you can run the below to start the server:

`node server.js` 

Step 3:
In the project directory `client`, you can run:

`npm start`


By following these 3 steps, the application should be running locally.


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

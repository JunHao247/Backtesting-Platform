This project aims to assist researchers in backtesting their custom trading strategies with cryptocurrency data derived from Binance.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your local development machine:

- **Git**: Version control system to clone the repository.
- **Node.js**: JavaScript runtime to run the project.
- **npm**: Node package manager to install dependencies.

### Installation

1. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```sh
   git clone https://github.com/JunHao247/Backtesting-Platform.git

2. **Navigate to the project directory**
   
   ```sh
   cd Backtesting-Platform

3. **Install Dependencies**
   ```sh
   npm install

4. **Retrieve Binance API Key and Secret**

    To interact with the Binance API, you need an API key and secret. Follow these steps to retrieve them:

        a. Sign Up or Log In: Go to Binance and sign up for an account or log in to your existing account.
        b. API Management: Navigate to the API Management section in your account settings.
        c. Create API Key: Create a new API key. You will be prompted to provide a label for your API key and to complete security verifications.
        d. Save Your API Key and Secret: Once the API key is created, you will see your API key and secret. Make sure to save them securely as the secret will be shown only once.

5. **Environment Variables**
   
    Create an `.env` file in the project directory,

    Input 2 parameters:
    ```sh
    BINANCE_API_KEY = (Your own BINANCE API KEY)

    BINANCE_API_SECRET = (Your own BINANCE API SECRET)

6. **Start the static server**

    From the terminal, in the project directory, you can run the below to start the server:   
    ```sh
    node server.js

7. **Start the application**

    From the terminal, in the project directory, you can run the below to start the application:   
    ```sh
    npm start

By following the above steps, the application should be running locally.


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
```

System Architecture Diagram
```mermaid
graph LR;
    App["App Component"] --> BacktestForm["BacktestForm Component"]
    App --> ResultsDisplay["ResultsDisplay Component"]
    App --> OrderBook["OrderBook Component"]
    App --> Analysis["Analysis Component"]
    App --> Documentation["Documentation Component"]

    BacktestForm --> ExecuteStrategy["ExecuteStrategy Script"]
    ExecuteStrategy --> BinanceAPI["Binance API"]

    OrderBook --> BinanceAPI

    ExecuteStrategy --> ResultsDisplay
    ResultsDisplay --> Analysis
    OrderBook --> Analysis
    Analysis --> Documentation
```

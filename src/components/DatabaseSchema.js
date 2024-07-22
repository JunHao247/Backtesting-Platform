import React from 'react';

const DatabaseSchema = () => {
  return (
    <div className="database-schema">
      <h2>Database Schema</h2>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>timestamp</td>
            <td>The timestamp of the kline/candlestick.</td>
          </tr>
          <tr>
            <td>open</td>
            <td>Opening price during the kline interval.</td>
          </tr>
          <tr>
            <td>high</td>
            <td>Highest price during the kline interval.</td>
          </tr>
          <tr>
            <td>low</td>
            <td>Lowest price during the kline interval.</td>
          </tr>
          <tr>
            <td>close</td>
            <td>Closing price during the kline interval.</td>
          </tr>
          <tr>
            <td>volume</td>
            <td>Trading volume during the kline interval.</td>
          </tr>
          <tr>
            <td>quoteAssetVolume</td>
            <td>Volume of the quote asset traded.</td>
          </tr>
          <tr>
            <td>numberOfTrades</td>
            <td>Number of trades during the kline interval.</td>
          </tr>
          <tr>
            <td>takerBuyBaseAssetVolume</td>
            <td>Volume of the base asset bought with taker buy orders.</td>
          </tr>
          <tr>
            <td>takerBuyQuoteAssetVolume</td>
            <td>Volume of the quote asset bought with taker buy orders.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DatabaseSchema;

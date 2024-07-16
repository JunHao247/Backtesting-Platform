require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const Binance = require('binance-api-node').default;

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

const getHistoricalKlines = async (symbol, interval, start, end) => {
  const klines = await client.candles({
    symbol,
    interval,
    startTime: new Date(start).getTime(),
    endTime: end ? new Date(end).getTime() : undefined,
  });

  return klines.map(k => ({
    timestamp: new Date(k.openTime),
    open: parseFloat(k.open),
    high: parseFloat(k.high),
    low: parseFloat(k.low),
    close: parseFloat(k.close),
    volume: parseFloat(k.volume),
  }));
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/backtest', async (req, res) => {
  const { symbol, startDate, endDate, strategy, initialCash } = req.body;
  try {
    const data = await getHistoricalKlines(symbol, '1d', startDate, endDate);
    console.log('Historical data fetched:', data.length, 'records');

    const pythonProcess = spawn('python', ['execute_strategy.py']);

    // Write data to stdin of python process
    pythonProcess.stdin.write(JSON.stringify({ data, strategy, initialCash }));
    pythonProcess.stdin.end();

    let result = '';
    let error = '';
    pythonProcess.stdout.on('data', (chunk) => {
      result += chunk.toString();
    });

    pythonProcess.stderr.on('data', (chunk) => {
      error += chunk.toString();
      console.error('Python stderr:', chunk.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process exited with code:', code);
        return res.status(500).send('Error executing strategy');
      }
      try {
        if (error) {
          console.error('Error from Python script:', error);
          return res.status(500).send(error);
        }
        console.log('Result:', result);
        const parsedResult = JSON.parse(result);
        res.json(parsedResult);
      } catch (err) {
        console.error('Error parsing strategy result:', err);
        res.status(500).send('Error parsing strategy result');
      }
    });
  } catch (error) {
    console.error('Error running backtest:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

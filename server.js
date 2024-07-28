require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const Binance = require('binance-api-node').default;
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const sessionId = req.body.sessionId || 'default';
    const fileName = `${sessionId}_${file.fieldname}_${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

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
    quoteAssetVolume: parseFloat(k.quoteAssetVolume),
    takerBuyBaseAssetVolume: k.takerBuyBaseAssetVolume !== undefined ? parseFloat(k.takerBuyBaseAssetVolume) : null,
    takerBuyQuoteAssetVolume: k.takerBuyQuoteAssetVolume !== undefined ? parseFloat(k.takerBuyQuoteAssetVolume) : null,

   
  }));
};

app.get('/api/test', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/backtest', upload.fields([
  { name: 'modelFile', maxCount: 1 },
  { name: 'trainingScript', maxCount: 1 }
]), async (req, res) => {
  const { symbol, startDate, endDate, strategy, initialCash, sessionId } = req.body;

  try {
    const data = await getHistoricalKlines(symbol, '1d', startDate, endDate);
    console.log('Historical data fetched:', data.length, 'records');

    const pythonProcess = spawn('python', ['execute_strategy.py']);

    const files = req.files || {};
    const modelFile = files.modelFile ? files.modelFile[0].path : null;
    const trainingScript = files.trainingScript ? files.trainingScript[0].path : null;

    const input = {
      data,
      strategy,
      initialCash,
      symbol,
      sessionId,
      modelFile,
      trainingScript
    };

    pythonProcess.stdin.write(JSON.stringify(input));
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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const getHistoricalData = async () => {
  const data = await getHistoricalKlines('BTCUSDT', '1d', '2017-01-01', '2024-01-01');
  const csv = data.map(d => `${d.timestamp},${d.open},${d.high},${d.low},${d.close},${d.volume},${d.quoteAssetVolume},${d.takerBuyBaseAssetVolume},${d.takerBuyQuoteAssetVolume}`).join('\n');
  fs.writeFileSync('historical_data.csv', 'timestamp,open,high,low,close,volume,quoteAssetVolume,takerBuyBaseAssetVolume,takerBuyQuoteAssetVolume\n' + csv);

  console.log('Historical data saved to historical_data.csv');
};

app.get('/api/generate-historical-data', async (req, res) => {
  try {
    await getHistoricalData();
    res.send('Historical data generated and saved to historical_data.csv');
  } catch (error) {
    console.error('Error generating historical data:', error);
    res.status(500).send('Error generating historical data');
  }
});

// Add this endpoint to your server.js
app.get('/api/update-model', async (req, res) => {
  try {
    const pythonProcess = spawn('python', ['training_model.py']);
    
    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).send('Error updating model');
      }
      res.send('Model updated successfully');
    });
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).send('Internal Server Error');
  }
});

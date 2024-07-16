import React, { useState } from 'react';
import BacktestForm from './components/BacktestForm';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

const App = () => {
  const [results, setResults] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto Backtesting Platform</h1>
        <nav>
          <a href="#home">Backtest</a>
          <a href="#backtest">Database Schema</a>
          <a href="#about">Documentation</a>
        </nav>
      </header>
      <main>
        <BacktestForm onResults={setResults} />
        {results && <ResultsDisplay results={results} />}
      </main>
    </div>
  );
};

export default App;

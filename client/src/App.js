// src/App.js
import React, { useState } from 'react';
import BacktestForm from './components/BacktestForm';
import ResultsDisplay from './components/ResultsDisplay';

const App = () => {
  const [results, setResults] = useState(null);


  return (
    <div className="App">
      <h1>Crypto Backtesting Platform</h1>
      <BacktestForm onResults={setResults} />
      <ResultsDisplay results={results} />
    </div>
  );
};

export default App;

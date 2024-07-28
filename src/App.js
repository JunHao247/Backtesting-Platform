import React, { useState } from 'react';
import BacktestForm from './components/BacktestForm';
import ResultsDisplay from './components/ResultsDisplay';
import DatabaseSchema from './components/DatabaseSchema';
import Documentation from './components/Documentation';
import OrderBook from './components/OrderBook';
import './App.css';

const App = () => {
  const [results, setResults] = useState(null);
  const [view, setView] = useState('home');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto Backtesting Platform</h1>
        <nav>
          <a href="#home" onClick={() => setView('home')}>Backtest</a>
          <a href="#orderbook" onClick={() => setView('orderbook')}>Order Book</a>
          <a href="#database" onClick={() => setView('database')}>Database Schema</a>
          <a href="#documentation" onClick={() => setView('documentation')}>Documentation</a>
        </nav>
      </header>
      <main>
        {view === 'home' && (
          <>
            <BacktestForm onResults={setResults} />
            {results && <ResultsDisplay results={results} />}
          </>
        )}
        {view === 'orderbook' && <OrderBook />}
        {view === 'database' && <DatabaseSchema />}
        {view === 'documentation' && <Documentation />}
      </main>
    </div>
  );
};

export default App;

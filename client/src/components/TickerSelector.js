// src/components/TickerSelector.js
import React from 'react';

const TickerSelector = ({ onTickerChange }) => (
  <select onChange={(e) => onTickerChange(e.target.value)}>
    <option value="BTCUSDT">BTCUSDT</option>
    <option value="ETHUSDT">ETHUSDT</option>
    {/* Add more options as needed */}
  </select>
);

export default TickerSelector;

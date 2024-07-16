import React from 'react';

const TickerSelector = ({ onTickerChange }) => (
  <select onChange={(e) => onTickerChange(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
    <option value="BTCUSDT">BTCUSDT</option>
    <option value="ETHUSDT">ETHUSDT</option>
    {/* Add more options as needed */}
  </select>
);

export default TickerSelector;

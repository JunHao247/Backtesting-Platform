import React from 'react';

const TickerSelector = ({ value, onTickerChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onTickerChange(e.target.value.toUpperCase())}
      placeholder="Enter cryptocurrency ticker"
      style={{
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#3a3a3a',
        color: '#e0e0e0',
      }}
    />
  );
};

export default TickerSelector;

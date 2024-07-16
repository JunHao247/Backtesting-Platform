import React from 'react';

const StrategyEditor = ({ onStrategyChange, presetStrategy }) => (
  <textarea class="strategy"
    onChange={(e) => onStrategyChange(e.target.value)} 
    placeholder="Enter your strategy here" 
    rows="20" 
    cols="50"
    defaultValue={presetStrategy} // Set the default value to the preset strategy
    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
  />
);

export default StrategyEditor;

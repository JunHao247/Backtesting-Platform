import React from 'react';

const StrategyEditor = ({ onStrategyChange, presetStrategy }) => (
  <textarea
    className="strategy"
    onChange={(e) => onStrategyChange(e.target.value)}
    defaultValue={presetStrategy}
    placeholder='Enter your strategy here'
  />
);

export default StrategyEditor;

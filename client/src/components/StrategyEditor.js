import React, { useEffect } from 'react';

const StrategyEditor = ({ onStrategyChange, presetStrategy }) => {
  useEffect(() => {
    onStrategyChange(presetStrategy);
  }, [presetStrategy, onStrategyChange]);

  return (
    <textarea className = "strategy"
      onChange={(e) => onStrategyChange(e.target.value)}
      value={presetStrategy}
      placeholder="Enter your strategy here"
    />
  );
};

export default StrategyEditor;

import React, { useEffect } from 'react';

const StrategyEditor = ({ onStrategyChange, presetStrategy, setCustomStrategy }) => {
  useEffect(() => {
    onStrategyChange(presetStrategy);
  }, [presetStrategy, onStrategyChange]);

  const handleChange = (e) => {
    const newCode = e.target.value;
    onStrategyChange(newCode);
    setCustomStrategy(newCode); // Notify the parent component that the strategy is being edited
  };

  return (
    <textarea
      className="strategy"
      onChange={handleChange}
      value={presetStrategy}
      placeholder="Enter your strategy here"
    />
  );
};

export default StrategyEditor;


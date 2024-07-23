import React, { useState, useEffect } from 'react';

const StrategyEditor = ({ onStrategyChange, presetStrategy, setCustomStrategy }) => {
  const [code, setCode] = useState(presetStrategy);

  useEffect(() => {
    setCode(presetStrategy);
  }, [presetStrategy]);

  const handleChange = (e) => {
    setCode(e.target.value);
    onStrategyChange(e.target.value);
    setCustomStrategy(); // Notify the parent component that the strategy is being edited
  };

  return (
    <textarea value={code} 
    onChange={handleChange} 
    rows="20" 
    cols="50"
    placeholder="Enter your strategy here"
    className = "strategy"
    />
  );
};

export default StrategyEditor;


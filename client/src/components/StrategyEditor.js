// src/components/StrategyEditor.js
import React from 'react';

const StrategyEditor = ({ onStrategyChange }) => (
  <textarea onChange={(e) => onStrategyChange(e.target.value)} placeholder="Enter your strategy here" rows="20" cols="50" />
);

export default StrategyEditor;

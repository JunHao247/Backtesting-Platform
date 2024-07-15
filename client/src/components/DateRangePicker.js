// src/components/DateRangePicker.js
import React from 'react';

const DateRangePicker = ({ onStartDateChange, onEndDateChange }) => (
  <div>
    <input type="date" onChange={(e) => onStartDateChange(e.target.value)} />
    <input type="date" onChange={(e) => onEndDateChange(e.target.value)} />
  </div>
);

export default DateRangePicker;

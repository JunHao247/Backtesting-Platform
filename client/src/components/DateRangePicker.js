import React, { useState } from 'react';

const DateRangePicker = ({ onStartDateChange, onEndDateChange }) => {
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    onStartDateChange(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onEndDateChange(newEndDate);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <input 
        type="date" 
        value={startDate} 
        onChange={handleStartDateChange} 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
      />
      <input 
        type="date" 
        value={endDate} 
        onChange={handleEndDateChange} 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
      />
    </div>
  );
};

export default DateRangePicker;

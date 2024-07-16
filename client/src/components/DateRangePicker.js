import React from 'react';

const DateRangePicker = ({ onStartDateChange, onEndDateChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <input type="date" onChange={(e) => onStartDateChange(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
    <input type="date" onChange={(e) => onEndDateChange(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
  </div>
);

export default DateRangePicker;

import React from 'react';

export default function DatePicker({ value, onChange }) {
  return (
    <input
      type='date'
      max={new Date().toISOString().split('T')[0]}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='border rounded px-2 py-1'
    />
  );
}

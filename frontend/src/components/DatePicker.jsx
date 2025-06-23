import React from 'react';
import Form from 'react-bootstrap/Form';

export default function DatePicker({ value, onChange, id }) {
  return (
    <Form.Control
      type='date'
      id={id}
      max={new Date().toISOString().split('T')[0]}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

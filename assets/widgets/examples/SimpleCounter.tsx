import React, { useState } from 'react';

interface SimpleCounterProps {
  initialValue?: number;
  label?: string;
}

const SimpleCounter: React.FC<SimpleCounterProps> = ({
  initialValue = 0,
  label = 'Counter'
}) => {
  const [count, setCount] = useState(initialValue);

  return (
    <div style={{
      padding: '10px',
      border: '2px solid #007bff',
      borderRadius: '4px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3>{label}</h3>
      <p>Current value: {count}</p>
      <div>
        <button
          onClick={() => setCount(count - 1)}
          style={{
            marginRight: '5px',
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px'
          }}
        >
          -
        </button>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SimpleCounter;

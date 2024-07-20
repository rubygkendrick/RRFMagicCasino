/* eslint-disable react/prop-types */
import { useState } from 'react';
import './WheelOfFortune.css';
import Confetti from 'react-confetti';

export default function WheelOfFortune() {
  const names = Array.from({ length: 22 }, (_, i) => (i % 2 === 0 ? 'Christina' : 'Josh'));
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const spinWheel = () => {
    setSpinning(true);
    setResult(null);

    const duration = 4; // duration in seconds

    setTimeout(() => {
      const finalResult = names[Math.floor(Math.random() * names.length)];
      setResult(finalResult);
      setSpinning(false);
    }, duration * 1000);
  };

  const isEven = (num) => num % 2 || num == 0;

  return (
    <div className="wheel-container">
      <div className={`wheel ${spinning ? 'spinning' : ''}`}>
        {names.map((name, index) => (
          <div
            key={index}
            id="segment"
            style={{
              transform: `rotate(${(index * 360) / names.length}deg)skewY(-45deg)`,
              backgroundColor: isEven(index) ? '#F01AC9' : '#FDD518',
              color: '#000',
            }}
          >
            <div id="segment-text">{name}</div>
             
          </div>
        ))}
      </div>
      <div className="ticker"></div>
      <button onClick={spinWheel} disabled={spinning}>
        Spin the Wheel
      </button>
      {result && (
        <div className="result-popup">
          {`Winner: ${result}`}
          <Confetti />
        </div>
      )}
    </div>
  );
}



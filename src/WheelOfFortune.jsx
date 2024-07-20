import { useState, useRef } from 'react';
import './WheelOfFortune.css';
import Confetti from 'react-confetti';

export default function WheelOfFortune() {
    const segments = 12;
    const names = ['Christina', 'Josh'];
    const [result, setResult] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const wheelRef = useRef(null);
    const degreesPerSegment = 360 / segments;
    
    const spinWheel = () => {
        setSpinning(true);
        setResult(null);

        const duration = 4; // duration in seconds
        const rotations = 4; // number of full rotations
        
        const extraRotation = Math.floor(Math.random() * segments) * degreesPerSegment;
        const totalRotation = rotations * 360 + extraRotation;

        wheelRef.current.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            const winningIndex = segments - 1 - Math.floor(extraRotation / degreesPerSegment);
            setResult(names[winningIndex % 2]);
            setSpinning(false);
        }, duration * 1000);
    };


    return (
    <div className="casino-container">
      <div className="wheel-container">
        <div ref={wheelRef} className={`wheel ${spinning ? 'spinning' : ''}`}>
          {Array.from({ length: segments }).map((_, segmentIndex) => {
            const segmentStyle = {
              transform: `rotate(${(segmentIndex * degreesPerSegment)}deg)`,
              backgroundColor: segmentIndex % 2 === 0 ? '#FDD518' : '#F01AC9',
            };

            return (
              <div
                key={segmentIndex}
                className="segment"
                style={segmentStyle}
              >
                <span className="name">
                  {names[segmentIndex % names.length]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="ticker"></div>
      </div>
      <button className="button" onClick={spinWheel} disabled={spinning}>
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
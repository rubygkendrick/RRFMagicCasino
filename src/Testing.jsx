import React, { useState, useEffect, useRef } from 'react';
import './Testing.css';

export const Testing = () => {
    const [deg, setDeg] = useState(7.5);
    const [jackpot, setJackpot] = useState(0);
    const [score, setScore] = useState(0);
    const arrowRef = useRef(null);
    const wheelRef = useRef(null);

    useEffect(() => {
        const handleSpin = () => {
            arrowRef.current.removeEventListener('click', handleSpin);

            arrowRef.current.classList.add('arrowanimation');
            const newDeg = deg + 180 + (15 * random(0, 24));
            setDeg(newDeg);

            wheelRef.current.style.transform = `rotate(${newDeg}deg)`;

            const newPosition = newDeg % 360;
            console.log(newPosition + " position");

            let newScore = score;
            let newJackpot = jackpot;

            if ([7.5, 172.5, 202.5].includes(newPosition)) {
                newScore += 800;
                newJackpot += 800;
            } else if ([22.5, 157.5, 217.5].includes(newPosition)) {
                newScore += 700;
                newJackpot += 700;
            } else if ([37.5, 247.5].includes(newPosition)) {
                newScore += 500;
                newJackpot += 500;
            } else if ([52.5, 82.5, 292.5].includes(newPosition)) {
                newScore += 200;
                newJackpot += 200;
            } else if ([67.5, 307.5].includes(newPosition)) {
                newScore += 100;
                newJackpot += 100;
            } else if (newPosition === 97.5) {
                newScore += 300;
                newJackpot += 300;
            } else if (newPosition === 112.5) {
                newScore += 400;
                newJackpot += 400;
            } else if (newPosition === 127.5) {
                newScore += 100;
                newJackpot += 100;
            } else if (newPosition === 142.5) {
                newScore += 600;
                newJackpot += 600;
            } else if (newPosition === 187.5 || newPosition === 322.5 || newPosition === 352.5) {
                newJackpot += newScore;
                newScore = 0;
            } else if (newPosition === 232.5) {
                newScore += 600;
                newJackpot += 600;
            } else if (newPosition === 277.5) {
                newScore += 300;
                newJackpot += 300;
            } else if (newPosition === 337.5) {
                newScore += newJackpot;
                newJackpot = 0;
                // Uncomment the next line to add sound effect
                // _jackpotSound.play();
            }

            setTimeout(() => {
                arrowRef.current.addEventListener('click', handleSpin);
                arrowRef.current.classList.remove('arrowanimation');
                setScore(newScore);
                setJackpot(newJackpot);
            }, 5000);
        };

        arrowRef.current.addEventListener('click', handleSpin);
        return () => {
            arrowRef.current.removeEventListener('click', handleSpin);
        };
    }, [deg, score, jackpot]);

    const random = (min, max) => Math.round(Math.random() * (max - min) + min);

    return (
        <div id="container">
            <h1>Wheel of Fortune</h1>
            <div id="spin">"Click arrow to spin!"</div>
            <div id="wheel_comp">
                <div id="arrow" ref={arrowRef}></div>
                <div id="wheel" ref={wheelRef}></div>
                <div id="middle">Jackpot = ${jackpot}</div>
            </div>
            <div id="score">Score = ${score}</div>
        </div>
    );
};

export default Testing;


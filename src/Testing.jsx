import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import './Testing.css';

export const Testing = () => {
    const [deg, setDeg] = useState(7.5);
    const [jackpot, setJackpot] = useState("AND THE WINNER IS...");
    const [score, setScore] = useState(0);
    const [confettiActive, setConfettiActive] = useState(false);
    const arrowRef = useRef(null);
    const wheelRef = useRef(null);

    useEffect(() => {
        const handleSpin = () => {
            arrowRef.current.removeEventListener('click', handleSpin);
            setJackpot("AND THE WINNER IS..."); // Reset jackpot to "Winner"
            setConfettiActive(false); // Turn off confetti when the arrow is clicked

            // Generate a high rotation value for fast spin
            const spinDuration = 5000; // Duration of the spin
            const newDeg = deg + 360 * 10 + 180 + (15 * random(0, 24));
            setDeg(newDeg);

            // Remove transition, force reflow, and then set new transition
            wheelRef.current.style.transition = 'none';
            wheelRef.current.style.transform = `rotate(${deg}deg)`;
            wheelRef.current.offsetHeight; // Force reflow
            wheelRef.current.style.transition = `transform ${spinDuration}ms ease-out`;
            wheelRef.current.style.transform = `rotate(${newDeg}deg)`;

            // Get the position after rotation
            const newPosition = newDeg % 360;
            console.log(newPosition + " position");

            let newScore = score;
            let newJackpot = jackpot;

            const positionToNameMap = {
                7.5: "Josh!",
                22.5: "Christina!",
                37.5: "Josh!",
                52.5: "Christina!",
                67.5: "Josh!",
                82.5: "Christina!",
                97.5: "Josh!",
                112.5: "Christina!",
                127.5: "Josh!",
                142.5: "Christina!",
                157.5: "Josh!",
                172.5: "Christina!",
                187.5: "Josh!",
                202.5: "Christina!",
                217.5: "Josh!",
                232.5: "Christina!",
                247.5: "Josh!",
                262.5: "Christina!",
                277.5: "Josh!",
                292.5: "Christina!",
                307.5: "Josh!",
                322.5: "Christina!",
                337.5: "Josh!",
                352.5: "Christina!"
            };

            if (positionToNameMap.hasOwnProperty(newPosition)) {
                newJackpot = positionToNameMap[newPosition];
            }

            // Show confetti when the spin ends
            setTimeout(() => {
                wheelRef.current.style.transition = 'none'; // Remove transition
                arrowRef.current.addEventListener('click', handleSpin);
                setScore(newScore);
                setJackpot(newJackpot);
                setConfettiActive(true); // Turn on confetti
            }, spinDuration); // Timeout to match the animation duration
        };

        arrowRef.current.addEventListener('click', handleSpin);
        return () => {
            arrowRef.current.removeEventListener('click', handleSpin);
        };

    }, [deg, score, jackpot]);

    const random = (min, max) => Math.round(Math.random() * (max - min) + min);

    return (
        <>
            {confettiActive && <Confetti />}
            <div id="container">
                <h1>LET's WIN A ROKU</h1>
                <div id="spin">Click arrow to spin!</div>
                <div id="wheel_comp">
                    <div id="arrow" ref={arrowRef}></div>
                    <div id="wheel" ref={wheelRef}></div>
                    <div id="middle">{jackpot}</div>
                </div>
            </div>
        </>
    );
};

export default Testing;

import { useState, useRef, useEffect } from 'react';
import './WheelOfFortune.css';
import Confetti from 'react-confetti';
import * as d3 from 'd3';

export default function WheelOfFortune() {
    const segments = 12;
    const names = ['Christina', 'Josh'];
    const [result, setResult] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const svgRef = useRef(null);
    const gRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 500;
        const height = 500;
        const radius = Math.min(width, height) / 2;

        svg.attr('width', width).attr('height', height);

        // Remove any existing <g> elements
        svg.selectAll('g').remove();

        // Append a new <g> element and center it
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`); // Center the <g> element

        // Store the reference
        gRef.current = g;

        const pie = d3.pie().value(1).padAngle(0.01);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        const data = Array.from({ length: segments }, (_, i) => ({
            name: names[i % names.length],
            color: i % 2 === 0 ? '#FDD518' : '#F01AC9'
        }));

        const arcs = g.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => d.data.color);

        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .text(d => d.data.name)
            .attr('text-anchor', 'middle')
            .attr('fill', '#000')
            .style('font-size', '12px');
    }, []);

    const spinWheel = () => {
        if (spinning) return;

        setSpinning(true);
        setResult(null);

        const duration = 4000;
        const rotations = 4;
        const extraRotation = Math.floor(Math.random() * segments) * (360 / segments);
        const totalRotation = rotations * 360 + extraRotation;

        if (!gRef.current) {
            console.error('gRef.current is not defined');
            setSpinning(false);
            return;
        }

        // Get current transform to maintain the center position
        const currentTransform = gRef.current.attr('transform');
        const transformRegex = /rotate\(([^)]+)\)/;
        const currentRotationMatch = transformRegex.exec(currentTransform);
        const currentRotation = currentRotationMatch ? parseFloat(currentRotationMatch[1]) : 0;

        gRef.current
            .transition()
            .duration(duration)
            .ease(d3.easeQuadInOut)
            .attrTween('transform', () => t => `${currentTransform} rotate(${t * totalRotation + currentRotation})`)
            .on('end', () => {
                const winningIndex = segments - 1 - Math.floor(extraRotation / (360 / segments));
                setResult(names[winningIndex % 2]);
                setSpinning(false);
            });
    };

    return (
        <div className="casino-container">
            <div className="wheel-container">
                <svg ref={svgRef}></svg>
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

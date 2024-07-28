import { useState, useRef, useEffect } from 'react';
import './WheelOfFortune.css';
import Confetti from 'react-confetti';
import * as d3 from 'd3';

export default function WheelOfFortune() {
    const segments = 22; // Number of segments
    const names = ['Christina', 'Josh']; // Segment names
    const [result, setResult] = useState(null); // State to hold the winner
    const [spinning, setSpinning] = useState(false); // State to determine if the wheel is spinning

    const svgRef = useRef(null); // Reference to the SVG element
    const gRef = useRef(null); // Reference to the group element within the SVG

    // Create the wheel SVG using D3
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
            color: i % 2 === 0 ? '#6CA9F5' : '#1B81FD'
        }));

        const arcs = g.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => d.data.color);

        arcs.append('text')
            .attr('transform', d => {
                const centroid = arc.centroid(d);
                const angle = (d.startAngle + d.endAngle) / 2;

                // Adjust rotation to ensure text is readable and aligned properly
                return `translate(${centroid[0]}, ${centroid[1]})
                        rotate(${angle * 180 / Math.PI - 90})`; // Adjust rotation
            })
            .attr('dy', '.35em')
            .text(d => d.data.name)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .style('font-size', '18px');
    }, []);

    

    const spinWheel = () => {
        if (spinning) return;
    
        setSpinning(true);
        setResult(null);
    
        const duration = 4000;
        const rotations = 4;
        const segmentAngle = 360 / segments;
        const extraRotation = Math.floor(Math.random() * segments) * segmentAngle;
    
        // Calculate the total rotation to ensure the winning segment ends at 3:00
        const totalRotation = rotations * 360 + extraRotation + 90; // Adding 90 degrees to align with 3:00 mark
    
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
                const winningIndex = segments - 1 - Math.floor(extraRotation / segmentAngle);
                const selectedSegment = names[winningIndex % names.length];
                setResult(selectedSegment);
                setSpinning(false);
    
                // Highlight the winning segment
                gRef.current.selectAll('.arc')
                    .filter((d, i) => i === winningIndex)
                    .select('path')
                    .attr('class', 'winning-segment');
            });
    };

    // Compute the angle for the winning segment
    const getWinningSegmentAngle = () => {
        if (result !== null) {
            const winningIndex = names.indexOf(result);
            const segmentAngle = 360 / segments;
            return winningIndex * segmentAngle + segmentAngle / 2 - 90; // Middle of the segment
        }
        return 0;
    };

    return (
        <div className="casino-container">
            <div className="wheel-container">
                <svg ref={svgRef}></svg>
                <div
                    className="ticker"
                   
                ></div>
            </div>
            <button className="button" onClick={spinWheel} disabled={spinning}>
                Spin the Wheel
            </button>
            {result && (
                <div className="result-popup">
                    <span className="winner-text">Winner:</span> <span className="result-text">{result}</span>
                    <Confetti />
                </div>
            )}
        </div>
    );
}

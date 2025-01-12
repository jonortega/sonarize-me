"use client";

import React, { useState, useEffect, useRef } from "react";
import { select, scaleLinear, line, curveBasis } from "d3";

interface FrequencyData {
  normal: number;
  actual: number;
}

const ResonanceWaves: React.FC = () => {
  const [frequencyData, setFrequencyData] = useState<FrequencyData | null>(null);
  const [showCombined, setShowCombined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/stats/indice-de-resonancia");
        const data = await response.json();
        setFrequencyData(data);
      } catch (error) {
        console.error("Error fetching frequency data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateWaveData = (frequency: number, amplitude: number = 0.5, phase: number = 0) => {
    return Array.from({ length: 200 }, (_, i) => ({
      x: i,
      y: amplitude * Math.sin(((frequency / 25) * i * Math.PI) / 24 + phase),
    }));
  };

  useEffect(() => {
    if (!frequencyData || !svgRef.current) return;

    const svg = select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 40, right: 20, bottom: 20, left: 40 };

    const xScale = scaleLinear()
      .domain([0, 199])
      .range([margin.left, width - margin.right]);

    const yScale = scaleLinear()
      .domain([-1, 1])
      .range([height - margin.bottom, margin.top]);

    const lineGenerator = line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(curveBasis);

    svg.selectAll("*").remove();

    const drawWave = (data: { x: number; y: number }[], color: string, delay: number = 0) => {
      const path = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator)
        .attr("opacity", 0);

      const totalLength = path.node()?.getTotalLength() || 0;

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .delay(delay) // Reduced initial delay
        .attr("opacity", 1)
        .transition()
        .duration(1500) // Slightly faster animation
        .attr("stroke-dashoffset", 0);

      return path;
    };

    const normalData = generateWaveData(frequencyData.normal);
    const actualData = generateWaveData(frequencyData.actual, 0.7, Math.PI / 4);

    if (!showCombined) {
      drawWave(normalData, "#1ed760", 100); // Reduced delay
      drawWave(actualData, "#68e394", 300); // Reduced delay
    } else {
      const combinedData = normalData.map((d, i) => ({
        x: d.x,
        y: d.y + actualData[i].y,
      }));
      drawWave(combinedData, "#FF7EB9", 100); // Reduced delay
    }
  }, [frequencyData, showCombined]);

  const handleToggleWaves = () => {
    const svg = select(svgRef.current);

    svg
      .selectAll("path")
      .transition()
      .duration(500)
      .attr("opacity", 0)
      .remove()
      .on("end", () => {
        setShowCombined(!showCombined);
      });
  };

  const difference = frequencyData ? Math.abs(frequencyData.actual - frequencyData.normal) : 0;

  return (
    <div className='bg-[#181818] p-6 rounded-lg'>
      {!showCombined ? (
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='bg-[#282828] p-4 rounded-lg'>
            <p className='text-[#B3B3B3] text-sm'>Normal Frequency</p>
            <p className='text-[#1DB954] text-2xl font-bold'>{isLoading ? "..." : (frequencyData?.normal ?? "N/A")}</p>
          </div>
          <div className='bg-[#282828] p-4 rounded-lg'>
            <p className='text-[#B3B3B3] text-sm'>Actual Frequency</p>
            <p className='text-[#2EDA6C] text-2xl font-bold'>{isLoading ? "..." : (frequencyData?.actual ?? "N/A")}</p>
          </div>
        </div>
      ) : (
        <div className='bg-[#282828] p-4 rounded-lg mb-6 border-2 border-[#FF7EB9]'>
          <p className='text-[#B3B3B3] text-sm'>Combined Resonance</p>
          <p className='text-[#FF7EB9] text-3xl font-bold'>{difference}</p>
        </div>
      )}

      <div className='relative' style={{ width: "100%", height: "200px" }}>
        <svg ref={svgRef} width='100%' height='100%' className='overflow-visible' />
      </div>

      <button
        onClick={handleToggleWaves}
        disabled={isLoading}
        className='mt-4 bg-[#1DB954] hover:bg-[#1ED760] text-[#FFFFFF] font-bold py-2 px-4 rounded-full w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? "Loading..." : showCombined ? "Show Original Waves" : "Combine Waves"}
      </button>
    </div>
  );
};

export default ResonanceWaves;

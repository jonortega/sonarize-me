"use client";

/**
 * ! Hacer que la animacion empiece antes
 * ! Mostrar el valor de la diferencia cuando salga la nueva onda
 * ! Permitir volver atrás apra ver las ondas originales
 * ! Mejorar la distribución general del diseño
 */

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
    // Increase points for smoother curves but reduce wavelengths
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
      .curve(curveBasis); // Use curve basis for smoother lines

    // Clear previous content
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
        .attr("opacity", 1)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0)
        .delay(delay);

      return path;
    };

    const normalData = generateWaveData(frequencyData.normal);
    const actualData = generateWaveData(frequencyData.actual, 0.7, Math.PI / 4);

    if (!showCombined) {
      drawWave(normalData, "#1ed760"); // Original Spotify green
      drawWave(actualData, "#68e394", 1000); // Lighter green for contrast
    } else {
      const combinedData = normalData.map((d, i) => ({
        x: d.x,
        y: d.y + actualData[i].y,
      }));
      drawWave(combinedData, "#FF7EB9");
    }
  }, [frequencyData, showCombined]);

  const handleCombineWaves = () => {
    const svg = select(svgRef.current);

    // Fade out existing waves
    svg
      .selectAll("path")
      .transition()
      .duration(1000)
      .attr("opacity", 0)
      .remove()
      .on("end", () => {
        setShowCombined(true);
      });
  };

  return (
    <div className='bg-[#181818] p-6 rounded-lg'>
      <h2 className='text-2xl font-bold mb-4 text-[#FFFFFF]'>Resonance Waves</h2>

      <div className='space-y-2 mb-6'>
        <p style={{ color: "#1DB954" }}>Normal: {isLoading ? "Loading..." : (frequencyData?.normal ?? "N/A")}</p>
        <p style={{ color: "#2EDA6C" }}>Actual: {isLoading ? "Loading..." : (frequencyData?.actual ?? "N/A")}</p>
      </div>

      <div className='relative' style={{ width: "100%", height: "200px" }}>
        <svg ref={svgRef} width='100%' height='100%' className='overflow-visible' />
      </div>

      <button
        onClick={handleCombineWaves}
        disabled={showCombined || isLoading}
        className='mt-4 bg-[#1DB954] hover:bg-[#1ED760] text-[#FFFFFF] font-bold py-2 px-4 rounded-full w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? "Loading..." : "Combine Waves"}
      </button>
    </div>
  );
};

export default ResonanceWaves;

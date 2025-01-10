"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const IndiceDeResonancia: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<{ normal: number; actual: number } | null>(null);

  // Controles de visualización
  const [showWave1, setShowWave1] = useState(true);
  const [showWave2, setShowWave2] = useState(true);
  const [showCombined, setShowCombined] = useState(true);
  const [opacityControl, setOpacityControl] = useState(0.5); // Rango entre 0 y 1

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stats/indice-de-resonancia");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to generate a sine wave
  const generateWave = (frequency: number, amplitude: number, length: number): [number, number][] => {
    const points: [number, number][] = [];
    const sampleRate = 100; // Number of points per unit length
    for (let i = 0; i < length * sampleRate; i++) {
      const x = i / sampleRate;
      const y = amplitude * Math.sin(2 * Math.PI * frequency * x);
      points.push([x, y]);
    }
    return points;
  };

  // Calculate and render the waves
  useEffect(() => {
    if (!data || !svgRef.current) return;

    const { normal, actual } = data;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Clear previous content
    svg.selectAll("*").remove();

    // Scale setup
    const xScale = d3
      .scaleLinear()
      .domain([0, 5]) // Mostrar 5 longitudes de onda
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([-2, 2]) // Adaptar para evitar cortes
      .range([height - margin.bottom, margin.top]);

    // Generate the waves
    const wave1 = generateWave(normal / 100, 1, 5); // Frecuencia escalada
    const wave2 = generateWave(actual / 100, 1, 5);
    const combinedWave = wave1.map(([x, y1], i) => [x, y1 + wave2[i][1]]);

    // Draw axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg
      .append("g")
      .attr("transform", `translate(0,${height / 2})`)
      .call(xAxis);

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

    // Opacity levels
    const opacityWave1 = 1 - opacityControl; // Máxima opacidad cuando el control está a la izquierda
    const opacityWave2 = 1 - opacityControl;
    const opacityCombined = opacityControl; // Máxima opacidad cuando el control está a la derecha

    // Draw wave1
    if (showWave1) {
      svg
        .append("path")
        .datum(wave1 as [number, number][])
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("opacity", opacityWave1)
        .attr(
          "d",
          d3
            .line<[number, number]>()
            .x((d) => xScale(d[0]))
            .y((d) => yScale(d[1]))
        );
    }

    // Draw wave2
    if (showWave2) {
      svg
        .append("path")
        .datum(wave2 as [number, number][])
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr("opacity", opacityWave2)
        .attr(
          "d",
          d3
            .line<[number, number]>()
            .x((d) => xScale(d[0]))
            .y((d) => yScale(d[1]))
        );
    }

    // Draw combined wave
    if (showCombined) {
      svg
        .append("path")
        .datum(combinedWave as [number, number][])
        .attr("fill", "none")
        .attr("stroke", Math.abs(normal - actual) < 10 ? "green" : "red")
        .attr("stroke-width", 3)
        .attr("opacity", opacityCombined)
        .attr(
          "d",
          d3
            .line<[number, number]>()
            .x((d) => xScale(d[0]))
            .y((d) => yScale(d[1]))
        );
    }
  }, [data, showWave1, showWave2, showCombined, opacityControl]);

  return (
    <div>
      <h2>Índice de Resonancia</h2>
      <svg ref={svgRef} width={800} height={400} />
      {!data && <p>Cargando datos...</p>}
      <div>
        <label>
          <input type='checkbox' checked={showWave1} onChange={() => setShowWave1(!showWave1)} />
          Mostrar &quot;Yo Normal&quot;
        </label>
        <label>
          <input type='checkbox' checked={showWave2} onChange={() => setShowWave2(!showWave2)} />
          Mostrar &quot;Yo Actual&quot;
        </label>
        <label>
          <input type='checkbox' checked={showCombined} onChange={() => setShowCombined(!showCombined)} />
          Mostrar Onda Combinada
        </label>
        <label>
          Opacidad:
          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={opacityControl}
            onChange={(e) => setOpacityControl(parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default IndiceDeResonancia;

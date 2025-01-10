"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const IndiceDeResonancia: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<{ normal: number; actual: number } | null>(null);
  const [combine, setCombine] = useState(false); // Controla cuándo se combinan las ondas

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

    // Draw wave1 (Yo Normal)
    const pathWave1 = svg
      .append("path")
      .datum(wave1)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("opacity", 1) // Comienza completamente visible
      .attr(
        "d",
        d3
          .line<[number, number]>()
          .x(() => margin.left) // Comienza desde el margen izquierdo
          .y(() => height / 2)
      ); // Línea horizontal inicial

    // Add label for wave1
    const wave1Label = svg
      .append("text")
      .attr("x", xScale(wave1[0][0]) + 20) // Inicio de la onda
      .attr("y", margin.top)
      .attr("fill", "blue")
      .attr("font-size", "12px")
      .attr("text-anchor", "end") // Alinear al lado izquierdo del texto
      .text(`Yo Normal: ${normal.toFixed(2)}`);

    // Animate wave1
    pathWave1
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr(
        "d",
        d3
          .line<[number, number]>()
          .x((d) => xScale(d[0]))
          .y((d) => yScale(d[1]))
      );

    wave1Label
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("x", xScale(wave1[0][0]) - 10)
      .attr("y", yScale(wave1[0][1]));

    // Draw wave2 (Yo Actual)
    const pathWave2 = svg
      .append("path")
      .datum(wave2)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr("opacity", 1) // Comienza completamente visible
      .attr(
        "d",
        d3
          .line<[number, number]>()
          .x(() => margin.left) // Comienza desde el margen izquierdo
          .y(() => height / 2)
      ); // Línea horizontal inicial

    // Add label for wave2
    const wave2Label = svg
      .append("text")
      .attr("x", xScale(wave2[0][0]) + 20) // Inicio de la onda
      .attr("y", margin.top + 20)
      .attr("fill", "orange")
      .attr("font-size", "12px")
      .attr("text-anchor", "end") // Alinear al lado izquierdo del texto
      .text(`Yo Actual: ${actual.toFixed(2)}`);

    // Animate wave2
    pathWave2
      .transition()
      .delay(1500) // Aparece después de la primera onda
      .duration(1500)
      .ease(d3.easeLinear)
      .attr(
        "d",
        d3
          .line<[number, number]>()
          .x((d) => xScale(d[0]))
          .y((d) => yScale(d[1]))
      );

    wave2Label
      .transition()
      .delay(1500)
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("x", xScale(wave2[0][0]) - 10)
      .attr("y", yScale(wave2[0][1]));

    // Draw combined wave (Onda Combinada)
    const pathCombined = svg
      .append("path")
      .datum(wave1) // Comienza igual que wave1
      .attr("fill", "none")
      .attr("stroke", Math.abs(normal - actual) < 10 ? "green" : "red")
      .attr("stroke-width", 3)
      .attr("opacity", 0) // Comienza invisible
      .attr(
        "d",
        d3
          .line<[number, number]>()
          .x((d) => xScale(d[0]))
          .y((d) => yScale(d[1]))
      );

    // Animate transformation to combined wave and fading of originals
    if (combine) {
      pathCombined
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr(
          "d",
          d3
            .line<[number, number]>()
            .x((d) => xScale(d[0]))
            .y((d, i) => yScale(combinedWave[i][1]))
        )
        .attr("opacity", 1); // Aparece progresivamente

      pathWave1.transition().duration(2000).ease(d3.easeLinear).attr("opacity", 0); // Se desvanece
      wave1Label.transition().duration(2000).ease(d3.easeLinear).attr("opacity", 0); // Desaparece la etiqueta

      pathWave2.transition().duration(2000).ease(d3.easeLinear).attr("opacity", 0); // Se desvanece
      wave2Label.transition().duration(2000).ease(d3.easeLinear).attr("opacity", 0); // Desaparece la etiqueta
    }
  }, [data, combine]);

  return (
    <div>
      <h2>Índice de Resonancia</h2>
      <svg ref={svgRef} width={800} height={400} />
      {!data && <p>Cargando datos...</p>}
      <button style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }} onClick={() => setCombine(true)}>
        Combinar Ondas
      </button>
    </div>
  );
};

export default IndiceDeResonancia;

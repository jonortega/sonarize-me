"use client";

import React, { useState, useEffect, useRef } from "react";
import { select, scaleLinear, line, curveBasis } from "d3";
import NoFavorites from "@/components/NoFavorites";
import Loading from "@/components/Loading";
import { useFetch } from "@/lib/useFetch";

interface FrequencyData {
  normal: number;
  actual: number;
}

type WaveType = "normal" | "actual" | "combined" | null;

const IndiceDeInterferencia: React.FC = () => {
  const [showCombined, setShowCombined] = useState(false);
  const [highlightedWave, setHighlightedWave] = useState<WaveType>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: frequencyData, loading, error } = useFetch<FrequencyData>("/api/stats/indice-de-interferencia");

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

    const drawWave = (data: { x: number; y: number }[], color: string, delay: number = 0, waveType: WaveType) => {
      const path = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator)
        .attr("opacity", 0)
        .attr("class", `wave-${waveType}`);

      const totalLength = path.node()?.getTotalLength() || 0;

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .delay(delay)
        .attr("opacity", 1)
        .transition()
        .duration(1500)
        .attr("stroke-dashoffset", 0);

      return path;
    };

    const normalData = generateWaveData(frequencyData.normal);
    const actualData = generateWaveData(frequencyData.actual, 0.7, Math.PI / 4);

    if (!showCombined) {
      drawWave(normalData, "#1ed760", 100, "normal"); // Spotify green
      drawWave(actualData, "#4687D6", 300, "actual"); // Complementary blue
    } else {
      const combinedData = normalData.map((d, i) => ({
        x: d.x,
        y: d.y + actualData[i].y,
      }));
      drawWave(combinedData, "#FF7EB9", 100, "combined");
    }
  }, [frequencyData, showCombined]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll("path").attr("filter", "");

    if (highlightedWave) {
      svg.select(`.wave-${highlightedWave}`).attr("filter", "drop-shadow(0 0 6px currentColor)");
    }
  }, [highlightedWave]);

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
        setHighlightedWave(null);
      });
  };

  const difference = frequencyData ? Math.abs(frequencyData.actual - frequencyData.normal) : 0;

  const FrequencyCard: React.FC<{
    label: string;
    value: number | string;
    color: string;
    type: WaveType;
  }> = ({ label, value, color, type }) => (
    <div
      className={`bg-[#282828] p-4 rounded-lg text-center transition-all duration-300 hover:bg-[#363636] cursor-pointer`}
      style={{
        background:
          highlightedWave === type
            ? `radial-gradient(circle at center, #363636 40%, ${
                type === "normal"
                  ? "rgba(30, 215, 96, 0.15)"
                  : type === "actual"
                    ? "rgba(70, 135, 214, 0.15)"
                    : "rgba(255, 126, 185, 0.15)"
              } 100%)`
            : "#282828",
      }}
      onMouseEnter={() => setHighlightedWave(type)}
      onMouseLeave={() => setHighlightedWave(null)}
    >
      <p className='text-[#B3B3B3] text-sm mb-2'>{label}</p>
      <p className={`text-3xl font-bold`} style={{ color }}>
        {value}
      </p>
    </div>
  );

  if (loading) {
    return <Loading />;
  }

  if (!loading && (!frequencyData || frequencyData.normal === -1)) {
    return <NoFavorites />;
  }

  if (error) {
    return <p className='text-white'>{error}</p>;
  }

  return (
    <div className='bg-[#181818] p-6 rounded-lg'>
      {!showCombined ? (
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <FrequencyCard
            label='Frecuencia Habitual'
            value={loading ? "..." : (frequencyData?.normal ?? "N/A")}
            color='#1ed760'
            type='normal'
          />
          <FrequencyCard
            label='Frecuencia del Momento'
            value={loading ? "..." : (frequencyData?.actual ?? "N/A")}
            color='#4687D6'
            type='actual'
          />
        </div>
      ) : (
        <FrequencyCard label='Interferencia Combinada' value={difference} color='#FF7EB9' type='combined' />
      )}

      <div className='relative' style={{ width: "100%", height: "200px" }}>
        <svg ref={svgRef} width='100%' height='100%' className='overflow-visible' />
      </div>

      <button
        onClick={handleToggleWaves}
        disabled={loading}
        className='mt-4 bg-[#1DB954] hover:bg-[#1ED760] text-spotify-gray-300 font-bold py-2 px-4 rounded-full w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {loading ? "Cargando..." : showCombined ? "Mostrar Ondas Originales" : "Combinar Ondas"}
      </button>
    </div>
  );
};

export default IndiceDeInterferencia;

"use client";

import React, { useState } from "react";

// Datos del gráfico
const COLORS = ["#1dafb9", "#1ed760", "#ffa600", "#ff6b00"];
const SEASONS = ["Invierno", "Primavera", "Verano", "Otoño"];

const DonutChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Cálculo de ángulos para cada segmento
  const data = [
    { name: "Invierno", value: 25 },
    { name: "Primavera", value: 25 },
    { name: "Verano", value: 25 },
    { name: "Otoño", value: 25 },
  ];

  const radius = 100; // Radio del gráfico
  const innerRadius = 70; // Radio interno del "donut"
  const expandedRadius = 120; // Radio cuando el segmento está resaltado

  // Función para calcular el path de un segmento
  const calculatePath = (startAngle: number, endAngle: number, isHovered: boolean) => {
    const r = isHovered ? expandedRadius : radius;

    const x1 = r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = r * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${innerRadius * Math.cos((endAngle * Math.PI) / 180)} ${innerRadius * Math.sin((endAngle * Math.PI) / 180)}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${
        innerRadius * Math.cos((startAngle * Math.PI) / 180)
      } ${innerRadius * Math.sin((startAngle * Math.PI) / 180)}
      Z
    `;
  };

  // Calcular los segmentos
  const segments = data.map((item, index) => {
    const startAngle = (index * 360) / data.length; // Inicio del segmento
    const endAngle = ((index + 1) * 360) / data.length; // Final del segmento
    const isHovered = index === hoveredIndex;

    return (
      <path
        key={index}
        d={calculatePath(startAngle, endAngle, isHovered)}
        fill={COLORS[index]}
        stroke='#fff'
        strokeWidth='2'
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      />
    );
  });

  return (
    <div
      className='flex flex-col items-center'
      style={{
        width: "600px", // Reducir: mueve a la izquierda; aumentar: mueve a la derecha
        height: "300px",
      }}
    >
      <svg
        width='300'
        height='300'
        viewBox='-150 -150 300 300'
        style={{
          overflow: "visible", // Permite que los segmentos salgan del área fija
        }}
      >
        {segments}
      </svg>
      {hoveredIndex !== null && (
        <div
          className='mt-4 text-lg font-medium'
          style={{
            width: "300px",
            height: "40px",
            textAlign: "center",
          }}
        >
          Estás sobre: {SEASONS[hoveredIndex]}
        </div>
      )}
    </div>
  );
};

export default DonutChart;

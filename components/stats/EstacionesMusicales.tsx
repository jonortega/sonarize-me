"use client";

import React, { useState } from "react";
import { Sun, Snowflake, Flower, Leaf } from "lucide-react";

// Datos del gráfico
const COLORS = ["#1dafb9", "#1ed760", "#ffa600", "#ff6b00"];
const SEASONS = ["Invierno", "Primavera", "Verano", "Otoño"];
// eslint-disable-next-line react/jsx-key
const ICONS = [<Snowflake />, <Flower />, <Sun />, <Leaf />];

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
  const innerRadius = 60; // Radio interno del "donut"
  const expandedRadius = 130; // Radio cuando el segmento está resaltado

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

  const rotationOffset = -135; // Girar el gráfico

  // Calcular los segmentos
  const segments = data.map((item, index) => {
    const startAngle = rotationOffset + (index * 360) / data.length; // Inicio del segmento
    const endAngle = rotationOffset + ((index + 1) * 360) / data.length; // Final del segmento
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
        style={{
          transition: "d 0.2s ease-in-out", // Animación suave
        }}
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

        {/* Mostrar el ícono centrado si hay un segmento seleccionado */}
        {hoveredIndex !== null && (
          <g transform='translate(0, 0)'>
            <foreignObject x='-30' y='-30' width='60' height='60'>
              <div
                className='flex items-center justify-center w-full h-full text-center'
                style={{
                  transform: "scale(1.5)", // Aumenta el tamaño del ícono
                  color: COLORS[hoveredIndex], // Cambia el color al del segmento
                }}
              >
                {ICONS[hoveredIndex]}
              </div>
            </foreignObject>
          </g>
        )}
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

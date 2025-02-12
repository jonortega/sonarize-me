/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import StatCard from "@/components/StatCard";

describe("StatCard Component", () => {
  const mockOnClick = jest.fn();
  const mockStat = {
    title: "Hall of Fame",
    iconName: "Award" as const,
    className: "custom-class",
    statId: "hall-of-fame",
    onClick: mockOnClick,
  };

  it("se renderiza correctamente con el título", () => {
    render(<StatCard {...mockStat} />);
    expect(screen.getByText("Hall of Fame")).toBeInTheDocument();
  });

  it("renderiza el icono correctamente", () => {
    render(<StatCard {...mockStat} />);
    const svgElement = screen.getByTestId("stat-icon-hall-of-fame"); // ✅ Selección mejorada
    expect(svgElement).toBeInTheDocument();
  });

  it("llama a `onClick` con el `statId` correcto cuando se hace clic", () => {
    render(<StatCard {...mockStat} />);
    fireEvent.click(screen.getByTestId("stat-card-hall-of-fame")); // ✅ Se usa `data-testid`
    expect(mockOnClick).toHaveBeenCalledWith("hall-of-fame");
  });

  it("aplica la clase `className` correctamente", () => {
    render(<StatCard {...mockStat} />);
    const statCardElement = screen.getByTestId("stat-card-hall-of-fame"); // ✅ Se usa `data-testid`
    expect(statCardElement).toHaveClass("custom-class");
  });
});

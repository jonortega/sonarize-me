/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import StatsGrid from "@/components/StatsGrid";

// Mock de `StatCard`
jest.mock("@/components/StatCard", () => {
  const MockStatCard = ({
    title,
    statId,
    onClick,
  }: {
    title: string;
    statId: string;
    onClick: (id: string) => void;
  }) => (
    <button data-testid={`stat-${statId}`} onClick={() => onClick(statId)}>
      {title}
    </button>
  );
  MockStatCard.displayName = "MockStatCard";
  return MockStatCard;
});

const mockStats = [
  { id: "hall-of-fame", title: "Hall of Fame", iconName: "Award" as const },
  { id: "tus-decadas", title: "Tus Décadas", iconName: "Rewind" as const },
  { id: "huella-del-dia", title: "Huella del Día", iconName: "Fingerprint" as const },
];

describe("StatsGrid Component", () => {
  it("se renderiza correctamente", () => {
    render(<StatsGrid stats={mockStats} onStatClick={jest.fn()} />);
    expect(screen.getByTestId("stat-hall-of-fame")).toBeInTheDocument();
    expect(screen.getByTestId("stat-tus-decadas")).toBeInTheDocument();
    expect(screen.getByTestId("stat-huella-del-dia")).toBeInTheDocument();
  });

  it("llama a `onStatClick` con el id correcto cuando se hace clic en un StatCard", () => {
    const mockOnClick = jest.fn();
    render(<StatsGrid stats={mockStats} onStatClick={mockOnClick} />);

    fireEvent.click(screen.getByTestId("stat-hall-of-fame"));
    expect(mockOnClick).toHaveBeenCalledWith("hall-of-fame");

    fireEvent.click(screen.getByTestId("stat-tus-decadas"));
    expect(mockOnClick).toHaveBeenCalledWith("tus-decadas");
  });

  it("maneja correctamente una lista vacía de stats sin errores", () => {
    render(<StatsGrid stats={[]} onStatClick={jest.fn()} />);
    expect(screen.queryByTestId("stat-hall-of-fame")).not.toBeInTheDocument();
  });
});

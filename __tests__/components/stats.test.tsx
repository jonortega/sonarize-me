/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Stats from "@/app/(navigables)/stats/page";

// ✅ Mock de StatsGrid
jest.mock("@/components/StatsGrid", () => {
  const MockStatsGrid = ({
    stats,
    onStatClick,
  }: {
    stats: { id: string; title: string }[];
    onStatClick: (id: string) => void;
  }) => (
    <div data-testid='stats-grid'>
      {stats.map((stat) => (
        <button key={stat.id} onClick={() => onStatClick(stat.id)} data-testid={`stat-${stat.id}`}>
          {stat.title}
        </button>
      ))}
    </div>
  );
  MockStatsGrid.displayName = "MockStatsGrid";
  return MockStatsGrid;
});

// ✅ Mock de StatWrapper
jest.mock("@/components/StatWrapper", () => {
  const MockStatWrapper = ({
    activeStat,
    isOpen,
    onClose,
  }: {
    activeStat: string;
    isOpen: boolean;
    onClose: () => void;
  }) => (
    <div data-testid='stat-wrapper' style={{ display: isOpen ? "block" : "none" }}>
      {activeStat && <p>Mostrando estadísticas de {activeStat}</p>}
      <button onClick={onClose} data-testid='close-modal'>
        Cerrar
      </button>
    </div>
  );
  MockStatWrapper.displayName = "MockStatWrapper";
  return MockStatWrapper;
});

describe("Stats Page", () => {
  it("renderiza el título correctamente", () => {
    render(<Stats />);
    expect(screen.getByText("Estadísticas Avanzadas")).toBeInTheDocument();
  });

  it("renderiza `StatsGrid` con los elementos esperados", () => {
    render(<Stats />);
    expect(screen.getByTestId("stats-grid")).toBeInTheDocument();
    expect(screen.getByTestId("stat-hall-of-fame")).toBeInTheDocument();
    expect(screen.getByTestId("stat-tus-decadas")).toBeInTheDocument();
    expect(screen.getByTestId("stat-huella-del-dia")).toBeInTheDocument();
  });

  it("abre el modal con la estadística seleccionada al hacer clic en un stat", () => {
    render(<Stats />);

    // Simula clic en "Hall of Fame"
    fireEvent.click(screen.getByTestId("stat-hall-of-fame"));

    // Verifica que el modal está abierto con el contenido correcto
    expect(screen.getByTestId("stat-wrapper")).toBeVisible();
    expect(screen.getByText("Mostrando estadísticas de hall-of-fame")).toBeInTheDocument();
  });

  it("cierra el modal cuando se hace clic en el botón de cierre", () => {
    render(<Stats />);

    // Simula clic en "Hall of Fame"
    fireEvent.click(screen.getByTestId("stat-hall-of-fame"));

    // Simula clic en el botón "Cerrar"
    fireEvent.click(screen.getByTestId("close-modal"));

    // Verifica que el modal ha desaparecido
    expect(screen.getByTestId("stat-wrapper")).not.toBeVisible();
  });
});

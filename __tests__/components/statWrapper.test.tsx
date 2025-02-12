/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StatWrapper from "@/components/StatWrapper";

jest.mock("@/components/stats/HallOfFame", () => {
  const MockComponent = () => <div data-testid='stat-hall-of-fame'>Hall of Fame</div>;
  MockComponent.displayName = "MockHallOfFame";
  return MockComponent;
});

jest.mock("@/components/stats/EstacionesMusicales", () => {
  const MockComponent = () => <div data-testid='stat-estaciones-musicales'>Estaciones Musicales</div>;
  MockComponent.displayName = "MockEstacionesMusicales";
  return MockComponent;
});

jest.mock("@/components/stats/HuellaDelDia", () => {
  const MockComponent = () => <div data-testid='stat-huella-del-dia'>Huella Del Día</div>;
  MockComponent.displayName = "MockHuellaDelDia";
  return MockComponent;
});

jest.mock("@/components/stats/LaBitacora", () => {
  const MockComponent = () => <div data-testid='stat-la-bitacora'>La Bitácora</div>;
  MockComponent.displayName = "MockLaBitacora";
  return MockComponent;
});

jest.mock("@/components/stats/TusDecadas", () => {
  const MockComponent = () => <div data-testid='stat-tus-decadas'>Tus Décadas</div>;
  MockComponent.displayName = "MockTusDecadas";
  return MockComponent;
});

jest.mock("@/components/stats/IndiceDeInterferencia", () => {
  const MockComponent = () => <div data-testid='stat-indice-de-interferencia'>Índice de Interferencia</div>;
  MockComponent.displayName = "MockIndiceDeInterferencia";
  return MockComponent;
});

describe("StatWrapper Component", () => {
  it("no se renderiza cuando `isOpen` es `false`", () => {
    render(<StatWrapper activeStat='hall-of-fame' isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("se renderiza correctamente cuando `isOpen` es `true`", async () => {
    render(<StatWrapper activeStat='hall-of-fame' isOpen={true} onClose={jest.fn()} />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("muestra el título correcto basado en `activeStat`", async () => {
    render(<StatWrapper activeStat='hall-of-fame' isOpen={true} onClose={jest.fn()} />);
    expect(await screen.findByText("Hall Of Fame")).toBeInTheDocument();
  });

  it("renderiza el componente dinámico correcto", async () => {
    render(<StatWrapper activeStat='huella-del-dia' isOpen={true} onClose={jest.fn()} />);
    expect(await screen.findByTestId("stat-huella-del-dia")).toBeInTheDocument();
  });

  it("muestra un mensaje cuando `activeStat` es inválido", async () => {
    render(<StatWrapper activeStat='invalid-stat' isOpen={true} onClose={jest.fn()} />);
    expect(await screen.findByText("Selecciona una estadística válida para ver los detalles.")).toBeInTheDocument();
  });

  it("cierra el modal al hacer clic en el botón de cierre", async () => {
    const mockOnClose = jest.fn();
    render(<StatWrapper activeStat='hall-of-fame' isOpen={true} onClose={mockOnClose} />);

    const closeButton = await screen.findByRole("button", { name: "Cerrar" });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("desmonta correctamente el contenido cuando el modal se cierra", async () => {
    const { rerender } = render(<StatWrapper activeStat='hall-of-fame' isOpen={true} onClose={jest.fn()} />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    rerender(<StatWrapper activeStat='hall-of-fame' isOpen={false} onClose={jest.fn()} />);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("muestra mensaje de error cuando se selecciona una estadística no válida", async () => {
    render(<StatWrapper activeStat='stat-inexistente' isOpen={true} onClose={jest.fn()} />);
    expect(await screen.findByText("Selecciona una estadística válida para ver los detalles.")).toBeInTheDocument();
  });

  it("muestra el componente de Hall of Fame cuando se selecciona", async () => {
    render(<StatWrapper activeStat='hall-of-fame' isOpen={true} onClose={jest.fn()} />);
    expect(await screen.findByTestId("stat-hall-of-fame")).toBeInTheDocument();
  });

  it("muestra el componente de Huella Del Día cuando se selecciona", async () => {
    render(<StatWrapper activeStat='huella-del-dia' isOpen={true} onClose={jest.fn()} />);
    expect(await screen.findByTestId("stat-huella-del-dia")).toBeInTheDocument();
  });
});

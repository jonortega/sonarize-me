/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { useRouter, useSearchParams } from "next/navigation";

// Mock de useRouter y useSearchParams
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("TimeRangeSelector", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("time_range=short_term"));
  });

  it("muestra el valor seleccionado correctamente", () => {
    render(<TimeRangeSelector />);

    expect(screen.getByText("Este Mes")).toBeInTheDocument(); // Verifica el valor inicial
  });

  it("abre el menú al hacer clic en el botón y muestra las opciones", () => {
    render(<TimeRangeSelector />);

    const button = screen.getByRole("button", { name: /Este Mes/i });
    fireEvent.click(button);

    expect(screen.getByText("Últimos 6 Meses")).toBeInTheDocument();
    expect(screen.getByText("Todo el Año")).toBeInTheDocument();
  });

  it("cierra el menú al hacer clic fuera", () => {
    render(<TimeRangeSelector />);

    const button = screen.getByRole("button", { name: /Este Mes/i });
    fireEvent.click(button);
    expect(screen.getByText("Últimos 6 Meses")).toBeInTheDocument();

    fireEvent.mouseDown(document.body); // Simula clic fuera
    expect(screen.queryByText("Últimos 6 Meses")).not.toBeInTheDocument();
  });

  it("actualiza el parámetro de la URL al seleccionar una opción", () => {
    render(<TimeRangeSelector />);

    const button = screen.getByRole("button", { name: /Este Mes/i });
    fireEvent.click(button);

    const option = screen.getByRole("button", { name: /Últimos 6 Meses/i });
    fireEvent.click(option);

    expect(pushMock).toHaveBeenCalledWith("/home?time_range=medium_term", { scroll: false });
  });

  it("cierra el menú al seleccionar una opción", () => {
    render(<TimeRangeSelector />);

    const button = screen.getByRole("button", { name: /Este Mes/i });
    fireEvent.click(button);
    fireEvent.click(screen.getByRole("button", { name: /Últimos 6 Meses/i }));

    expect(screen.queryByText("Últimos 6 Meses")).not.toBeInTheDocument();
  });
});

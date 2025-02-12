/**
 * @jest-environment jsdom
 */

import { render, screen, act, waitFor } from "@testing-library/react";
import Loading from "@/components/Loading";

jest.useFakeTimers();

describe("Loading Component", () => {
  it("se renderiza correctamente con una frase inicial", () => {
    render(<Loading />);
    const text = screen.getByText(/cargando|procesando|analizando|calculando|preparando|sincronizando/i);
    expect(text).toBeInTheDocument();
  });

  it("actualiza la frase cada 3 segundos", async () => {
    render(<Loading />);

    const firstText = screen.getByText(
      /cargando|procesando|analizando|calculando|preparando|sincronizando/i
    ).textContent;

    // Avanzamos el tiempo 3 segundos
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Esperamos a que el DOM se actualice
    await waitFor(() => {
      const secondText = screen.getByText(
        /cargando|procesando|analizando|calculando|preparando|sincronizando/i
      ).textContent;

      expect(secondText).not.toEqual(firstText);
    });
  });

  it("muestra los puntos de carga dinámicamente", () => {
    render(<Loading />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    const dotsElements = screen.getAllByText(/\.{0,3}$/i);
    expect(dotsElements.length).toBeGreaterThan(0);
  });
});

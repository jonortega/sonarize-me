/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LaBitacora from "@/components/stats/LaBitacora";

jest.spyOn(console, "error").mockImplementation(() => {});

describe("LaBitacora Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ "2020": 150, "2021": 120 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
  });

  it("renderiza correctamente el componente", async () => {
    render(<LaBitacora />);
    expect(screen.getByText("Canciones Guardadas por Año")).toBeInTheDocument();
  });

  it("cambia el nivel al hacer clic en una barra del gráfico", async () => {
    render(<LaBitacora />);
    await waitFor(() => expect(screen.getByText("Canciones Guardadas por Año")).toBeInTheDocument());
    fireEvent.click(screen.getByText("2020"));
    await waitFor(() => expect(screen.getByText(/Canciones Guardadas en el Año 2020/i)).toBeInTheDocument());
  });

  it("retrocede de nivel al hacer clic en 'Volver'", async () => {
    render(<LaBitacora />);
    await waitFor(() => expect(screen.getByText("Canciones Guardadas por Año")).toBeInTheDocument());
    fireEvent.click(screen.getByText("2020"));
    await waitFor(() => expect(screen.getByText(/Canciones Guardadas en el Año 2020/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText("Volver a Año"));
    await waitFor(() => expect(screen.getByText("Canciones Guardadas por Año")).toBeInTheDocument());
  });

  it("realiza una petición a la API para obtener los datos", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ "2020": 150, "2021": 120 }),
      })
    ) as jest.Mock;
    render(<LaBitacora />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith("/api/stats/la-bitacora", { credentials: "include" });
  });

  it("maneja errores en la llamada a la API", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Error en la API")));
    render(<LaBitacora />);
    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });
});

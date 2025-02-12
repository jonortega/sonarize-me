/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HallOfFame from "@/components/stats/HallOfFame";
import { useFetch } from "@/lib/useFetch";
import html2canvas from "html2canvas";

// Mock de `useFetch`
jest.mock("@/lib/useFetch", () => ({
  useFetch: jest.fn(),
}));

// Mock de `html2canvas`
jest.mock("html2canvas", () => jest.fn(() => Promise.resolve(document.createElement("canvas"))));
jest.spyOn(window, "alert").mockImplementation(() => {});

beforeEach(() => {
  (useFetch as jest.Mock).mockReturnValue({
    data: { albums: [{ albumArtUrl: "/test.jpg", track: "Test Song", artist: "Test Artist" }] },
    loading: false,
    error: null,
  });
});

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false, // Simula un fallo en la API
    })
  ) as jest.Mock;
});

describe("HallOfFame Component", () => {
  const mockAlbums = [
    { albumArtUrl: "/test-album-1.jpg", track: "Test Song 1", artist: "Test Artist 1" },
    { albumArtUrl: "/test-album-2.jpg", track: "Test Song 2", artist: "Test Artist 2" },
  ];

  // 1. Renderiza correctamente cuando `useFetch` devuelve datos
  it("renderiza correctamente cuando hay datos", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: { albums: mockAlbums }, loading: false, error: null });

    render(<HallOfFame />);

    expect(screen.getByText("Test Song 1")).toBeInTheDocument();
    expect(screen.getByText("Test Artist 1")).toBeInTheDocument();
    expect(screen.getByText("Test Song 2")).toBeInTheDocument();
    expect(screen.getByText("Test Artist 2")).toBeInTheDocument();
  });

  // 3. Muestra un mensaje de error si `useFetch` devuelve un error
  it("muestra un mensaje de error si `useFetch` devuelve un error", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: null, loading: false, error: "Error de API" });

    render(<HallOfFame />);

    expect(screen.getByText("Error de API")).toBeInTheDocument();
  });

  // 4. `handleCreatePlaylist()` deshabilita el botón y llama a `html2canvas`
  it("deshabilita el botón y llama a `html2canvas` cuando se hace clic en `Crear playlist`", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: { albums: [{ albumArtUrl: "/test.jpg", track: "Test Song", artist: "Test Artist" }] },
      loading: false,
      error: null,
    });

    const { container } = render(<HallOfFame />);

    // Asegurar que gridRef.current no es null
    const gridElement = container.querySelector(".grid");
    expect(gridElement).not.toBeNull();

    const button = screen.getByRole("button", { name: /crear playlist/i });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(html2canvas).toHaveBeenCalled();
    });
  });

  // 5. Muestra un spinner en el botón mientras `isCreating` es `true`
  it("muestra un spinner en el botón mientras `isCreating` es `true`", async () => {
    (useFetch as jest.Mock).mockReturnValue({ data: { albums: mockAlbums }, loading: false, error: null });

    render(<HallOfFame />);

    fireEvent.click(screen.getByRole("button", { name: /crear playlist/i }));

    expect(await screen.findByText("Creando playlist...")).toBeInTheDocument();
  });

  // 6. Maneja un error si la API de creación de playlist falla
  it("muestra un mensaje de error si la API de creación de playlist falla", async () => {
    render(<HallOfFame />);

    const button = await screen.findByRole("button", { name: /crear playlist/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("No se pudo crear la playlist. Por favor, inténtalo de nuevo.");
    });
  });
});

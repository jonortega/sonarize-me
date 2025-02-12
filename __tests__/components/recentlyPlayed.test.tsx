/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import { useFetch } from "@/lib/useFetch";

// Mock de `useFetch`
jest.mock("@/lib/useFetch");

const mockTracks = [
  {
    id: "1",
    name: "Song 1",
    artist: "Artist 1",
    album: "Album 1",
    albumArtUrl: "/img1.jpg",
    playedAt: "Hace 2 minutos",
  },
  {
    id: "2",
    name: "Song 2",
    artist: "Artist 2",
    album: "Album 2",
    albumArtUrl: "/img2.jpg",
    playedAt: "Hace 5 minutos",
  },
];

describe("RecentlyPlayed Component", () => {
  it("se renderiza correctamente con el título 'Recently Played'", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: [], loading: false, error: null });

    render(<RecentlyPlayed />);
    expect(screen.getByRole("heading", { name: /recently played/i })).toBeInTheDocument();
  });

  it("muestra el mensaje de carga cuando está cargando", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: [], loading: true, error: null });

    render(<RecentlyPlayed />);
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("muestra un mensaje de error cuando ocurre un error", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: [], loading: false, error: "Error al obtener datos" });

    render(<RecentlyPlayed />);
    expect(screen.getByText("Error al obtener datos")).toBeInTheDocument();
  });

  it("muestra canciones cuando hay datos disponibles", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: mockTracks, loading: false, error: null });

    render(<RecentlyPlayed />);
    expect(screen.getByText("Song 1")).toBeInTheDocument();
    expect(screen.getByText("Artist 1")).toBeInTheDocument();
    expect(screen.getByText("Album 1")).toBeInTheDocument();
    expect(screen.getByText("Hace 2 minutos")).toBeInTheDocument();
  });

  it("muestra un mensaje cuando no hay canciones recientes", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: [], loading: false, error: null });

    render(<RecentlyPlayed />);
    expect(screen.getByText("No hay canciones reproducidas recientemente disponibles.")).toBeInTheDocument();
  });

  it("cambia entre mostrar más y mostrar menos correctamente", () => {
    // Simular 12 canciones en la lista
    const longMockTracks = [...mockTracks, ...mockTracks, ...mockTracks, ...mockTracks, ...mockTracks, ...mockTracks];

    (useFetch as jest.Mock).mockReturnValue({ data: longMockTracks, loading: false, error: null });

    render(<RecentlyPlayed />);
    expect(screen.getAllByText(/song/i)).toHaveLength(10); // Inicialmente solo muestra 10

    // Hacer clic en "Mostrar Más"
    fireEvent.click(screen.getByRole("button", { name: /mostrar más/i }));
    expect(screen.getAllByText(/song/i)).toHaveLength(12); // Ahora muestra todas

    // Hacer clic en "Mostrar Menos"
    fireEvent.click(screen.getByRole("button", { name: /mostrar menos/i }));
    expect(screen.getAllByText(/song/i)).toHaveLength(10); // Vuelve a mostrar 10
  });
});

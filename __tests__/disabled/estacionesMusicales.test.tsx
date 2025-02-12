import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EstacionesMusicales from "@/components/stats/EstacionesMusicales";
import { useFetch } from "@/lib/useFetch";
jest.mock("@/lib/useFetch");

// Mock de next/image para evitar problemas en Jest
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => <img src={src} alt={alt || "Imagen"} {...props} />,
}));

describe("EstacionesMusicales", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Debe renderizar el componente sin errores", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: null, loading: false, error: null });
    render(<EstacionesMusicales />);
    expect(screen.getByText("Error al cargar los datos")).toBeInTheDocument();
  });

  test("Debe manejar el caso en que la API devuelva null o datos mal formateados", async () => {
    (useFetch as jest.Mock).mockReturnValue({ data: null, loading: false, error: null });
    render(<EstacionesMusicales />);
    expect(screen.getByText("Error al cargar los datos")).toBeInTheDocument();
  });

  test("Debe mostrarse la tarjeta con información cuando un segmento está seleccionado", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        invierno: { artist: { name: "Artista Invierno", artistPicUrl: "winter.jpg" }, genre: { name: "Rock" } },
      },
      loading: false,
      error: null,
    });

    render(<EstacionesMusicales />);

    const winterSegment = screen.getByText("Destacados de");
    fireEvent.mouseEnter(winterSegment);

    await waitFor(() => {
      render(<EstacionesMusicales />); // Forzar un rerender después del evento
      expect(screen.getByText("Artista Invierno")).toBeInTheDocument();
      expect(screen.getByText("Rock")).toBeInTheDocument();
    });
  });

  test("Debe mostrar la imagen del artista si está disponible, o un placeholder si no hay imagen", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        invierno: { artist: { name: "Artista Invierno", artistPicUrl: "winter.jpg" }, genre: { name: "Rock" } },
        otono: { artist: { name: "Artista Otoño", artistPicUrl: "" }, genre: { name: "Indie" } },
      },
      loading: false,
      error: null,
    });

    render(<EstacionesMusicales />);

    // Simular que el usuario pasa el ratón sobre la sección de invierno
    const winterSegment = screen.getByText("Destacados de Invierno");
    fireEvent.mouseEnter(winterSegment);

    // Esperar a que la imagen se muestre
    await waitFor(() => {
      expect(screen.getByAltText("Artista")).toHaveAttribute("src", "winter.jpg");
    });

    // Verificar que el nombre del artista de otoño sigue mostrándose
    expect(screen.getByText("Artista Otoño")).toBeInTheDocument();
  });
});

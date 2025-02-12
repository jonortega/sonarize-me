import { render, screen } from "@testing-library/react";
import TusDecadas from "@/components/stats/TusDecadas";
import { useFetch } from "@/lib/useFetch";
import "@testing-library/jest-dom";

// Mock de la función useFetch
jest.mock("@/lib/useFetch", () => ({
  useFetch: jest.fn(),
}));

jest.mock("react-konva", () => {
  const mockKonva = jest.requireActual("react-konva");
  return {
    ...mockKonva,
    Stage: (props: { children: React.ReactNode }) => <div data-testid='konva-stage'>{props.children}</div>,
    Layer: (props: { children: React.ReactNode }) => <div data-testid='konva-layer'>{props.children}</div>,
    // eslint-disable-next-line @next/next/no-img-element
    Image: () => <img data-testid='konva-image' alt='' />,
    Text: (props: { text: string }) => <span data-testid='decade-text'>{props.text}</span>, // 🔹 Ahora detectable en el DOM
  };
});

describe("TusDecadas Component", () => {
  it("se renderiza sin errores", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: {}, loading: false, error: null });

    const { container } = render(<TusDecadas />);
    expect(container).toBeInTheDocument();
  });

  it("muestra mensaje de error cuando la API falla", () => {
    const mockError = new Error("Error de carga");
    (useFetch as jest.Mock).mockReturnValue({ data: null, loading: false, error: mockError });

    render(<TusDecadas />);
    expect(screen.getByText(/Error al cargar los datos/i)).toBeInTheDocument();
    expect(screen.getByText(/Error de carga/i)).toBeInTheDocument();
  });

  it("muestra correctamente las etiquetas de las décadas según los datos de la API", async () => {
    const mockTracksByYear = {
      1980: [{ id: "1", albumPicUrl: "http://example.com/album1.jpg", year: 1980 }],
      1995: [{ id: "2", albumPicUrl: "http://example.com/album2.jpg", year: 1995 }],
      2005: [{ id: "3", albumPicUrl: "http://example.com/album3.jpg", year: 2005 }],
    };

    (useFetch as jest.Mock).mockReturnValue({ data: mockTracksByYear, loading: false, error: null });

    render(<TusDecadas />);

    const decades = screen.getAllByTestId("decade-text").map((el) => el.textContent);

    expect(decades).toContain("1980");
    expect(decades).toContain("1990");
    expect(decades).toContain("2000");
  });

  //   it("ajusta la escala al hacer zoom con la rueda del ratón", () => {
  //     (useFetch as jest.Mock).mockReturnValue({ data: {}, loading: false, error: null });

  //     const { getByTestId } = render(<TusDecadas />);
  //     const stage = getByTestId("konva-stage");

  //     // Obtener la escala inicial
  //     const initialTransform = stage.style.transform;

  //     // Simula un evento de zoom hacia adelante (acercar)
  //     fireEvent.wheel(stage, { deltaY: -100 });

  //     // Verificar que la transformación cambió (indicando zoom)
  //     expect(stage.style.transform).not.toBe(initialTransform);
  //   });
});

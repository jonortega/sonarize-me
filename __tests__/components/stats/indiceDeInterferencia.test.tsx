import { render } from "@testing-library/react";
import IndiceDeInterferencia from "@/components/stats/IndiceDeInterferencia";
import { useFetch } from "@/lib/useFetch";
import "@testing-library/jest-dom";

jest.mock("@/lib/useFetch");

jest.mock("d3", () => ({
  select: jest.fn(() => ({
    append: jest.fn(() => ({
      attr: jest.fn(() => ({
        attr: jest.fn(() => ({
          attr: jest.fn(() => ({
            attr: jest.fn(),
            node: jest.fn(() => ({ getTotalLength: jest.fn(() => 100) })),
          })),
        })),
      })),
    })),
    selectAll: jest.fn(() => ({
      remove: jest.fn(),
      transition: jest.fn(() => ({
        duration: jest.fn(() => ({
          attr: jest.fn(() => ({
            transition: jest.fn(() => ({
              duration: jest.fn(() => ({
                attr: jest.fn(),
              })),
            })),
          })),
        })),
      })),
    })),
  })),
  scaleLinear: jest.fn(() => ({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  })),
  line: jest.fn(() => ({
    x: jest.fn(() => ({
      y: jest.fn(() => ({
        curve: jest.fn(),
      })),
    })),
  })),
  curveBasis: jest.fn(),
}));

// Mock de D3 específicamente para scaleLinear()
jest.mock("d3-scale", () => ({
  scaleLinear: jest.fn(() => ({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  })),
}));

describe("IndiceDeInterferencia Component", () => {
  it("se renderiza sin errores", () => {
    (useFetch as jest.Mock).mockReturnValue({ data: null, loading: true, error: null });
    const { container } = render(<IndiceDeInterferencia />);
    expect(container).toBeInTheDocument();
  });

  //   it("muestra los valores de 'Frecuencia Habitual' y 'Frecuencia del Momento' correctamente", () => {
  //     (useFetch as jest.Mock).mockReturnValue({
  //       data: { normal: 50, actual: 70 },
  //       loading: false,
  //       error: null,
  //     });

  //     render(<IndiceDeInterferencia />);

  //     expect(screen.getByText("Frecuencia Habitual")).toBeInTheDocument();
  //     expect(screen.getByText("50")).toBeInTheDocument();
  //     expect(screen.getByText("Frecuencia del Momento")).toBeInTheDocument();
  //     expect(screen.getByText("70")).toBeInTheDocument();
  //   });

  //   it("verifica que el botón para alternar ondas se renderiza con el texto correcto", () => {
  //     (useFetch as jest.Mock).mockReturnValue({
  //       data: { normal: 50, actual: 70 },
  //       loading: false,
  //       error: null,
  //     });

  //     render(<IndiceDeInterferencia />);

  //     const toggleButton = screen.getByRole("button", { name: "Combinar Ondas" });
  //     expect(toggleButton).toBeInTheDocument();
  //   });

  //   it("permite alternar entre mostrar ondas originales y combinadas", async () => {
  //     (useFetch as jest.Mock).mockReturnValue({
  //       data: { normal: 50, actual: 70 },
  //       loading: false,
  //       error: null,
  //     });

  //     render(<IndiceDeInterferencia />);

  //     const toggleButton = screen.getByRole("button", { name: "Combinar Ondas" });
  //     expect(toggleButton).toBeInTheDocument();

  //     fireEvent.click(toggleButton);
  //     await waitFor(() => expect(toggleButton).toHaveTextContent("Mostrar Ondas Originales"));

  //     fireEvent.click(toggleButton);
  //     await waitFor(() => expect(toggleButton).toHaveTextContent("Combinar Ondas"));
  //   });
});

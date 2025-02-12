import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HuellaDelDia from "@/components/stats/HuellaDelDia";
import { useFetch } from "@/lib/useFetch";
import { Line } from "react-chartjs-2";

// Mock de useFetch
jest.mock("@/lib/useFetch", () => ({
  useFetch: jest.fn(),
}));

// Mock de Chart.js
jest.mock("react-chartjs-2", () => ({
  Line: jest.fn((props) => {
    console.log("Llamada a Line con props:", JSON.stringify(props, null, 2));
    return <div data-testid='chart-mock' />;
  }),
}));

describe("HuellaDelDia Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("verifica que las etiquetas del eje X van de '00:00' a '23:00'", () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: Array(24).fill(0),
      loading: false,
      error: null,
    });

    render(<HuellaDelDia />);

    const lineCall = (Line as jest.Mock).mock.calls[0][0]; // Primera llamada a Line
    const expectedLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

    expect(lineCall.data.labels).toEqual(expectedLabels);
  });

  it("comprueba que el gráfico recibe los datos correctos cuando useFetch devuelve datos válidos", () => {
    const mockData = [10, 20, 30, 40, 50, 60, 30, 10, 5, 0, 15, 25, 35, 45, 55, 60, 50, 40, 30, 20, 10, 5, 0, 0];

    (useFetch as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<HuellaDelDia />);

    const lineCall = (Line as jest.Mock).mock.calls[0][0]; // Primera llamada a Line
    expect(lineCall.data.datasets[0].data).toEqual(mockData);
  });

  it("verifica que el gráfico muestra un punto destacado en la hora con más minutos escuchados", () => {
    const mockData = [5, 10, 15, 60, 20, 30, 40, 50, 60, 20, 10, 5, 0, 5, 15, 25, 35, 45, 55, 60, 50, 40, 30, 20];

    (useFetch as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<HuellaDelDia />);

    const lineCall = (Line as jest.Mock).mock.calls[0][0];
    const maxIndex = mockData.indexOf(Math.max(...mockData));

    expect(lineCall.data.datasets[1].data[maxIndex]).toBe(mockData[maxIndex]);
    expect(lineCall.data.datasets[1].data.filter((v: null) => v !== null).length).toBe(1); // Solo debe haber un valor diferente de null
  });

  it("verifica que el texto debajo del gráfico muestra correctamente la hora con más escuchas", () => {
    const mockData = [5, 10, 15, 60, 20, 30, 40, 50, 60, 20, 10, 5, 0, 5, 15, 25, 35, 45, 55, 60, 50, 40, 30, 20];

    (useFetch as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<HuellaDelDia />);

    const maxIndex = mockData.indexOf(Math.max(...mockData));
    const maxHour = `${maxIndex.toString().padStart(2, "0")}:00`;

    // 1️⃣ Verificar la parte del texto que es fija
    expect(
      screen.getByText((content) => content.includes("El momento del día que más música escuchas es a las"))
    ).toBeInTheDocument();

    // 2️⃣ Verificar que la hora específica está en su propio span
    expect(screen.getByText(maxHour)).toBeInTheDocument();
  });
});

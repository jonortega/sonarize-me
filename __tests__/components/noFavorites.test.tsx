/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import NoFavorites from "@/components/NoFavorites";

describe("NoFavorites Component", () => {
  it("se renderiza correctamente con el mensaje adecuado", () => {
    render(<NoFavorites />);
    expect(
      screen.getByText("No puedes ver esta estadística porque no tienes canciones guardadas en favoritos.")
    ).toBeInTheDocument();
    expect(screen.getByText("Añade algunas canciones y vuelve a intentarlo.")).toBeInTheDocument();
  });

  it("muestra el icono de advertencia", () => {
    render(<NoFavorites />);
    expect(screen.getByTestId("warning-icon")).toBeInTheDocument(); // Ahora busca el icono correctamente
  });
});

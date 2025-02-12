/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("se renderiza correctamente", () => {
    render(<Footer />);
    expect(screen.getByText("Spotify Stats 2025")).toBeInTheDocument();
  });

  it("contiene enlaces de redes sociales", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
  });

  it("el modal de Política de Privacidad está cerrado al inicio", () => {
    render(<Footer />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abre el modal de Política de Privacidad al hacer clic", async () => {
    render(<Footer />);

    const button = screen.getByRole("button", { name: /política de privacidad/i });

    await userEvent.click(button);

    expect(await screen.findByRole("heading", { name: /política de privacidad/i })).toBeInTheDocument();
  });

  it("cierra el modal al hacer clic en 'Cerrar'", async () => {
    render(<Footer />);
    const button = screen.getByRole("button", { name: /política de privacidad/i });

    await userEvent.click(button);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /cerrar/i });
    await userEvent.click(closeButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

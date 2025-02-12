/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserActionPanel from "@/components/UserActionPanel";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";

// Mock de useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("UserActionPanel Component", () => {
  const mockUser: User = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    imageUrl: "/test-image.jpg",
  };

  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente la imagen y el nombre del usuario", () => {
    render(<UserActionPanel user={mockUser} />);

    // Verifica que la imagen está en el documento por su alt text
    const image = screen.getByAltText(mockUser.name);
    expect(image).toBeInTheDocument();
  });

  it("abre y cierra el panel de usuario al hacer clic", () => {
    render(<UserActionPanel user={mockUser} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Cuenta:")).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText("Cuenta:")).not.toBeInTheDocument();
  });

  it("cierra el panel al hacer clic fuera", () => {
    render(<UserActionPanel user={mockUser} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Cuenta:")).toBeInTheDocument();

    fireEvent.mouseDown(document.body); // Simula un clic fuera del panel

    expect(screen.queryByText("Cuenta:")).not.toBeInTheDocument();
  });

  it("ejecuta el logout y redirige al usuario a la página principal", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      } as Response)
    );

    render(<UserActionPanel user={mockUser} />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Log out"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout"));
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("muestra un error en la consola si el logout falla", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false } as Response));

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<UserActionPanel user={mockUser} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Log out"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout"));

    expect(errorSpy).toHaveBeenCalledWith("Error al hacer logout:", expect.any(Error));

    errorSpy.mockRestore();
  });
});

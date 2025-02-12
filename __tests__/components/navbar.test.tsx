/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { User } from "@/lib/types";
import { usePathname } from "next/navigation";

// Mock de `UserActionPanel`
jest.mock("@/components/UserActionPanel", () => ({
  __esModule: true,
  default: ({ user }: { user: User }) => <div data-testid='user-action-panel'>{user.name}</div>,
}));

// Mock de `usePathname()` de Next.js
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUser: User = {
  id: "123",
  name: "Test User",
  email: "test@example.com",
  imageUrl: "test-image.jpg",
};

describe("Navbar Component", () => {
  describe("Renderizado", () => {
    it("renderiza correctamente la barra de navegación", () => {
      render(<Navbar user={mockUser} />);

      expect(screen.getByText("Spotify Stats")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Stats" })).toBeInTheDocument();
      expect(screen.getByTestId("user-action-panel")).toBeInTheDocument();
    });
  });

  describe("Links de navegación", () => {
    it("muestra el enlace Home como activo cuando la ruta es /home", () => {
      (usePathname as jest.Mock).mockReturnValue("/home");
      render(<Navbar user={mockUser} />);

      expect(screen.getByRole("link", { name: "Home" })).toHaveClass("bg-spotify-green text-spotify-gray-300");
    });

    it("muestra el enlace Stats como activo cuando la ruta es /stats", () => {
      (usePathname as jest.Mock).mockReturnValue("/stats");
      render(<Navbar user={mockUser} />);

      expect(screen.getByRole("link", { name: "Stats" })).toHaveClass("bg-spotify-green text-spotify-gray-300");
    });

    it("muestra el enlace Home como inactivo cuando la ruta NO es /home", () => {
      (usePathname as jest.Mock).mockReturnValue("/stats");
      render(<Navbar user={mockUser} />);

      expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("bg-spotify-green text-spotify-gray-300");
    });
  });

  describe("UserActionPanel", () => {
    it("pasa correctamente el usuario al UserActionPanel", () => {
      render(<Navbar user={mockUser} />);

      expect(screen.getByTestId("user-action-panel")).toHaveTextContent(mockUser.name);
    });
  });
});

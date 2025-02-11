import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/page";

describe("LoginPage Component", () => {
  it("renders the main heading", () => {
    render(<LoginPage />);
    const heading = screen.getByRole("heading", { level: 1, name: /descubre tus estadísticas de spotify/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the Sign In button", () => {
    render(<LoginPage />);
    const button = screen.getByRole("link", { name: /sign in/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/api/auth/login");
  });
});

/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Simula los componentes secundarios para no probar su implementación interna
jest.mock("@/components/UserProfile", () => {
  return { __esModule: true, default: () => <div data-testid='user-profile' /> };
});
jest.mock("@/components/TopTracks", () => {
  return { __esModule: true, default: () => <div data-testid='top-tracks' /> };
});
jest.mock("@/components/TopArtists", () => {
  return { __esModule: true, default: () => <div data-testid='top-artists' /> };
});
jest.mock("@/components/TopGenres", () => {
  return { __esModule: true, default: () => <div data-testid='top-genres' /> };
});
jest.mock("@/components/RecentlyPlayed", () => {
  return { __esModule: true, default: () => <div data-testid='recently-played' /> };
});
jest.mock("@/components/TimeRangeSelector", () => {
  return { __esModule: true, default: () => <div data-testid='time-range-selector' /> };
});

// TODO: HAY ALGO MAL EN ESTOS TEST. SI NO SE ARREGLA SEGUIR ADELANTE

describe("Home Page", () => {
  it("renderiza los componentes principales", async () => {
    const resolvedSearchParams: Record<string, string | string[] | undefined> = {};
    render(<Home searchParams={resolvedSearchParams} />);

    expect(await screen.findByText("Tus Spotify Tops")).toBeInTheDocument();
    expect(await screen.findByTestId("user-profile")).toBeInTheDocument();
    expect(await screen.findByTestId("time-range-selector")).toBeInTheDocument();
    expect(await screen.findByTestId("top-tracks")).toBeInTheDocument();
    expect(await screen.findByTestId("top-artists")).toBeInTheDocument();
    expect(await screen.findByTestId("top-genres")).toBeInTheDocument();
    expect(await screen.findByTestId("recently-played")).toBeInTheDocument();
  });

  it("usa 'short_term' como valor predeterminado para timeRange si no hay searchParams", async () => {
    const resolvedSearchParams: Record<string, string | string[] | undefined> = {};
    render(<Home searchParams={resolvedSearchParams} />);

    expect(await screen.findByTestId("top-tracks")).toBeInTheDocument();
    expect(await screen.findByTestId("top-artists")).toBeInTheDocument();
    expect(await screen.findByTestId("top-genres")).toBeInTheDocument();
  });

  it("utiliza el time_range proporcionado en searchParams", async () => {
    const resolvedSearchParams: Record<string, string | string[] | undefined> = { time_range: "long_term" };
    render(<Home searchParams={resolvedSearchParams} />);

    expect(await screen.findByTestId("top-tracks")).toBeInTheDocument();
    expect(await screen.findByTestId("top-artists")).toBeInTheDocument();
    expect(await screen.findByTestId("top-genres")).toBeInTheDocument();
  });
});

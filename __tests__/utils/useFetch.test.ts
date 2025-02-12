/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "@/lib/useFetch";

global.fetch = jest.fn();

describe("useFetch Hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("devuelve datos correctamente cuando la API responde con éxito", async () => {
    const mockData = [{ id: "1", name: "Mock Track" }];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch("/api/home/recently-played"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("maneja correctamente un error en la petición (error de red)", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetch("/api/home/recently-played"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.");
  });

  it("devuelve un error si la respuesta de la API no es exitosa", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useFetch("/api/home/recently-played"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.");
  });

  it("cancela la petición cuando el componente se desmonta", async () => {
    const abortSpy = jest.spyOn(global.AbortController.prototype, "abort");

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: "1", name: "Mock Track" }],
    });

    const { unmount } = renderHook(() => useFetch("/api/home/recently-played"));

    unmount();

    expect(abortSpy).toHaveBeenCalledTimes(1);
  });
});

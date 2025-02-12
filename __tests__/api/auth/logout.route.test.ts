/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler"; // 🔹 Debe ser el primer import
import * as appHandler from "@/app/api/auth/logout/route";

describe("API /auth/logout", () => {
  it("debe redirigir al usuario a '/' después del logout", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(307);

        // 🔹 Verifica que la URL de redirección contiene "/"
        const locationHeader = res.headers.get("location");
        expect(locationHeader).toBeDefined();
        expect(new URL(locationHeader!).pathname).toBe("/"); // ✅ Ahora compara la ruta correctamente
      },
    });
  });

  it("debe eliminar las cookies access_token y refresh_token correctamente", async () => {
    await testApiHandler({
      appHandler,
      requestPatcher: (req) => {
        req.headers.append("cookie", "access_token=mock_token; refresh_token=mock_refresh_token");
      },
      test: async ({ fetch }) => {
        const res = await fetch();

        const setCookieHeader = res.headers.get("set-cookie");
        expect(setCookieHeader).toBeDefined();
        expect(setCookieHeader).toContain("access_token=;");
        expect(setCookieHeader).toContain("refresh_token=;");
        expect(setCookieHeader).toContain("Max-Age=0"); // ✅ Verifica que las cookies han sido eliminadas
      },
    });
  });
});

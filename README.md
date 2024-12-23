# TFG-app-Spotify

Este es el repositorio del proyecto del Trabajo de Fin de Grado (TFG). Es una aplicación web desarrollada con **Next.js**, **TypeScript**, y **Tailwind CSS**, que utiliza la API de Spotify para mostrar estadísticas personalizadas del usuario. La [memoria del TFG](https://github.com/mi-usuario/TFG-memoria) se encuentra en este repositorio separado.

---

## 🚀 Tecnologías utilizadas
- **Next.js** 15.1.2
- **TypeScript**
- **Tailwind CSS** 3.4.1
- **pnpm**
- **Jest**
- **Spotify Web API**

---

## 📂 Estructura del proyecto
- **`app/`**: Contiene las páginas y rutas principales de la aplicación (usando el App Router).
- **`components/`**: Componentes reutilizables de la interfaz.
- **`public/`**: Archivos estáticos (favicon, imágenes, etc.).
- **`__tests__/`**: Archivos para pruebas unitarias (usando Jest y Testing Library).
- **`tailwind.config.js`**: Configuración de Tailwind CSS.
- **`next.config.ts`**: Configuración de Next.js.
- **`.env.local`**: Variables de entorno para desarrollo (claves API, etc.).

---

## 🛠️ Configuración inicial
1. Clona este repositorio:
```bash
git clone https://github.com/jonortega/tfg-app-spotify.git
cd tfg-app-spotify
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Crea un archivo `.env.local` en la raíz con las siguientes variables:
```bash
SPOTIFY_CLIENT_ID=tu_cliente_id
SPOTIFY_CLIENT_SECRET=tu_secreto
...
```

4. Inicia el servidor de desarrollo:
```bash
pnpm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

---

## 📊 Funcionalidades principales
- **Inicio de sesión con Spotify**: Autenticación mediante OAuth 2.0.
- **Dashboard interactivo**: Gráficos que muestran estadísticas como:
  - Artistas más escuchados.
  - Canción del mes.
  - Horas de más escucha.
- **Comparación de canciones**: Visualización de características como `danceability`, `energy`, etc.
- **Tendencias de escucha**: Datos históricos de tus hábitos musicales.

---

## 🧪 Pruebas
1. Ejecuta las pruebas unitarias:
```bash
pnpm run test
```

2. Ejecuta las pruebas en modo watch:
```bash
pnpm run test -- --watch
```

---

## 🚀 Despliegue
El proyecto está alojado en **Vercel**. Cada push al branch principal (**main**) actualiza automáticamente la aplicación.

1. Configura las variables de entorno en el panel de Vercel:
   - **SPOTIFY_CLIENT_ID**
   - **SPOTIFY_CLIENT_SECRET**
   - ...

2. La URL de producción será generada automáticamente por Vercel.

---

## 📚 Recursos
- [Documentación de Next.js](https://nextjs.org/docs)
- [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

<h1 align="center">TFG-app-Spotify</h1>

<p align="center">
  Proyecto del Trabajo de Fin de Grado (TFG): Aplicación web para visualizar estadísticas personalizadas de Spotify usando Next.js. <a href="https://github.com/mi-usuario/TFG-memoria">Memoria del TFG</a>
</p>

<div align="center">

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) &nbsp;
  ![React](https://img.shields.io/badge/React-19-%2300d8ff?logo=react) &nbsp;
  [![Spotify API](https://img.shields.io/badge/Spotify%20API-v1-%231ED760?logo=spotify)](https://developer.spotify.com/documentation/web-api/) &nbsp;
  ![Version](https://img.shields.io/badge/version-0.1.0-%23ffffff) &nbsp;
  ![Status](https://img.shields.io/badge/status-in%20development-orange)

</div>

## 📋 Índice
0. [📋 Índice](#-índice)
1. [🚀 Tecnologías utilizadas](#-tecnologías-utilizadas)
2. [📂 Estructura del proyecto](#-estructura-del-proyecto)
3. [🛠️ Configuración inicial](#️-configuración-inicial)
4. [📊 Funcionalidades principales](#-funcionalidades-principales)
5. [🧪 Pruebas](#-pruebas)
6. [🚀 Despliegue](#-despliegue)
7. [📚 Recursos](#-recursos)

## 🚀 Tecnologías utilizadas
- **Next.js** 15.1.2
- **React** 19.0.0
- **TypeScript** 5.0.0
- **Tailwind CSS** 3.4.1
- **Node.js** 22.12.0
- **Jest** 29.7.0
- **Spotify Web API**
- **pnpm**

## 📂 Estructura del proyecto
- **`app/`**: Contiene las páginas y rutas principales de la aplicación (usando el App Router).
- **`components/`**: Componentes reutilizables de la interfaz.
- **`public/`**: Archivos estáticos (favicon, imágenes, etc.).
- **`__tests__/`**: Archivos para pruebas unitarias (usando Jest y Testing Library).
- **`tailwind.config.js`**: Configuración de Tailwind CSS.
- **`next.config.ts`**: Configuración de Next.js.
- **`.env.local`**: Variables de entorno para desarrollo (claves API, etc.).

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

## 📊 Funcionalidades principales
- **Inicio de sesión con Spotify**: Autenticación mediante OAuth 2.0.
- **Dashboard interactivo**: Gráficos que muestran estadísticas como:
  - Artistas más escuchados.
  - Canción del mes.
  - Horas de más escucha.
- **Comparación de canciones**: Visualización de características como `danceability`, `energy`, etc.
- **Tendencias de escucha**: Datos históricos de tus hábitos musicales.

## 🧪 Pruebas
1. Ejecuta las pruebas unitarias:
```bash
pnpm run test
```

2. Ejecuta las pruebas en modo watch:
```bash
pnpm run test -- --watch
```

## 🚀 Despliegue
El proyecto está alojado en **Vercel**. Cada push al branch principal (**main**) actualiza automáticamente la aplicación.

1. Configura las variables de entorno en el panel de Vercel:
   - **SPOTIFY_CLIENT_ID**
   - **SPOTIFY_CLIENT_SECRET**
   - ...

2. La URL de producción será generada automáticamente por Vercel.

## 📚 Recursos
- [Documentación de Next.js](https://nextjs.org/docs)
- [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

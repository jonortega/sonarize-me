<h1 align="center">TFG-app-Spotify</h1>

<p align="center">
  Proyecto del Trabajo de Fin de Grado (TFG): Aplicación web para visualizar estadísticas personalizadas de Spotify usando Next.js. <a href="https://github.com/jonortega/TFG-memoria">Memoria del TFG</a>
</p>

<div align="center">

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) &nbsp;
  [![React](https://img.shields.io/badge/React-19-%2300d8ff?logo=react)](https://es.react.dev/) &nbsp;
  [![Spotify API](https://img.shields.io/badge/Spotify%20API-v1-%231ED760?logo=spotify)](https://developer.spotify.com/documentation/web-api/) &nbsp;
  ![Version](https://img.shields.io/badge/version-0.1.0-%23ffffff) &nbsp;
  ![Status](https://img.shields.io/badge/status-in%20development-orange)

</div>

## Descripción General
**TFG-app-Spotify** es una aplicación web que permite a los usuarios visualizar estadísticas avanzadas y originales sobre su actividad en **Spotify**.  
Utiliza **Next.js 15**, **React 19**, y la **Spotify Web API** para obtener datos en tiempo real, ofreciendo gráficos interactivos y una interfaz optimizada.

## Demo: **[tfg-app-spotify.vercel.app](https://tfg-app-spotify.vercel.app/)** 🔗

## Funcionalidades
✅ **Inicio de sesión con Spotify** mediante OAuth 2.0  
✅ **Visualización de estadísticas en gráficos interactivos**  

### 🎧 **Estadísticas Básicas**
- 📌 **Top Tracks**  
- 🎤 **Top Artists** 
- 🎵 **Top Genres** 
- 🕒 **Recently Played**

### 📊 **Estadísticas Avanzadas**
- 🏆 **Hall of Fame**: Canciones y artistas más escuchados en toda tu historia de Spotify.  
- ⏳ **Huella del Día**: Distribución de minutos escuchados a lo largo del día.  
- 📅 **Estaciones Musicales**: Artista y género favoritos por cada estación del año.
- 🎶 **Tus Décadas**: Descubre de qué décadas proviene la mayor parte de tu música.  
- 📜 **La Bitácora**: Registro completo de las fechas de guardado de las canciones en favoritos.  
- 📡 **Índice de Interferencia**: Nivel de sincronía actual con tus gustos históricos.  

### 🎛 **Estadísticas Interactivas**
- 📊 **Gráficos dinámicos**: Filtra y explora tus datos en tiempo real.  
- 📌 **Interfaz responsiva y optimizada** para distintos dispositivos.  

### 🔒 **Privacidad y Seguridad**
✅ **Logout seguro**: Se eliminan todos los datos de sesión al cerrar sesión.  
✅ **Sin almacenamiento permanente**: La aplicación no guarda datos del usuario después de cerrar sesión.  

## Capturas de Pantalla

<p align="center">
  <img src="public/images/login.png" alt="Pantalla de Login" width="800">
</p>

### Home y Stats

| Home (Stats Básicas)                                      | Stats (Stats Avanzadas)                                     |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| <img src="public/images/home.png" alt="Home" width="400"> | <img src="public/images/stats.png" alt="Stats" width="500"> |

### Stats: Estadísticas Avanzadas

| **Estaciones Musicales**                                                                  | **Hall of Fame**                                                          |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| <img src="public/images/estaciones_musicales.png" alt="Estaciones Musicales" width="400"> | <img src="public/images/hall_of_fame.png" alt="Hall of Fame" width="400"> |

| **Huella del Día**                                                            | **Índice de Interferencia**                                                                     |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| <img src="public/images/huella_del_dia.png" alt="Huella del Día" width="400"> | <img src="public/images/indice_de_interferencia.png" alt="Índice de Interferencia" width="400"> |

| **La Bitácora**                                                                     | **Tus Décadas**                                                                 |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| <img src="public/images/la_bitacora_año.png" alt="La Bitácora del Año" width="400"> | <img src="public/images/tus_decadas_out.png" alt="Tus Décadas Out" width="400"> |

## Stack Tecnológico

| Tecnología          | Versión |
| ------------------- | ------- |
| **Next.js**         | 15.1.2  |
| **React**           | 19.0.0  |
| **TypeScript**      | 5.0.0   |
| **Tailwind CSS**    | 3.4.1   |
| **Node.js**         | 22.12.0 |
| **Jest**            | 29.7.0  |
| **Spotify Web API** | v1      |
| **pnpm**            | -       |
| **Vercel**          | -       |
| **ESLint**          | -       |

## 🤝 Contribuir
Si quieres mejorar el proyecto:

1. **Haz un fork** del repo
2. Crea una **nueva rama** (`feature/nueva-funcionalidad`)
3. **Haz un PR** explicando los cambios

## 📩 Contacto
Si tienes preguntas, puedes contactarme en:  
💼 **[LinkedIn: Jon Ortega](https://www.linkedin.com/in/jon-ortega-g/)**

## 📜 Licencia y Uso
Este proyecto está licenciado bajo **Creative Commons BY-NC 4.0**, lo que significa que cualquiera  
puede usarlo y modificarlo siempre que **NO sea con fines comerciales**.

⚠️ **Nota sobre la Licencia**  
El propietario de este software **se reserva el derecho de modificar la licencia en el futuro**.  
Esto significa que nuevas versiones del software podrían distribuirse bajo una licencia comercial  
o con nuevas condiciones de uso.

Para más detalles, consulta el archivo [LICENSE](./LICENSE).

<h1 align="center">Sonarize Me</h1>

<p align="center">
  Continuación del proyecto académico <a href="https://github.com/jonortega/tfg-app-spotify">jonortega/tfg-app-spotify</a>.  
  Esta es la nueva versión oficial de la aplicación, enfocada en ofrecer estadísticas avanzadas y originales sobre tu actividad en Spotify, con vistas a estar lista para producción.
</p>

<div align="center">

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) &nbsp;
  [![React](https://img.shields.io/badge/React-19-%2300d8ff?logo=react)](https://es.react.dev/) &nbsp;
  [![Spotify API](https://img.shields.io/badge/Spotify%20API-v1-%231ED760?logo=spotify)](https://developer.spotify.com/documentation/web-api/) &nbsp;
  ![Version](https://img.shields.io/badge/version-0.1.0-%23ffffff) &nbsp;
  ![Status](https://img.shields.io/badge/status-in%20development-orange)

</div>

## Descripción General
**Sonarize Me** es una aplicación web que permite a los usuarios visualizar estadísticas avanzadas y originales sobre su actividad en **Spotify**.  
Utiliza **Next.js 15**, **React 19**, y la **Spotify Web API** para obtener datos en tiempo real, ofreciendo gráficos interactivos y una interfaz optimizada.

## Demo: 🔗 [https://sonarize-me.vercel.app/](https://sonarize-me.vercel.app/)


## Funcionalidades

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
- 🎶 **Tus Décadas**: Décadas principales de tu música.  
- 📜 **La Bitácora**: Registro completo de las fechas de guardado de las canciones en favoritos.  
- 📡 **Índice de Interferencia**: Nivel de sincronía actual con tus gustos históricos.  

### 🔒 **Privacidad y Seguridad**
✅ **Login con Spotify** mediante OAuth 2.0.  
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

## 📩 Contacto
Si tienes preguntas, puedes contactarme en:  
💼 **[LinkedIn: Jon Ortega](https://www.linkedin.com/in/jon-ortega-g/)**

## 📜 Licencia y Uso
Este proyecto está licenciado bajo la **MIT License**, lo que significa que cualquiera  
puede usarlo, modificarlo y distribuirlo, incluso con fines comerciales, siempre que se mantenga la nota de copyright original.

Para más detalles, consulta el archivo [LICENSE](./LICENSE).

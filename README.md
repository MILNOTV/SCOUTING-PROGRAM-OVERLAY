# SCOUTING PROGRAM OVERLAY

Overlay inferior para OBS diseñado para Milno TV / RedStars.

## Archivos

- `index.html`: estructura del overlay.
- `style.css`: diseño rojo, negro y dorado.
- `script.js`: actualización automática.
- `data.json`: marcador, bateador y lineup de prueba.

## Probarlo en la PC

Por seguridad del navegador, se recomienda abrirlo con un servidor local.

### Opción sencilla con Python

1. Abre la carpeta del proyecto.
2. Haz clic en la barra de dirección del Explorador.
3. Escribe `cmd` y presiona Enter.
4. Ejecuta:

```bash
python -m http.server 8000
```

5. Abre en Chrome:

```text
http://localhost:8000
```

## Subirlo a GitHub

1. Descomprime el ZIP.
2. En GitHub entra al repositorio `SCOUTING-PROGRAM-OVERLAY`.
3. Pulsa `Add file`.
4. Pulsa `Upload files`.
5. Sube estos archivos, no la carpeta ZIP:
   - index.html
   - style.css
   - script.js
   - data.json
   - README.md
6. Pulsa `Commit changes`.

## Activar GitHub Pages

1. En el repositorio entra en `Settings`.
2. En el menú izquierdo entra en `Pages`.
3. En `Build and deployment`, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. Pulsa `Save`.
5. GitHub mostrará la dirección pública del overlay.

## Añadirlo a OBS

1. En OBS pulsa `+` en Fuentes.
2. Selecciona `Navegador`.
3. Pega la dirección pública de GitHub Pages.
4. Ancho recomendado: `1920`.
5. Alto recomendado: `180`.
6. Activa `Actualizar navegador cuando la escena se active`.

## Cambiar las estadísticas manualmente

Abre `data.json` en GitHub, pulsa el lápiz, cambia los valores y guarda con `Commit changes`.

El overlay revisa los datos cada 5 segundos.

## Conectar Google Sheets después

`script.js` ya está preparado para usar una dirección JSON externa.

Cuando tengamos el enlace de la hoja publicada, se coloca aquí:

```js
remoteJsonUrl: "AQUI_VA_EL_ENLACE"
```

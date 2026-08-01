# SCOUTING PROGRAM OVERLAY v3

Conectado directamente a la pestaña `TICKER` de Google Sheets.

## Estructura requerida en la hoja

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| orden | jugador | hoy | AVG | PTS | actual |

- `hoy`: hits del jugador.
- `actual`: escribe `1` en la fila del bateador actual.
- Debe haber solamente un `1` en la columna `actual`.

## Actualización

El overlay consulta Google Sheets cada 5 segundos.

## Archivos que debes subir o reemplazar en GitHub

- `index.html`
- `style.css`
- `script.js`

No es necesario subir el ZIP.

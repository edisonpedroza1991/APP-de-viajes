# Europa 2026 🧳

App web para organizar el viaje de Edison, Bryan, Alejandro y Heidy por París, Bruselas y Ámsterdam (octubre 2026). Pantalla de inicio con un botón grande por país (con foto); al tocarlo se abre el detalle con vuelos, hotel, cómo llegar y actividades.

## Fotos de portada

Las fotos de cada país (`cover` en `data/trip.js`) son de **Wikimedia Commons**, licencia CC BY-SA 3.0 — por eso cada vista de detalle muestra el crédito del autor. Se cargan desde internet, así que si no hay señal la primera vez que se abre esa pantalla, no se ven (el resto de la app no depende de internet). Cuando tengan fotos propias del viaje en `assets/fotos/`, se pueden usar esas en vez de las de Wikimedia editando el campo `cover` de cada ciudad.

## Cómo actualizar el itinerario

Todo el contenido vive en **`data/trip.js`**. No hace falta tocar HTML/CSS/JS para agregar o corregir información:

- Cambia fechas, vuelos, trenes, hoteles, direcciones directamente en ese archivo.
- Marca `confirmed: true` o `confirmed: false` según el estado real de cada reserva.
- Agrega actividades dentro del arreglo `activities` de cada ciudad.
- Agrega cosas a la lista `pending` mientras no estén confirmadas — aparecen en la sección "Pendientes".

## Datos privados (teléfonos, números de reserva)

Este repo es **público**, así que `data/trip.js` nunca debe tener teléfonos, números de reserva ni apellidos completos — solo lo que cualquiera del grupo puede ver sin problema (fechas, vuelos, nombre y dirección de los hoteles).

Los datos sensibles reales viven en `data/trip.private.js`, un archivo que **no se sube a GitHub** (está en `.gitignore`). Para tenerlo en tu computadora:

```bash
cp data/trip.private.example.js data/trip.private.js
```

y completa ahí el teléfono / número de reserva reales. La app lo detecta solo y completa esos datos en las tarjetas; si no existe, muestra un aviso genérico ("consulta el chat del grupo") en vez del dato.

## Cómo ver la app

Es un sitio estático, no necesita instalación:

```bash
open index.html
```

o, para probarla como si estuviera publicada:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicarla (GitHub Pages)

Repo: https://github.com/edisonpedroza1991/APP-de-viajes

1. En **Settings → Pages**, elegir la rama `main` y carpeta `/ (root)`.
2. La app queda disponible en `https://edisonpedroza1991.github.io/APP-de-viajes/`.

Como el repo es público, cualquiera con el link puede entrar — por eso los datos sensibles quedan fuera del repo (ver sección de arriba). Lo que sí es visible para cualquiera: nombres de pila del grupo, vuelos/trenes/bus, nombres y direcciones de los hoteles.

## Estructura

```
index.html                    estructura de la página
css/style.css                 estilos (paleta azul / negro / blanco)
js/app.js                     lógica que pinta todo a partir de data/trip.js
data/trip.js                  información pública del viaje (edita aquí)
data/trip.private.example.js  plantilla de los datos sensibles (sí se sube)
data/trip.private.js          datos sensibles reales (NO se sube, cada uno lo crea localmente)
assets/fotos/                 fotos del grupo o de los destinos
```

## Pendiente por agregar

- Vuelo/tren de Edison hasta París.
- Tour en París (sin reservar).
- Actividades en Bruselas y Ámsterdam.
- Fotos del grupo / destinos en `assets/fotos/`.

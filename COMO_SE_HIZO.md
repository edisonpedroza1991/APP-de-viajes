# Cómo se hizo esta app (y qué comandos de git se usaron)

Este documento explica, paso a paso, qué se construyó y qué comandos de terminal/git se usaron para dejarlo en GitHub. La idea es que te sirva para entender el flujo, no solo tener la app funcionando.

---

## 1. Qué se construyó

Una app web **estática**: solo HTML, CSS y JavaScript, sin backend, sin base de datos, sin instalar nada (ni `npm`, ni frameworks). Se eligió así porque:

- No necesita servidor: se puede abrir el `index.html` directo o subir a GitHub Pages gratis.
- Es fácil de entender el flujo completo (no hay "magia" de un framework).
- Encaja con el objetivo: algo simple, versionado en git, que ustedes puedan seguir editando.

**Cómo está dividido el código** (separación de contenido vs. diseño vs. lógica):

```
index.html        la estructura de la página (los "huecos" donde va el contenido)
css/style.css     todo el diseño visual (colores azul/negro/blanco, tarjetas, etc.)
js/app.js         la lógica: lee los datos y arma el HTML dinámicamente
data/trip.js      TODA la información real del viaje (vuelos, hoteles, fechas...)
```

La razón de separar `data/trip.js` del resto: para agregar el tour de París o cambiar una fecha, **solo tocas ese archivo**. `app.js` lee ese objeto de JavaScript y construye las tarjetas automáticamente — por eso la app es "dinámica": no hay HTML escrito a mano por cada vuelo u hotel, se genera solo.

---

## 2. Cómo funciona por dentro (idea general, sin tecnicismos)

1. El navegador carga `index.html`.
2. `index.html` carga primero `data/trip.js` (los datos) y después `js/app.js` (el código que dibuja).
3. `app.js` tiene una función `init()` que se ejecuta apenas carga la página. Esa función:
   - Escribe el título y los nombres de viajeros.
   - Calcula el countdown (días/horas/min hasta el 2 de octubre) y lo actualiza cada minuto.
   - Recorre el arreglo `TRIP.cities` (París, Bruselas, Ámsterdam) y por cada ciudad arma las tarjetas de transporte, hotel, cómo llegar y actividades.
   - Pinta la lista de "Pendientes".
4. Un `IntersectionObserver` detecta qué ciudad estás mirando al hacer scroll y resalta ese botón en el menú de arriba.

---

## 3. Comandos de git usados, en orden y explicados

### Paso 1 — Crear el repositorio local

```bash
mkdir -p ~/Proyectos/Viaje-Europa-2026/{css,js,data,assets/fotos}
cd ~/Proyectos/Viaje-Europa-2026
git init
```

- `mkdir -p` crea todas las carpetas del proyecto de una vez.
- `git init` convierte esa carpeta en un repositorio git: crea una carpeta oculta `.git/` donde git va a guardar todo el historial de cambios. En este punto **todavía no hay nada subido a ningún lado**, es solo local.

### Paso 2 — Crear los archivos

Se crearon `index.html`, `css/style.css`, `js/app.js`, `data/trip.js`, `README.md`, `.gitignore` y `assets/fotos/.gitkeep` (un archivo vacío que existe solo para que git no ignore una carpeta vacía, ya que git no versiona carpetas vacías por sí solas).

### Paso 3 — Ver qué cambió: `git status`

```bash
git status
```

Muestra qué archivos son nuevos, cuáles se modificaron y cuáles ya están "listos para commit". Es el comando que más vas a usar — siempre antes de un `add` o un `commit` para saber en qué estado estás.

### Paso 4 — Preparar los archivos: `git add`

```bash
git add .gitignore README.md assets css data index.html js
```

`git add` mueve archivos al **"staging area"** (una zona intermedia): le dice a git "estos son los cambios que quiero incluir en el próximo commit". Se listaron los archivos explícitamente (en vez de `git add .`) para tener control total de qué se sube — buena práctica para no subir algo por accidente (como un archivo con contraseñas).

### Paso 5 — Guardar el punto en la historia: `git commit`

```bash
git commit -m "Primer commit: app de itinerario para viaje Europa 2026

Sitio estático (HTML/CSS/JS, sin dependencias) que renderiza el
itinerario del viaje..."
```

Un **commit** es una "foto" del proyecto en ese momento, con un mensaje que explica qué cambió y por qué. Cada commit queda guardado para siempre en el historial (a menos que lo borres a propósito). El mensaje se escribió en dos partes: una línea corta de título, y después el detalle — es la convención más usada en git.

### Paso 6 — Revisar el historial: `git log`

```bash
git log --oneline
```

Lista los commits, uno por línea, con un código corto (hash) y el título. Sirve para ver la historia del proyecto de un vistazo.

### Paso 7 — Crear el repo en GitHub y subirlo: `gh repo create`

```bash
gh auth status
gh repo create APP-de-viajes --private --source=. --remote=origin --push
```

- `gh` es la herramienta de línea de comandos de GitHub (ya la tenías autenticada).
- `gh auth status` confirma que la sesión de GitHub sigue activa antes de hacer nada.
- `gh repo create APP-de-viajes --private --source=. --remote=origin --push` hace **cuatro cosas en un solo comando**:
  1. Crea el repositorio `APP-de-viajes` en tu cuenta de GitHub, como **privado** (`--private`) — porque el itinerario tiene datos como teléfonos y números de reserva.
  2. Usa la carpeta actual como fuente (`--source=.`).
  3. Conecta tu repo local con el de GitHub bajo el nombre `origin` (`--remote=origin`) — `origin` es simplemente el apodo estándar que se le da al repositorio remoto principal.
  4. Sube todo lo que tenías commiteado (`--push`).

Si no hubieras usado `gh`, el equivalente en git puro habría sido:

```bash
git remote add origin git@github.com:edisonpedroza1991/APP-de-viajes.git
git push -u origin main
```

(`gh` simplemente automatiza la creación del repo + estos dos comandos.)

### Paso 8 — Verificar que quedó bien

```bash
gh repo view edisonpedroza1991/APP-de-viajes
git log --oneline origin/main
git status
```

- `gh repo view` muestra la info del repo remoto (para confirmar que existe y tiene el contenido esperado).
- `git log --oneline origin/main` muestra el historial **tal como quedó en GitHub**, no en tu copia local — así confirmas que de verdad se subió.
- `git status` con "up to date with origin/main" confirma que no quedó nada pendiente de subir.

Para una verificación más estricta, se clonó el repo en una carpeta aparte (`git clone`) y se probó la app desde esa copia limpia — así queda garantizado que lo que ves en GitHub funciona igual que en tu máquina, y no solo "en mi computadora funciona".

### Paso 9 — Segundo cambio: corregir el README

```bash
git add README.md
git commit -m "Corregir URL de GitHub Pages y avisar sobre repo privado..."
git push
```

Este es el ciclo que vas a repetir cada vez que edites algo (por ejemplo, cuando agregues el tour de París a `data/trip.js`):

1. Edita el archivo.
2. `git add <archivo>` (o el nombre del archivo que cambiaste).
3. `git commit -m "mensaje explicando qué cambió"`.
4. `git push` (sube el commit a GitHub).

`git push` sin `-u origin main` la primera vez porque esa relación ("esta rama local sigue a esta rama remota") ya había quedado configurada en el paso 7.

---

## 4. Resumen del flujo básico de git (para memorizar)

```
editar archivo
     ↓
git status        → ver qué cambió
     ↓
git add <archivo> → preparar el cambio
     ↓
git commit -m ".." → guardarlo en el historial local
     ↓
git push          → subirlo a GitHub
```

Y para ver el historial en cualquier momento: `git log --oneline`.

---

## 5. Hacer el repo público sin exponer datos sensibles

Cuando decidimos pasar el repo de privado a público, apareció un problema: el itinerario tenía el teléfono del hotel de Bruselas y el número de reserva de Ámsterdam directamente en `data/trip.js`. Editar el archivo hoy **no alcanza**, porque esos datos ya estaban guardados en commits anteriores — y en GitHub cualquiera puede ver versiones viejas de un archivo (pestaña "History"), aunque hoy lo hayas corregido.

### La solución: separar datos públicos de datos privados

- `data/trip.js` → información pública (fechas, vuelos, nombre/dirección de hoteles). Se sube a git normalmente.
- `data/trip.private.js` → teléfonos y números de reserva reales. Se agregó a `.gitignore`, así que git **nunca lo sube**, ni ahora ni en el futuro — queda solo en tu computadora.
- `data/trip.private.example.js` → una plantilla vacía (sin datos reales) que sí se sube, para que cualquiera que clone el repo sepa qué archivo crear y con qué forma.
- En `js/app.js` se agregó `applyPrivateOverrides()`: si existe `trip.private.js`, completa los datos sensibles encima de los públicos. Si no existe, la app funciona igual pero muestra un aviso genérico en vez del dato.

**Qué es `.gitignore` y por qué importa:** es un archivo de texto donde cada línea es un patrón de archivos que git debe ignorar por completo — ni los ve en `git status`, ni los deja agregar con `git add` (salvo que forces). Es la herramienta correcta para "este archivo debe existir en mi máquina pero jamás en el repositorio": credenciales, contraseñas, `.env`, y en este caso, datos personales.

### Por qué hubo que reiniciar el historial de git

Como los datos sensibles ya estaban en 3 commits viejos, la única forma de sacarlos por completo del repositorio (no solo del archivo actual) era **reescribir el historial**. Con solo 3 commits y sin nadie más colaborando en el repo, la forma más simple fue:

```bash
rm -rf .git              # borra todo el historial local (los archivos del proyecto no se tocan)
git init                 # empieza un historial nuevo, desde cero
git add <archivos>
git commit -m "..."      # ahora el primer commit ya nace sin datos sensibles
git remote add origin git@github.com:edisonpedroza1991/APP-de-viajes.git
git push --force origin main   # sobreescribe todo lo que había en GitHub
```

`git push --force` es un comando **peligroso** en general: reemplaza el historial remoto por el tuyo, y si alguien más ya hubiera bajado el repo, perdería la sincronía. Solo se usó aquí porque el repo era nuevo, sin colaboradores, y era la forma más simple de garantizar que ningún commit viejo con datos sensibles quedara accesible antes de hacerlo público. En un repo con más gente trabajando, la herramienta correcta para esto es `git filter-repo` (reescribe el historial quitando archivos/strings puntuales sin perder el resto), pero es mucho más compleja de lo que este proyecto necesitaba.

Después de esto, se cambió la visibilidad del repo con:

```bash
gh repo edit edisonpedroza1991/APP-de-viajes --visibility public --accept-visibility-change-consequences
```

**Lección para el futuro:** pensar *antes* del primer commit qué datos van a ser sensibles, y separarlos desde el día uno. Arreglarlo después siempre es más trabajo (como acabamos de ver).

---

## 6. Rediseño: pantalla de inicio por país, fotos y tipografía

Se pasó de una sola página con scroll infinito a una app con "pantallas": una **portada** con un botón grande por país (con foto de fondo) y, al tocarlo, una **vista de detalle** con toda la info de ese destino. Esto se hizo sin librerías, con lo que se llama un "router" muy simple:

- `window.location.hash` (la parte después del `#` en la URL) guarda en qué pantalla estás: vacío = inicio, `#paris`, `#bruselas`, `#amsterdam`, `#pendientes`.
- Cada vez que el hash cambia (evento `hashchange`), la función `render()` en `js/app.js` vuelve a dibujar el contenido de `<main id="app">` según ese hash.
- Cualquier botón con `data-route="paris"` simplemente cambia `window.location.hash` — no hace falta un `<a>` por cada botón.

Ventaja de usar el hash en vez de, por ejemplo, una variable de JavaScript: cada cambio de pantalla queda en el historial del navegador, así que el botón "atrás" (o el gesto de deslizar desde el borde en iPhone) funciona solo, sin código adicional.

**Tipografía:** se agregaron dos fuentes de Google Fonts en el `<head>` de `index.html` — `Fredoka` (redondeada, para títulos) y `Poppins` (para el resto del texto), buscando un estilo más juvenil que la fuente del sistema.

**Fotos de portada:** son fotos reales de Wikimedia Commons (banco de imágenes libres), no genéricas ni inventadas — se verificó cada una antes de usarla (que la URL cargue y qué licencia tiene). Las tres son **CC BY-SA 3.0**, licencia que exige dar crédito al autor: por eso cada vista de detalle tiene una línea pequeña "📷 autor · Wikimedia Commons" con link a la foto original. Quedan referenciadas en `data/trip.js` (`cover` y `photoCredit` de cada ciudad).

⚠️ **Trade-off asumido a propósito:** estas fotos se cargan desde internet cada vez (no viven dentro del proyecto), así que si no hay señal la primera vez que abren esa pantalla, no se ven — el resto de la app (fechas, vuelos, hoteles) sigue funcionando igual porque esos datos sí están en el código. Cuando tengan fotos propias del viaje, lo ideal es reemplazar la URL de `cover` por un archivo en `assets/fotos/` para que cargue sin depender de internet.

---

## 7. Collage de fondo y navegación sin botón "Volver"

**Collage:** el encabezado azul ahora tiene un mosaico de 6 fotos de fondo (`TRIP.heroCollage` en `data/trip.js`), con el degradado azul/negro encima en semi-transparente (`.hero-overlay` en el CSS) para que el texto siga siendo legible. Como dos de esas licencias son CC BY / CC BY-SA (exigen crédito), se armó una línea de créditos en el pie de página que junta autores del collage y de las portadas sin repetirlos (`renderHeroCollage()` en `js/app.js`).

**Navegación sin botón "Volver":** en vez de un botón que solo sirve para retroceder, se dejó una barra de países siempre visible (arriba del contenido) que funciona como *toggle*:

- Tocar un país que no es el activo → entra a su detalle.
- Tocar el país que ya está activo (se ve resaltado en azul) → vuelve al inicio.

La lógica está en `handleRouteClick()`: compara el país tocado contra `currentRoute()` (el país actual, leído del hash) y decide si navega hacia adelante o si vuelve a inicio (`hash = ""`). Es el mismo patrón de una pestaña activa en cualquier app: tocarla de nuevo "cierra" esa sección.

---

## 8. De pantallas separadas a un acordeón, y fondo del Coliseo

Se ajustó la sección 6/7: en vez de navegar a una pantalla de "detalle" completamente aparte, ahora **todo vive en una sola pantalla tipo acordeón**. Cada país sigue siendo el mismo botón grande con foto, pero ahora:

- Tocar el cuadro grande de un país lo abre: su contenido (vuelo, hotel, cómo llegar, actividades) aparece pegado justo debajo de esa misma foto, y la página hace scroll suave hasta ahí.
- Tocar ese mismo cuadro de nuevo lo cierra y vuelve a la vista general — ya no hace falta ir a la barra de pills de arriba para cerrar, la propia foto grande también sirve para abrir y cerrar.
- La barra de pills sigue funcionando igual (abre/cierra lo mismo), útil sobre todo cuando ya hiciste scroll lejos del cuadro grande.

Técnicamente esto simplificó el código: ya no existen `renderHome()` / `renderDetail()` / `renderPendingView()` como pantallas separadas, sino una sola `renderMain()` que dibuja los tres países (y "Pendientes") en un `.country-grid`, y le agrega el bloque de contenido justo al que coincide con `currentRoute()`.

**Fondo del Coliseo:** la sección "Elige un destino" tenía fondo blanco liso. Se le puso una foto grande y a color del Coliseo de noche (`TRIP.homeBackground` en `data/trip.js`) como fondo de toda esa sección, detrás de los cuadros — se le dio bastante espacio (`gap` más grande entre cuadros y más padding) para que la foto se note claramente y no quede tapada casi del todo por las tarjetas.

---

## 9. Próximos pasos pendientes

- Agregar el vuelo/tren de Edison a `data/trip.js` cuando lo compre.
- Agregar el tour de París y las actividades de Bruselas/Ámsterdam.
- Meter fotos del grupo en `assets/fotos/` (avísame cuando las tengas y las conecto a la portada).
- Activar GitHub Pages ahora que el repo es público, si quieren un link directo para todos.

// Toda la app se pinta a partir del objeto TRIP definido en data/trip.js.
// No hay que tocar este archivo para actualizar el itinerario — solo data/trip.js.
//
// Navegación: se usa el "hash" de la URL (#paris, #bruselas...) como router
// muy simple. Cada cambio de hash vuelve a pintar la vista correspondiente,
// y el botón "atrás" del navegador (o el gesto de deslizar en iPhone) funciona
// solo porque cada hash cuenta como una entrada de historial.

const ICONS = { flight: "✈️", train: "🚄", bus: "🚌" };
const TYPE_LABEL = { flight: "Vuelo", train: "Tren", bus: "Bus" };

function fmtDate(iso) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00" : ""));
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function badge(confirmed) {
  return confirmed
    ? `<span class="badge confirmed">Confirmado</span>`
    : `<span class="badge pending">Pendiente</span>`;
}

function renderHeader() {
  document.getElementById("trip-name").textContent = TRIP.name;
  document.getElementById("trip-subtitle").textContent = TRIP.subtitle;
  document.getElementById("travelers").innerHTML = TRIP.travelers
    .map(t => `<span class="traveler-chip">${t}</span>`)
    .join("");
}

function renderHeroCollage() {
  const collage = TRIP.heroCollage || [];
  document.getElementById("hero-collage").innerHTML = collage
    .map(p => `<div class="tile" style="background-image:url('${p.url}')"></div>`)
    .join("");

  // Crédito consolidado de todas las fotos usadas en la app (collage + portadas),
  // sin repetir autores — algunas licencias (CC BY / CC BY-SA) lo exigen.
  const all = [...collage, ...TRIP.cities.map(c => c.photoCredit).filter(Boolean).map(c => ({ author: c.author, license: c.license, pageUrl: c.url }))];
  const seen = new Set();
  const unique = all.filter(p => {
    const key = p.author + p.license;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const creditsEl = document.getElementById("photo-credits");
  if (creditsEl) {
    creditsEl.innerHTML = "Fotos: " + unique
      .map(p => `<a href="${p.pageUrl}" target="_blank" rel="noopener">${p.author}</a>`)
      .join(", ") + " — Wikimedia Commons (CC BY / CC BY-SA / CC0)";
  }
}

function renderCountdown() {
  const el = document.getElementById("countdown");
  const now = new Date();
  const start = new Date(TRIP.startDate + "T00:00");
  const diffMs = start - now;

  if (diffMs <= 0) {
    el.innerHTML = `<div class="num-block"><span class="num">🎉</span><span class="lbl">¡Viaje en curso o terminado!</span></div>`;
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  el.innerHTML = `
    <div class="num-block"><span class="num">${days}</span><span class="lbl">Días</span></div>
    <div class="num-block"><span class="num">${hours}</span><span class="lbl">Horas</span></div>
    <div class="num-block"><span class="num">${minutes}</span><span class="lbl">Min</span></div>
  `;
}

function photoCreditLine(credit) {
  if (!credit) return "";
  return `<a class="photo-credit" href="${credit.url}" target="_blank" rel="noopener">📷 ${credit.author} · Wikimedia Commons (${credit.license})</a>`;
}

function transportCard(t) {
  if (!t) return "";
  const icon = ICONS[t.type] || "🧭";
  const label = TYPE_LABEL[t.type] || "Transporte";
  return `
    <div class="card transport">
      <div class="card-top">
        <div class="card-title"><span class="icon">${icon}</span> ${label} · ${t.company}</div>
        ${badge(t.confirmed)}
      </div>
      <div class="route-line">
        <span>${t.from}</span>
        <div class="dot"></div><div class="line"></div><div class="dot"></div>
        <span>${t.to}</span>
      </div>
      <div class="route-line times">
        <span>${fmtTime(t.departure)}</span>
        <span>${fmtTime(t.arrival)} · ${fmtDate(t.arrival)}</span>
      </div>
      <div class="card-row"><span class="k">Código / vuelo</span><span class="v">${t.code}</span></div>
      ${t.passengers ? `<div class="card-row"><span class="k">Pasajeros</span><span class="v">${t.passengers.join(", ")}</span></div>` : ""}
      ${t.note ? `<div class="note warn">⚠️ ${t.note}</div>` : ""}
    </div>
  `;
}

function hotelCard(h) {
  if (!h) return "";
  return `
    <div class="card hotel">
      <div class="card-top">
        <div class="card-title"><span class="icon">🏨</span> ${h.name}</div>
        ${badge(h.confirmed)}
      </div>
      ${h.address ? `<div class="card-row"><span class="k">Dirección</span><span class="v">${h.address}</span></div>` : ""}
      ${h.checkIn ? `<div class="card-row"><span class="k">Check-in</span><span class="v">${fmtDate(h.checkIn)}</span></div>` : ""}
      ${h.checkOut ? `<div class="card-row"><span class="k">Check-out</span><span class="v">${fmtDate(h.checkOut)}</span></div>` : ""}
      ${h.nights ? `<div class="card-row"><span class="k">Noches</span><span class="v">${h.nights}</span></div>` : ""}
      ${h.phone ? `<div class="card-row"><span class="k">Teléfono</span><span class="v">${h.phone}</span></div>` : ""}
      ${h.reservationNumber ? `<div class="card-row"><span class="k">Nº de reserva</span><span class="v">${h.reservationNumber}</span></div>` : ""}
      ${h.reservationName ? `<div class="card-row"><span class="k">A nombre de</span><span class="v">${h.reservationName}</span></div>` : ""}
      ${(!h.phone && !h.reservationNumber && h.privateNote) ? `<div class="note">🔒 ${h.privateNote}</div>` : ""}
    </div>
  `;
}

function transitCard(g) {
  if (!g) return "";
  return `
    <div class="card transit-tip">
      <div class="card-top">
        <div class="card-title"><span class="icon">🧭</span> Cómo llegar al hotel</div>
      </div>
      <div class="card-row"><span class="k">Desde</span><span class="v">${g.from}</span></div>
      <ul class="options-list">
        ${g.options.map(o => `<li>${o}</li>`).join("")}
      </ul>
      ${g.tip ? `<div class="note">💡 ${g.tip}</div>` : ""}
    </div>
  `;
}

function activitiesCard(activities) {
  if (!activities || activities.length === 0) {
    return `<div class="card activity"><div class="card-title"><span class="icon">🎟️</span> Actividades</div><p class="empty-hint">Aún no hay tours o actividades agregadas para esta ciudad.</p></div>`;
  }
  return `
    <div class="card activity">
      <div class="card-title"><span class="icon">🎟️</span> Actividades</div>
      ${activities.map(a => `
        <div class="card-row">
          <span class="k">${a.name}</span>
          <span class="v">${a.status === "pendiente" ? badge(false) : badge(true)}</span>
        </div>
        ${a.note ? `<div class="note warn">${a.note}</div>` : ""}
      `).join("")}
    </div>
  `;
}

// Si existe data/trip.private.js (archivo local, no se sube a git) con datos
// sensibles como teléfono o número de reserva, se combinan aquí encima de TRIP.
function applyPrivateOverrides() {
  if (typeof TRIP_PRIVATE === "undefined") return;
  TRIP.cities.forEach(c => {
    const override = TRIP_PRIVATE[c.id];
    if (override && override.hotel) {
      Object.assign(c.hotel, override.hotel);
    }
  });
}

// ---------- Vistas ----------

function renderHome() {
  const cards = TRIP.cities.map(c => `
    <button class="country-card" data-route="${c.id}" style="background-image:url('${c.cover}')">
      <span class="country-card-overlay"></span>
      <span class="country-card-content">
        <span class="flag">${c.flag}</span>
        <span class="country-name">${c.name}</span>
        <span class="country-dates">${fmtDate(c.dateFrom)} → ${fmtDate(c.dateTo)}</span>
      </span>
    </button>
  `).join("");

  const pendingCount = (TRIP.pending || []).length;

  return `
    <section class="home-view">
      <h2 class="section-title">Elige un destino</h2>
      <div class="country-grid">${cards}</div>
      ${pendingCount > 0 ? `
        <button class="pending-card" data-route="pendientes">
          <span class="icon">📋</span>
          <span>Pendientes por confirmar</span>
          <span class="pending-count">${pendingCount}</span>
        </button>
      ` : ""}
    </section>
  `;
}

function renderDetail(city) {
  return `
    <section class="detail-view">
      <div class="detail-banner" style="background-image:url('${city.cover}')">
        <span class="detail-banner-overlay"></span>
        <div class="detail-banner-content">
          <span class="flag">${city.flag}</span>
          <h2>${city.name}, ${city.country}</h2>
          <p class="city-dates">${fmtDate(city.dateFrom)} → ${fmtDate(city.dateTo)}</p>
        </div>
      </div>
      ${photoCreditLine(city.photoCredit)}
      <div class="detail-cards">
        ${transportCard(city.transportIn)}
        ${hotelCard(city.hotel)}
        ${transitCard(city.gettingToHotel)}
        ${activitiesCard(city.activities)}
      </div>
    </section>
  `;
}

function renderPendingView() {
  const items = (TRIP.pending || []).map(p => `<li>${p}</li>`).join("");
  return `
    <section class="detail-view">
      <h2 class="section-title">Pendientes por confirmar</h2>
      <ul class="pending-list">${items}</ul>
    </section>
  `;
}

function currentRoute() {
  return (window.location.hash || "#home").replace("#", "");
}

// Barra de países siempre visible. No hay botón "Volver": tocar el país que
// ya está activo vuelve al inicio (ver handleRouteClick). Solo se resalta
// como activo cuando estás dentro de ese país o de pendientes.
function renderPillNav() {
  const route = currentRoute();
  const nav = document.getElementById("pill-nav");
  const cityPills = TRIP.cities.map(c => `
    <button class="nav-pill ${route === c.id ? "active" : ""}" data-route="${c.id}">${c.flag} ${c.name}</button>
  `).join("");
  const pendingPill = (TRIP.pending || []).length > 0
    ? `<button class="nav-pill ${route === "pendientes" ? "active" : ""}" data-route="pendientes">📋</button>`
    : "";
  nav.innerHTML = cityPills + pendingPill;
}

function render() {
  const app = document.getElementById("app");
  const route = currentRoute();
  const city = TRIP.cities.find(c => c.id === route);

  let html;
  if (route === "pendientes") {
    html = renderPendingView();
  } else if (city) {
    html = renderDetail(city);
  } else {
    html = renderHome();
  }

  app.innerHTML = html;
  app.classList.remove("fade-in");
  void app.offsetWidth; // fuerza el reflow para que la animación se repita cada vez
  app.classList.add("fade-in");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  renderPillNav();
}

// Un solo país "activo" a la vez. Tocar un país nuevo entra a su detalle;
// tocar el país que ya está activo hace de botón "atrás" (vuelve al inicio).
function handleRouteClick(e) {
  const target = e.target.closest("[data-route]");
  if (!target) return;
  const route = target.getAttribute("data-route");
  const goingHome = route === "home" || route === currentRoute();
  window.location.hash = goingHome ? "" : route;
}

function setupRouter() {
  document.body.addEventListener("click", handleRouteClick);
  window.addEventListener("hashchange", render);
}

function init() {
  applyPrivateOverrides();
  renderHeader();
  renderHeroCollage();
  renderCountdown();
  setupRouter();
  render();
  setInterval(renderCountdown, 60 * 1000);
}

document.addEventListener("DOMContentLoaded", init);

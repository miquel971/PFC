document.addEventListener("DOMContentLoaded", () => {
  const inicio = document.getElementById("inicio");
  const aplicacion = document.getElementById("aplicacion");

  const estado = document.getElementById("estado");
  const selectorZona = document.getElementById("selectorZona");
  const botonCargarSpots = document.getElementById("botonCargarSpots");
  const botonVolverInicio = document.getElementById("botonVolverInicio");
  const videoLanding = document.querySelector(".landing-video");

  const recoBox = document.getElementById("recoBox");
  const cardFotoDia = document.getElementById("cardFotoDia");

  const vistaPrincipal = document.getElementById("vistaPrincipal");
  const vistaInfo = document.getElementById("vistaInfo");
  const tituloVistaInfo = document.getElementById("tituloVistaInfo");
  const contenidoVistaInfo = document.getElementById("contenidoVistaInfo");
  const cerrarVistaInfo = document.getElementById("cerrarVistaInfo");

  const btnQuienes = document.getElementById("btnQuienes");
  const btnServicios = document.getElementById("btnServicios");
  const btnContacto = document.getElementById("btnContacto");

  if (videoLanding) videoLanding.playbackRate = 0.6;

  const spotPanel = document.getElementById("spotPanel");
  const botonCerrarSpot = document.getElementById("botonCerrarSpot");
  const botonCentrarMapa = document.getElementById("botonCentrarMapa");

  const tituloSpot = document.getElementById("tituloSpot");
  const subtituloSpot = document.getElementById("subtituloSpot");

  const badgesSpot = document.getElementById("badgesSpot");
  const ahoraOla = document.getElementById("ahoraOla");
  const ahoraPeriodo = document.getElementById("ahoraPeriodo");
  const ahoraDirOla = document.getElementById("ahoraDirOla");
  const ahoraViento = document.getElementById("ahoraViento");
  const ahoraDirViento = document.getElementById("ahoraDirViento");
  const ahoraEstadoViento = document.getElementById("ahoraEstadoViento");

  const spotBoya = document.getElementById("spotBoya");
  const spotWebcam = document.getElementById("spotWebcam");
  const spotCoordenadas = document.getElementById("spotCoordenadas");

  const iframeOlas = document.getElementById("iframeOlas");
  const iframeViento = document.getElementById("iframeViento");
  const botonMapaOlas = document.getElementById("botonMapaOlas");
  const botonMapaViento = document.getElementById("botonMapaViento");

  const modalRegistro = document.getElementById("modalRegistro");
  const formRegistro = document.getElementById("formRegistro");
  const msgRegistro = document.getElementById("msgRegistro");

  const btnAbrirRegistro = document.getElementById("btnAbrirRegistro");
  const btnCerrarRegistro = document.getElementById("btnCerrarRegistro");
  const btnCancelarRegistro = document.getElementById("btnCancelarRegistro");

  const inputNombre = document.getElementById("regNombre");
  const inputEmail = document.getElementById("regEmail");
  const inputZona = document.getElementById("regZona");
  const inputPass = document.getElementById("regPass");
  const inputPass2 = document.getElementById("regPass2");

  const modalLogin = document.getElementById("modalLogin");
  const formLogin = document.getElementById("formLogin");
  const msgLogin = document.getElementById("msgLogin");

  const btnAbrirLogin = document.getElementById("btnAbrirLogin");
  const btnCerrarLogin = document.getElementById("btnCerrarLogin");
  const btnCancelarLogin = document.getElementById("btnCancelarLogin");

  const inputLoginEmail = document.getElementById("loginEmail");
  const inputLoginPass = document.getElementById("loginPass");

  const reNombre = /^[A-Za-zÀ-ÿÑñ]+(?:[ '\-][A-Za-zÀ-ÿÑñ]+)*$/u;
  const reEmail = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
  const rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

  function ponerEstado(texto) {
    if (estado) estado.textContent = texto;
  }

  function abrirVistaInfo(titulo, html) {
    if (!vistaPrincipal || !vistaInfo || !tituloVistaInfo || !contenidoVistaInfo) return;
    cerrarSpotPanel();
    tituloVistaInfo.textContent = titulo;
    contenidoVistaInfo.innerHTML = html;
    vistaPrincipal.classList.add("hidden");
    vistaInfo.classList.remove("hidden");
  }

  function cerrarVistaInfoFn() {
    if (!vistaPrincipal || !vistaInfo) return;
    vistaInfo.classList.add("hidden");
    vistaPrincipal.classList.remove("hidden");
  }

  function mostrarAplicacion() {
    inicio.classList.add("hidden");
    aplicacion.classList.remove("hidden");
    cerrarVistaInfoFn();
    requestAnimationFrame(() => mapa.invalidateSize());
  }

  function mostrarInicio() {
    cerrarVistaInfoFn();
    aplicacion.classList.add("hidden");
    inicio.classList.remove("hidden");
    cerrarSpotPanel();
    cerrarRegistro();
    cerrarLogin();
    ponerEstado("Selecciona zona y pulsa “Cargar spots”.");
  }

  if (inicio) {
    inicio.querySelectorAll("[data-zona]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const zona = btn.getAttribute("data-zona") || "med";
        if (selectorZona) selectorZona.value = zona;
        mostrarAplicacion();
        await cargarYMostrarSpots();
      });
    });
  }

  botonVolverInicio?.addEventListener("click", mostrarInicio);

  if (typeof L === "undefined") {
    ponerEstado("ERROR: Leaflet no está cargado.");
    console.error("Leaflet no está cargado: L es undefined");
    return;
  }

  const mapa = L.map("mapa").setView([39.5, -0.3], 7);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18, attribution: "Tiles © Esri" }
  ).addTo(mapa);

  const capaSpots = L.layerGroup().addTo(mapa);

  const ARCHIVOS_ZONA = {
    med: "data/mediterraneo.json",
    bal: "data/baleares.json",
    cant: null,
    pv: null,
    gal: null
  };

  async function cargarJSONZona(zona) {
    const archivo = ARCHIVOS_ZONA[zona];
    if (!archivo) throw new Error(`Zona "${zona}" aún no disponible en demo.`);

    ponerEstado(`Cargando ${archivo}...`);
    const res = await fetch(archivo, { cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudo cargar ${archivo} (HTTP ${res.status})`);
    return await res.json();
  }

  function aplanarSpots(datos) {
    const salida = [];
    for (const bloque of datos) {
      for (const s of (bloque.spots || [])) {
        salida.push({ ccaa: bloque.ccaa, province: bloque.province, ...s });
      }
    }
    return salida;
  }

  function num(v) {
    if (v === null || v === undefined || v === "") return NaN;
    return Number(String(v).trim().replace(",", "."));
  }

  async function cargarSpotsDesdeBD() {
    ponerEstado("Cargando spots desde BD...");
    const res = await fetch("api/spots.php?ts=" + Date.now());
    if (!res.ok) throw new Error(`No se pudo cargar api/spots.php (HTTP ${res.status})`);
    const rows = await res.json();

    return (rows || [])
      .filter((r) => Number(r.activo) === 1)
      .map((r) => ({
        id: Number(r.id),
        name: r.nombre,
        province: r.provincia,
        ccaa: "Comunitat Valenciana",
        lat: num(r.lat),
        lon: num(r.lon ?? r.lng),
        type: r.tipo_fondo || "—",
        buoy: "—",
        swell: [],
        wind_good: [],
        webcam: (r.webcam_url || "").trim() !== "",
        webcam_url: r.webcam_url || ""
      }))
      .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon));
  }

  function crearUrlMapa({ lat, lon, zoom, overlay }) {
    const u = new URL("https://embed.windy.com/embed2.html");
    u.searchParams.set("lat", String(lat));
    u.searchParams.set("lon", String(lon));
    u.searchParams.set("zoom", String(zoom));
    u.searchParams.set("level", "surface");
    u.searchParams.set("overlay", overlay);
    u.searchParams.set("product", overlay === "waves" ? "ecmwfWaves" : "ecmwf");
    u.searchParams.set("calendar", "now");
    u.searchParams.set("type", "map");
    u.searchParams.set("menu", "");
    u.searchParams.set("message", "");
    u.searchParams.set("marker", "");
    return u.toString();
  }

  function cargarMapas(spot) {
    if (!spot || !Number.isFinite(spot.lat) || !Number.isFinite(spot.lon)) return;
    if (!iframeOlas || !iframeViento) return;

    const zoom = 8;
    iframeOlas.src = crearUrlMapa({ lat: spot.lat, lon: spot.lon, zoom, overlay: "waves" });
    iframeViento.src = crearUrlMapa({ lat: spot.lat, lon: spot.lon, zoom, overlay: "wind" });
  }

  function degToCompass(deg) {
    if (!Number.isFinite(deg)) return "—";
    const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
    return dirs[Math.round(deg / 45) % 8];
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function evaluarEstrellas({ ola, periodo, viento }) {
    if (!Number.isFinite(ola) || !Number.isFinite(periodo) || !Number.isFinite(viento)) {
      return { stars: 0, label: "—", score: 0 };
    }

    const olaScore =
      ola < 0.4 ? 0 :
      ola < 0.6 ? 8 :
      ola < 0.9 ? 28 :
      ola < 1.2 ? 55 :
      ola < 1.5 ? 72 :
      ola < 2.2 ? 88 :
      ola < 3.0 ? 76 : 58;

    const perScore =
      periodo < 4 ? 5 :
      periodo < 5 ? 15 :
      periodo < 6 ? 30 :
      periodo < 7 ? 48 :
      periodo < 8 ? 62 :
      periodo < 9 ? 74 :
      periodo < 11 ? 88 : 95;

    const vientoScore =
      viento <= 4 ? 100 :
      viento <= 8 ? 88 :
      viento <= 12 ? 70 :
      viento <= 16 ? 45 :
      viento <= 22 ? 20 : 5;

    let score = (0.55 * olaScore) + (0.20 * perScore) + (0.25 * vientoScore);

    if (ola < 0.4) score = Math.min(score, 8);
    else if (ola < 0.5) score = Math.min(score, 18);
    else if (ola < 0.6) score = Math.min(score, 28);

    score = clamp(score, 0, 100);

    const stars =
      score < 15 ? 0 :
      score < 30 ? 1 :
      score < 45 ? 2 :
      score < 65 ? 3 :
      score < 82 ? 4 : 5;

    const label =
      stars <= 1 ? "flat" :
      stars === 2 ? "small" :
      stars === 3 ? "fun" :
      stars === 4 ? "good" :
      "epic";

    return { stars, label, score };
  }

  function renderStars(stars) {
    const s = clamp(stars, 0, 5);
    return "★".repeat(s) + "☆".repeat(5 - s);
  }

  async function obtenerPrediccionAhora(lat, lon) {
    const urlMarine =
      "https://marine-api.open-meteo.com/v1/marine" +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      "&hourly=wave_height,wave_period,wave_direction" +
      "&forecast_days=1&timezone=auto";

    const urlMeteo =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      "&hourly=wind_speed_10m,wind_direction_10m" +
      "&windspeed_unit=kmh" +
      "&forecast_days=1&timezone=auto";

    const [marineRes, meteoRes] = await Promise.all([
      fetch(urlMarine, { cache: "no-store" }),
      fetch(urlMeteo, { cache: "no-store" })
    ]);

    if (!marineRes.ok) throw new Error("No se pudo cargar Marine API");
    if (!meteoRes.ok) throw new Error("No se pudo cargar Meteo API");

    const marine = await marineRes.json();
    const meteo = await meteoRes.json();

    const now = Date.now();
    const mTimes = marine?.hourly?.time || [];
    const wTimes = meteo?.hourly?.time || [];

    const idxClosest = (times) => {
      let best = 0;
      let bestDiff = Infinity;

      for (let i = 0; i < times.length; i++) {
        const t = new Date(times[i]).getTime();
        const diff = Math.abs(t - now);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = i;
        }
      }
      return best;
    };

    const iM = idxClosest(mTimes);
    const iW = idxClosest(wTimes);

    return {
      waveHeight: marine?.hourly?.wave_height?.[iM],
      wavePeriod: marine?.hourly?.wave_period?.[iM],
      waveDir: marine?.hourly?.wave_direction?.[iM],
      windSpeed: meteo?.hourly?.wind_speed_10m?.[iW],
      windDir: meteo?.hourly?.wind_direction_10m?.[iW]
    };
  }

  function pintarTop3(ranking, zonaLabel) {
    if (!recoBox) return;

    if (!ranking.length) {
      recoBox.innerHTML = `<div class="muted">No hay predicción disponible.</div>`;
      return;
    }

    recoBox.innerHTML = `
      <div style="font-weight:700; margin-bottom:10px;">
        Mejor spot ahora (${zonaLabel})
      </div>
      ${ranking.slice(0, 3).map((r, i) => `
        <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:8px;">
          <div>${i + 1}. ${r.spot.name}</div>
          <div style="white-space:nowrap;">${renderStars(r.eva.stars)} ${r.eva.label}</div>
        </div>
      `).join("")}
    `;
  }

  async function mapLimit(arr, limit, fn) {
    const out = new Array(arr.length);
    let i = 0;

    const workers = new Array(limit).fill(0).map(async () => {
      while (i < arr.length) {
        const idx = i++;
        out[idx] = await fn(arr[idx], idx);
      }
    });

    await Promise.all(workers);
    return out;
  }

  async function calcularRanking(spots) {
    const results = await mapLimit(spots, 3, async (spot) => {
      try {
        const p = await obtenerPrediccionAhora(spot.lat, spot.lon);
        const eva = evaluarEstrellas({
          ola: p.waveHeight,
          periodo: p.wavePeriod,
          viento: p.windSpeed
        });
        return { ok: true, spot, eva };
      } catch {
        return { ok: false, spot, eva: { stars: 0, label: "—", score: 0 } };
      }
    });

    const ok = results.filter((r) => r.ok);
    ok.sort((a, b) => b.eva.score - a.eva.score);
    return ok;
  }

  async function actualizarRecomendacion(spots, zona) {
    if (!recoBox) return;

    const zonaLabel =
      zona === "med" ? "Mediterráneo" :
      zona === "bal" ? "Baleares" :
      zona === "cant" ? "Cantábrico" :
      zona === "pv" ? "País Vasco" :
      zona === "gal" ? "Galicia" : zona;

    recoBox.innerHTML = `<div class="muted">Calculando mejor spot...</div>`;
    const ranking = await calcularRanking(spots);
    pintarTop3(ranking, zonaLabel);
  }

  let spotActual = null;

  function abrirSpotPanel(spot) {
    spotActual = spot;

    if (tituloSpot) tituloSpot.textContent = spot.name || "Spot";
    if (subtituloSpot) subtituloSpot.textContent = `${spot.province || "—"} · ${spot.ccaa || "—"}`;

    const swellTxt = (spot.swell || []).join(", ") || "—";
    const vientoBuenoTxt = (spot.wind_good || []).join(", ") || "—";

    if (badgesSpot) {
      badgesSpot.innerHTML = `
        <span class="badge">Tipo: ${spot.type || "—"}</span>
        <span class="badge">Swell óptimo: ${swellTxt}</span>
        <span class="badge">Viento bueno: ${vientoBuenoTxt}</span>
      `;
    }

    if (spotBoya) spotBoya.textContent = spot.buoy ?? "—";
    if (spotWebcam) spotWebcam.textContent = spot.webcam ? "Disponible" : "No disponible";
    if (spotCoordenadas) spotCoordenadas.textContent = `${spot.lat}, ${spot.lon}`;

    if (ahoraOla) ahoraOla.textContent = "Cargando...";
    if (ahoraPeriodo) ahoraPeriodo.textContent = "Cargando...";
    if (ahoraDirOla) ahoraDirOla.textContent = "Cargando...";
    if (ahoraViento) ahoraViento.textContent = "Cargando...";
    if (ahoraDirViento) ahoraDirViento.textContent = "Cargando...";
    if (ahoraEstadoViento) ahoraEstadoViento.textContent = "Cargando...";

    cargarMapas(spot);

    spotPanel?.classList.remove("hidden");
    cardFotoDia?.classList.add("hidden");

    obtenerPrediccionAhora(spot.lat, spot.lon)
      .then((p) => {
        if (ahoraOla) ahoraOla.textContent = Number.isFinite(p.waveHeight) ? `${p.waveHeight.toFixed(1)} m` : "— m";
        if (ahoraPeriodo) ahoraPeriodo.textContent = Number.isFinite(p.wavePeriod) ? `${p.wavePeriod.toFixed(1)} s` : "— s";
        if (ahoraDirOla) ahoraDirOla.textContent = Number.isFinite(p.waveDir) ? `${degToCompass(p.waveDir)} (${Math.round(p.waveDir)}°)` : "—";
        if (ahoraViento) ahoraViento.textContent = Number.isFinite(p.windSpeed) ? `${Math.round(p.windSpeed)} km/h` : "— km/h";
        if (ahoraDirViento) ahoraDirViento.textContent = Number.isFinite(p.windDir) ? `${degToCompass(p.windDir)} (${Math.round(p.windDir)}°)` : "—";

        const eva = evaluarEstrellas({
          ola: p.waveHeight,
          periodo: p.wavePeriod,
          viento: p.windSpeed
        });

        if (ahoraEstadoViento) ahoraEstadoViento.textContent = `${renderStars(eva.stars)} ${eva.label}`;
      })
      .catch((err) => {
        console.error("Predicción error:", err);
        if (ahoraOla) ahoraOla.textContent = "— m";
        if (ahoraPeriodo) ahoraPeriodo.textContent = "— s";
        if (ahoraDirOla) ahoraDirOla.textContent = "—";
        if (ahoraViento) ahoraViento.textContent = "— km/h";
        if (ahoraDirViento) ahoraDirViento.textContent = "—";
        if (ahoraEstadoViento) ahoraEstadoViento.textContent = "—";
        ponerEstado("No se pudo cargar la predicción (mira consola F12).");
      });
  }

  function cerrarSpotPanel() {
    spotPanel?.classList.add("hidden");
    cardFotoDia?.classList.remove("hidden");
    spotActual = null;

    if (iframeOlas) iframeOlas.src = "about:blank";
    if (iframeViento) iframeViento.src = "about:blank";
  }

  botonCerrarSpot?.addEventListener("click", cerrarSpotPanel);

  botonCentrarMapa?.addEventListener("click", () => {
    if (!spotActual) return;
    mapa.setView([spotActual.lat, spotActual.lon], 12, { animate: true });
    ponerEstado(`Centrado en ${spotActual.name}`);
  });

  botonMapaOlas?.addEventListener("click", () => {
    if (spotActual) cargarMapas(spotActual);
  });

  botonMapaViento?.addEventListener("click", () => {
    if (spotActual) cargarMapas(spotActual);
  });

  function setMsgRegistro(texto, ok = false) {
    if (!msgRegistro) return;
    msgRegistro.textContent = texto;
    msgRegistro.style.color = ok ? "#d8ffe0" : "#ffd6d6";
  }

  function limpiarMsgRegistro() {
    if (!msgRegistro) return;
    msgRegistro.textContent = "";
  }

  function abrirRegistro() {
    if (!modalRegistro || !formRegistro) return;
    limpiarMsgRegistro();
    formRegistro.reset();
    modalRegistro.classList.remove("hidden");
    modalRegistro.setAttribute("aria-hidden", "false");
    inputNombre?.focus();
  }

  function cerrarRegistro() {
    if (!modalRegistro) return;
    modalRegistro.classList.add("hidden");
    modalRegistro.setAttribute("aria-hidden", "true");
  }

  function validarRegistro() {
    if (!formRegistro || !inputNombre || !inputEmail || !inputZona || !inputPass || !inputPass2) {
      return false;
    }

    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();
    const zona = inputZona.value.trim();
    const password = inputPass.value;
    const confirmPassword = inputPass2.value;

    if (!formRegistro.checkValidity()) {
      formRegistro.reportValidity();
      return false;
    }

    if (!reNombre.test(nombre) || nombre.length < 2 || nombre.length > 40) {
      setMsgRegistro("Nombre inválido. Usa letras y espacios (2–40).");
      inputNombre.focus();
      return false;
    }

    if (!reEmail.test(email) || email.length > 120) {
      setMsgRegistro("Email inválido. Ej: usuario@dominio.com");
      inputEmail.focus();
      return false;
    }

    const zonasValidas = ["med", "bal", "cant", "pv", "gal"];
    if (!zonasValidas.includes(zona)) {
      setMsgRegistro("Selecciona una zona válida.");
      inputZona.focus();
      return false;
    }

    if (!rePass.test(password)) {
      setMsgRegistro("La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.");
      inputPass.focus();
      return false;
    }

    if (password !== confirmPassword) {
      setMsgRegistro("Las contraseñas no coinciden.");
      inputPass2.focus();
      return false;
    }

    limpiarMsgRegistro();
    return true;
  }

  function setMsgLogin(texto, ok = false) {
    if (!msgLogin) return;
    msgLogin.textContent = texto;
    msgLogin.style.color = ok ? "#d8ffe0" : "#ffd6d6";
  }

  function limpiarMsgLogin() {
    if (!msgLogin) return;
    msgLogin.textContent = "";
  }

  function abrirLogin() {
    if (!modalLogin || !formLogin) return;
    limpiarMsgLogin();
    formLogin.reset();
    modalLogin.classList.remove("hidden");
    modalLogin.setAttribute("aria-hidden", "false");
    inputLoginEmail?.focus();
  }

  function cerrarLogin() {
    if (!modalLogin) return;
    modalLogin.classList.add("hidden");
    modalLogin.setAttribute("aria-hidden", "true");
  }

  function validarLogin() {
    if (!formLogin || !inputLoginEmail || !inputLoginPass) return false;

    const email = inputLoginEmail.value.trim();
    const password = inputLoginPass.value;

    if (!email) {
      setMsgLogin("Introduce tu email.");
      inputLoginEmail.focus();
      return false;
    }

    if (!reEmail.test(email)) {
      setMsgLogin("Email inválido.");
      inputLoginEmail.focus();
      return false;
    }

    if (!password) {
      setMsgLogin("Introduce tu contraseña.");
      inputLoginPass.focus();
      return false;
    }

    limpiarMsgLogin();
    return true;
  }

  btnAbrirRegistro?.addEventListener("click", abrirRegistro);
  btnCerrarRegistro?.addEventListener("click", cerrarRegistro);
  btnCancelarRegistro?.addEventListener("click", cerrarRegistro);

  btnAbrirLogin?.addEventListener("click", abrirLogin);
  btnCerrarLogin?.addEventListener("click", cerrarLogin);
  btnCancelarLogin?.addEventListener("click", cerrarLogin);

  btnQuienes?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirVistaInfo("Quiénes somos", `
      <div class="section-title">Quiénes somos</div>
      <p style="margin-top:12px;">
        superSpot es una plataforma pensada para consultar spots de forma clara, rápida y visual.
      </p>
      <p style="margin-top:12px;">
        Reunimos navegación, previsión e información útil dentro de una misma experiencia.
      </p>
    `);
  });

  btnServicios?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirVistaInfo("Servicios", `
      <div class="section-title">Servicios</div>
      <p style="margin-top:12px;">
        superSpot permite explorar zonas, cargar spots, consultar mapas y visualizar información relevante
        de forma rápida y centralizada.
      </p>
    `);
  });

  btnContacto?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirVistaInfo("Contacto", `
      <div class="section-title">Contacto</div>
      <p style="margin-top:12px;">
        Puedes escribirnos para información, colaboraciones o soporte.
      </p>
      <form style="margin-top:18px; display:flex; flex-direction:column; gap:12px; max-width:720px;">
        <input class="auth-input" type="text" placeholder="Nombre">
        <input class="auth-input" type="email" placeholder="Email">
        <textarea class="auth-input" placeholder="Mensaje" rows="6" style="resize:vertical;"></textarea>
        <div>
          <button type="button" class="btn">Enviar</button>
        </div>
      </form>
    `);
  });

  cerrarVistaInfo?.addEventListener("click", cerrarVistaInfoFn);

  modalRegistro?.addEventListener("click", (e) => {
    if (e.target === modalRegistro) cerrarRegistro();
  });

  modalLogin?.addEventListener("click", (e) => {
    if (e.target === modalLogin) cerrarLogin();
  });

  formRegistro?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarRegistro()) return;

    setMsgRegistro("Registrando...");

    try {
      const datos = new FormData(formRegistro);

      const res = await fetch("admin/crear_usuario.php", {
        method: "POST",
        body: datos
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.ok) {
        setMsgRegistro(data?.error || "Error al registrar.");
        return;
      }

      setMsgRegistro("Registro correcto. Ya puedes iniciar sesión.", true);

      setTimeout(() => {
        cerrarRegistro();
        abrirLogin();
      }, 900);

    } catch (error) {
      console.error(error);
      setMsgRegistro("Error de red o del servidor.");
    }
  });

  formLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarLogin()) return;

    setMsgLogin("Comprobando...");

    try {
      const datos = new FormData(formLogin);

      const res = await fetch("login_ajax.php", {
        method: "POST",
        body: datos
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.ok) {
        setMsgLogin(data?.error || "Email o contraseña incorrectos.");
        return;
      }

      if (data.rol === "admin") {
        setMsgLogin("Login correcto. Bienvenido, administrador.", true);
      } else {
        setMsgLogin("Login correcto.", true);
      }

      setTimeout(() => {
        cerrarLogin();
        window.location.href = "panel/dashboard.php";
      }, 700);

    } catch (error) {
      console.error(error);
      setMsgLogin("Error de red o del servidor.");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (modalRegistro && !modalRegistro.classList.contains("hidden")) {
      cerrarRegistro();
      return;
    }

    if (modalLogin && !modalLogin.classList.contains("hidden")) {
      cerrarLogin();
      return;
    }

    if (vistaInfo && !vistaInfo.classList.contains("hidden")) {
      cerrarVistaInfoFn();
      return;
    }

    if (spotPanel && !spotPanel.classList.contains("hidden")) {
      cerrarSpotPanel();
    }
  });

  function añadirMarcadorSpot(spot) {
    if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lon)) return;

    const marcador = L.circleMarker([spot.lat, spot.lon], {
      radius: 7,
      weight: 2,
      color: "#f2f6f7",
      fillColor: "#f2f6f7",
      fillOpacity: 0.9
    }).addTo(capaSpots);

    marcador.on("click", () => {
      ponerEstado(`${spot.name} · ${spot.province}`);
      abrirSpotPanel(spot);
    });
  }

  async function cargarYMostrarSpots() {
    try {
      cerrarVistaInfoFn();
      capaSpots.clearLayers();
      cerrarSpotPanel();

      const zona = selectorZona?.value || "med";

      let spots = [];
      if (zona === "med") {
        spots = await cargarSpotsDesdeBD();
      } else {
        const datos = await cargarJSONZona(zona);
        spots = aplanarSpots(datos);
      }

      const spotsValidos = spots.filter(
        (s) => Number.isFinite(s.lat) && Number.isFinite(s.lon)
      );

      if (!spotsValidos.length) {
        ponerEstado("No hay spots para mostrar.");
        if (recoBox) recoBox.innerHTML = `<div class="muted">No hay spots.</div>`;
        return;
      }

      for (const s of spotsValidos) {
        añadirMarcadorSpot(s);
      }

      mapa.invalidateSize();
      mapa.fitBounds(spotsValidos.map((s) => [s.lat, s.lon]), { padding: [40, 40] });
      ponerEstado(`OK: ${spotsValidos.length} spots cargados (${zona === "med" ? "BD" : "JSON"}).`);

      await actualizarRecomendacion(spotsValidos, zona);
    } catch (e) {
      console.error(e);
      ponerEstado(`ERROR: ${e.message} (mira consola F12)`);
      if (recoBox) recoBox.innerHTML = `<div class="muted">Error en recomendación.</div>`;
    }
  }

  botonCargarSpots?.addEventListener("click", cargarYMostrarSpots);
  selectorZona?.addEventListener("change", cargarYMostrarSpots);

  ponerEstado("Selecciona zona y pulsa “Cargar spots”.");
});
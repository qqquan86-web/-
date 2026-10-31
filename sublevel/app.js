/* ==========================================================================
   SUBLEVEL / 地脉 — interface logic
   No build step, no dependencies. Open index.html directly or serve the folder.
   ========================================================================== */
(function () {
  "use strict";

  const DATA = window.SUBLEVEL;
  const I18N = window.SUBLEVEL_I18N;

  if (!DATA || !I18N) {
    console.error("SUBLEVEL data failed to load.");
    return;
  }

  const {
    regions,
    styles,
    artists,
    platforms,
    regionPlatforms,
    meta
  } = DATA;

  const SUPPORTED_LANGS = ["zh", "en", "ko", "ja"];
  const LANG_NAMES = { zh: "中文", en: "English", ko: "한국어", ja: "日本語" };
  const REGION_MAP = Object.fromEntries(regions.map((region) => [region.id, region]));
  const STYLE_MAP = Object.fromEntries(styles.map((style) => [style.id, style]));
  const styleLabel = (styleId) => {
    const style = STYLE_MAP[styleId];
    if (!style) return styleId;
    return style.nameZh ? `${style.name}/${style.nameZh}` : style.name;
  };
  const ARTIST_MAP = Object.fromEntries(artists.map((artist) => [artist.id, artist]));
  const TOP_TRACKS = window.SUBLEVEL_TOP_TRACKS || {};
  const HEAT_RANK = new Map(
    [...artists]
      .sort((a, b) => b.heat - a.heat || a.name.en.localeCompare(b.name.en))
      .map((artist, index) => [artist.id, index + 1])
  );
  const PLATFORM_COLORS = {
    spotify: "#1ed760",
    apple: "#fa243c",
    youtube: "#ff0033",
    netease: "#c20c0c",
    qq: "#31c27c",
    kkbox: "#009be0",
    melon: "#00cd3c",
    bugs: "#ff5b00",
    line: "#06c755",
    amazon: "#25d366",
    soundcloud: "#ff5500",
    bandcamp: "#629aa9"
  };

  const state = {
    lang: "zh",
    region: "all",
    style: "all",
    sort: "heat",
    query: "",
    animateCards: true,
    volume: 0.5,
    muted: false
  };

  let T = I18N.zh;
  let previousFocus = null;
  let toastTimer = null;
  let playerHideTimer = null;
  let drawerCloseTimer = null;
  let currentArtistId = null;
  let currentTrackKey = null;
  let currentPreviewAppleUrl = null;
  let drawerArtistId = null;
  let playerIsLoading = false;
  let lastFocusedPreview = null;

  const audio = new Audio();
  audio.preload = "metadata";

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    state.lang = getInitialLanguage();
    T = I18N[state.lang];
    initVolume();
    initManifesto();
    applyLanguage();
    bindEvents();
    renderMethod();
    syncStats();
    updatePlayerLabels();
    updateVolumeUI();
  }

  function cacheElements() {
    els.html = document.documentElement;
    els.langSwitch = document.getElementById("langSwitch");
    els.searchInput = document.getElementById("searchInput");
    els.sortSelect = document.getElementById("sortSelect");
    els.styleSelect = document.getElementById("styleSelect");
    els.regionChips = document.getElementById("regionChips");
    els.artistGrid = document.getElementById("artistGrid");
    els.emptyState = document.getElementById("emptyState");
    els.resetFilters = document.getElementById("resetFilters");
    els.resultCount = document.getElementById("resultCount");
    els.resultSort = document.getElementById("resultSort");
    els.marqueeTrack = document.getElementById("marqueeTrack");
    els.manifesto = document.getElementById("manifesto");
    els.manifestoChoices = [...document.querySelectorAll("[data-manifesto-choice]")];
    els.yearChart = document.getElementById("yearChart");
    els.regionChart = document.getElementById("regionChart");
    els.methodDialog = document.getElementById("methodDialog");
    els.methodWeights = document.getElementById("methodWeights");
    els.methodClose = document.getElementById("methodClose");
    els.artistDialog = document.getElementById("artistDialog");
    els.drawerContent = document.getElementById("drawerContent");
    els.player = document.getElementById("player");
    els.playerArt = document.getElementById("playerArt");
    els.playerArtWrap = els.playerArt.closest(".player-art");
    els.playerArtFallback = document.getElementById("playerArtFallback");
    els.playerTrack = document.getElementById("playerTrack");
    els.playerArtist = document.getElementById("playerArtist");
    els.playerPlay = document.getElementById("playerPlay");
    els.playerClose = document.getElementById("playerClose");
    els.playerOpen = document.getElementById("playerOpen");
    els.playerSeek = document.getElementById("playerSeek");
    els.playerProgressFill = document.getElementById("playerProgressFill");
    els.playerTime = document.getElementById("playerTime");
    els.playerVolume = document.getElementById("playerVolume");
    els.playerVolumeValue = document.getElementById("playerVolumeValue");
    els.playerMute = document.getElementById("playerMute");
    els.toast = document.getElementById("toast");
    els.toastText = document.getElementById("toastText");
    els.toastLink = document.getElementById("toastLink");
    els.metaDescription = document.querySelector('meta[name="description"]');
    els.totalArtists = document.querySelectorAll("[data-total-artists]");
    els.totalRegions = document.querySelectorAll("[data-total-regions]");
    els.newCount = document.querySelectorAll("[data-new-count]");
    els.recentCount = document.querySelectorAll("[data-recent-count]");
  }

  /* ------------------------------------------------------------------------
     Language & static copy
     ------------------------------------------------------------------------ */

  function getInitialLanguage() {
    try {
      const stored = window.localStorage.getItem("sublevel.lang");
      if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    } catch (error) {
      /* localStorage can be blocked on file:// — fail quietly. */
    }
    return "zh";
  }

  function updateSyncDate() {
    const updated = String(window.SUBLEVEL?.meta?.updated || "").replace(/-/g, ".");
    if (!updated) return;
    document.querySelectorAll("[data-sync-date]").forEach((node) => {
      node.textContent = `${T.lastSync}: ${updated}`;
    });
  }

  function initManifesto() {
    if (!els.manifesto) return;
    let saved = null;
    try {
      saved = window.localStorage.getItem("sublevel.manifesto.v2");
    } catch (error) {
      /* file:// */
    }
    const variant = ["a", "b", "c"].includes(saved) ? saved : "a";
    setManifesto(variant);
  }

  function setManifesto(variant) {
    if (!els.manifesto || !["a", "b", "c"].includes(variant)) return;
    els.manifesto.dataset.manifesto = variant;
    els.manifestoChoices.forEach((button) => {
      const active = button.dataset.manifestoChoice === variant;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    try {
      window.localStorage.setItem("sublevel.manifesto.v2", variant);
    } catch (error) {
      /* no-op */
    }
  }

  function initVolume() {
    let saved = null;
    try {
      const raw = window.localStorage.getItem("sublevel.volume.v4");
      if (raw !== null && Number.isFinite(Number(raw))) saved = Number(raw);
    } catch (error) {
      /* localStorage can be blocked on file:// */
    }
    state.volume = clampVolume(saved === null ? 0.5 : saved);
    state.muted = state.volume === 0;
    applyVolumeState();
  }

  function clampVolume(value) {
    return Math.min(1, Math.max(0, Number(value) || 0));
  }

  function applyVolumeState() {
    // Master loudness is intentionally half of the value shown in the UI.
    audio.volume = state.volume * 0.5;
    audio.muted = state.muted;
    if (els.player) els.player.dataset.masterGain = "0.5";
    updateVolumeUI();
  }

  function updateVolumeUI() {
    if (!els.playerVolume || !els.playerMute) return;
    const percent = Math.round(state.volume * 100);
    const effectivelyMuted = state.muted || state.volume === 0;
    els.playerVolume.value = String(state.volume);
    els.playerVolume.style.setProperty("--volume-fill", `${percent}%`);
    els.playerVolume.setAttribute("aria-label", T.volumeLabel);
    els.playerVolume.setAttribute("aria-valuetext", `${percent}%`);
    els.playerVolumeValue.textContent = `${percent}%`;
    els.playerMute.setAttribute("aria-label", effectivelyMuted ? T.unmute : T.mute);
    els.playerMute.setAttribute("title", effectivelyMuted ? T.unmute : T.mute);
    els.playerMute.setAttribute("aria-pressed", String(effectivelyMuted));
    els.player.classList.toggle("is-muted", effectivelyMuted);
  }

  function setVolume(value) {
    state.volume = clampVolume(value);
    state.muted = state.volume === 0;
    try {
      window.localStorage.setItem("sublevel.volume.v4", String(state.volume));
    } catch (error) {
      /* no-op */
    }
    applyVolumeState();
  }

  function toggleMute() {
    const effectivelyMuted = state.muted || state.volume === 0;
    if (effectivelyMuted) {
      state.muted = false;
      if (state.volume === 0) state.volume = 0.5;
    } else {
      state.muted = true;
    }
    applyVolumeState();
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    state.lang = lang;
    T = I18N[lang];
    try {
      window.localStorage.setItem("sublevel.lang", lang);
    } catch (error) {
      /* no-op */
    }
    applyLanguage();
    const activeButton = els.langSwitch.querySelector(`[data-lang="${lang}"]`);
    if (activeButton) activeButton.focus();
  }

  function applyLanguage() {
    const lang = state.lang;
    T = I18N[lang];

    els.html.setAttribute("lang", T.htmlLang);
    els.html.setAttribute("data-lang", lang);
    document.title = T.metaTitle;
    if (els.metaDescription) els.metaDescription.setAttribute("content", T.metaDescription);

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (typeof T[key] === "string") node.textContent = T[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.dataset.i18nPlaceholder;
      if (typeof T[key] === "string") node.setAttribute("placeholder", T[key]);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      const key = node.dataset.i18nAria;
      if (typeof T[key] === "string") node.setAttribute("aria-label", T[key]);
    });

    els.langSwitch.setAttribute("aria-label", T.languageAria);
    els.langSwitch.querySelectorAll(".lang-btn").forEach((button) => {
      const buttonLang = button.dataset.lang;
      const isActive = buttonLang === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.setAttribute("aria-label", LANG_NAMES[buttonLang]);
      button.setAttribute("title", LANG_NAMES[buttonLang]);
    });

    if (els.searchInput) {
      els.searchInput.setAttribute("aria-label", T.searchLabel);
      els.searchInput.setAttribute("placeholder", T.searchPlaceholder);
    }
    if (els.sortSelect) els.sortSelect.setAttribute("aria-label", T.sortLabel);
    if (els.styleSelect) els.styleSelect.setAttribute("aria-label", T.styleAria);
    if (els.regionChips) els.regionChips.setAttribute("aria-label", T.filterAria);
    if (els.player) els.player.setAttribute("aria-label", T.playerKicker);

    renderMarquee();
    renderStyleOptions();
    renderFilters();
    renderArtists();
    renderCharts();
    renderMethod();
    syncStats();
    updatePlayerLabels();
    updateVolumeUI();
    updateSyncDate();

    if (els.artistDialog.open) {
      const artist = drawerArtistId ? ARTIST_MAP[drawerArtistId] : null;
      if (artist) renderDrawer(artist);
    }

    syncPreviewButtons();
  }

  function tf(key, vars) {
    const template = T[key] || key;
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (match, token) => (
      Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : match
    ));
  }

  function syncStats() {
    const total = artists.length;
    const regionTotal = regions.length;
    const recent = artists.filter((artist) => Number(projectYear(artist)) >= 2025).length;
    const newest = artists.filter((artist) => Number(projectYear(artist)) === 2026).length;

    els.totalArtists.forEach((node) => { node.textContent = String(total); });
    els.totalRegions.forEach((node) => { node.textContent = pad(regionTotal); });
    els.newCount.forEach((node) => { node.textContent = pad(newest); });
    els.recentCount.forEach((node) => { node.textContent = String(recent); });

    const regionCounts = Object.fromEntries(
      regions.map((region) => [region.id, artists.filter((artist) => artist.region === region.id).length])
    );
    document.querySelectorAll("[data-region-count]").forEach((node) => {
      node.textContent = pad(regionCounts[node.dataset.regionCount] || 0);
    });
  }

  function renderMarquee() {
    if (!els.marqueeTrack) return;
    const chunk = Array.from({ length: 4 }, () => `<span>${escapeHTML(T.ticker)}</span>`).join("");
    els.marqueeTrack.innerHTML = `<div class="marquee-group">${chunk}</div><div class="marquee-group" aria-hidden="true">${chunk}</div>`;
  }

  /* ------------------------------------------------------------------------
     Archive: filter, sort, cards
     ------------------------------------------------------------------------ */

  function renderStyleOptions() {
    if (!els.styleSelect) return;
    const options = [
      `<option value="all">${escapeHTML(T.styleAll)}</option>`,
      ...styles.map((style) => (
        `<option value="${style.id}">${escapeHTML(styleLabel(style.id))}</option>`
      ))
    ];
    els.styleSelect.innerHTML = options.join("");
    els.styleSelect.value = state.style;
    if (els.styleSelect.value !== state.style) {
      state.style = "all";
      els.styleSelect.value = "all";
    }
  }

  function renderFilters() {
    if (!els.regionChips) return;
    const counts = {};
    regions.forEach((region) => {
      counts[region.id] = artists.filter((artist) => artist.region === region.id).length;
    });

    const allActive = state.region === "all";
    let html = `
      <button type="button" class="chip${allActive ? " is-active" : ""}" data-region="all" aria-pressed="${allActive}">
        <span>${escapeHTML(T.all)}</span><span class="chip__count">${artists.length}</span>
      </button>`;

    regions.forEach((region) => {
      const active = state.region === region.id;
      html += `
        <button type="button" class="chip${active ? " is-active" : ""}" data-region="${region.id}" aria-pressed="${active}">
          <span>${escapeHTML(region.name[state.lang])}</span><span class="chip__count">${pad(counts[region.id])}</span>
        </button>`;
    });

    els.regionChips.innerHTML = html;
  }

  function getVisibleArtists() {
    const query = normalize(state.query);
    const filtered = artists.filter((artist) => {
      if (state.region !== "all" && artist.region !== state.region) return false;
      if (state.style !== "all" && !artist.styles.includes(state.style)) return false;
      if (!query) return true;
      return searchableText(artist).includes(query);
    });

    return filtered.sort((a, b) => {
      if (state.sort === "newest") {
        const dateDiff = projectDate(b) - projectDate(a);
        if (dateDiff !== 0) return dateDiff;
        return b.heat - a.heat;
      }
      if (state.sort === "name") {
        const nameA = a.name[state.lang] || a.name.en;
        const nameB = b.name[state.lang] || b.name.en;
        return nameA.localeCompare(nameB, T.locale, { sensitivity: "base" });
      }
      return b.heat - a.heat || a.name.en.localeCompare(b.name.en);
    });
  }

  function renderArtists() {
    if (!els.artistGrid) return;
    const visible = getVisibleArtists();
    const animate = state.animateCards;
    state.animateCards = false;

    els.artistGrid.classList.toggle("no-entry", !animate);
    els.artistGrid.innerHTML = visible.map((artist, index) => renderCard(artist, index)).join("");

    const hasResults = visible.length > 0;
    els.emptyState.hidden = hasResults;
    els.artistGrid.hidden = !hasResults;

    els.resultCount.textContent = tf("results", { shown: visible.length, total: artists.length });
    els.resultSort.textContent = state.sort === "newest"
      ? T.sortStateNewest
      : state.sort === "name"
        ? T.sortStateName
        : T.sortStateHeat;

    syncPreviewButtons();
  }

  function renderCard(artist, visibleIndex) {
    const region = REGION_MAP[artist.region];
    const serial = pad(HEAT_RANK.get(artist.id));
    const year = projectYear(artist);
    const localizedName = artist.name[state.lang] || artist.name.en;
    const alias = shouldShowAlias(artist) ? artist.latin : "";
    const initialIsLong = Array.from(artist.initial).length > 1;
    const styleName = styleLabel(artist.styles[0]);
    const previewAria = tf("previewAria", { name: localizedName, track: artist.project.preview.title });
    const isCurrent = currentArtistId === artist.id && !audio.paused;

    return `
      <article class="artist-card" style="--card-accent:${region.color};--i:${Math.min(visibleIndex, 12)}">
        <div class="card-cover">
          ${motifMarkup(artists.indexOf(artist), "card-motif")}
          <div class="cover-meta"><span>NO. ${serial}</span><span>${escapeHTML(region.code)} · ${year}</span></div>
          <span class="cover-initial${initialIsLong ? " is-long" : ""}" aria-hidden="true">${escapeHTML(artist.initial)}</span>
          <span class="cover-project">${escapeHTML(artist.project.title)}</span>
          <button type="button" class="preview-chip${isCurrent ? " is-playing" : ""}" data-preview="${artist.id}" aria-label="${escapeAttr(isCurrent ? T.pause30 : previewAria)}">
            <svg class="icon-play" viewBox="0 0 8 10" aria-hidden="true"><path d="M0 0v10l8-5Z" fill="currentColor"/></svg>
            <svg class="icon-pause" viewBox="0 0 8 10" aria-hidden="true"><path d="M0 0h2.7v10H0zM5.3 0H8v10H5.3z" fill="currentColor"/></svg>
            <span>30s</span>
          </button>
        </div>
        <div class="card-body">
          <div class="card-heading">
            <div class="card-name">
              <h3>${escapeHTML(localizedName)}</h3>
              ${alias ? `<p class="card-latin">${escapeHTML(alias)}</p>` : ""}
            </div>
            <div class="card-heat">
              <strong>${artist.heat}</strong>
              <span>${escapeHTML(T.heatShort)}</span>
            </div>
          </div>
          <p class="card-meta">
            <span>${escapeHTML(artist.base[state.lang] || artist.base.en)}</span>
            <span class="card-style">${escapeHTML(styleName)}</span>
          </p>
          <div class="card-bottom">
            <div class="card-project">
              <span>${escapeHTML(T.latest)}</span>
              <b title="${escapeAttr(artist.project.title)}">${escapeHTML(artist.project.title)}</b>
            </div>
            <span class="card-year" title="${escapeAttr(T.projectMeta.replace("{type}", T.types[artist.project.type] || artist.project.type).replace("{count}", artist.project.tracks))}">${year}</span>
          </div>
        </div>
        <button type="button" class="card-hit" data-open="${artist.id}" aria-label="${escapeAttr(tf("cardAria", { name: localizedName, base: artist.base[state.lang] || artist.base.en, heat: artist.heat }))}"></button>
      </article>`;
  }

  function searchableText(artist) {
    const styleNames = artist.styles.map((styleId) => styleLabel(styleId));
    return normalize([
      ...Object.values(artist.name),
      artist.latin,
      ...Object.values(artist.base),
      artist.tags.join(" "),
      styleNames.join(" "),
      artist.bio[state.lang] || "",
      artist.bio.en,
      artist.project.title,
      artist.project.preview.title
    ].join(" "));
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function shouldShowAlias(artist) {
    const local = normalize(artist.name[state.lang]);
    const latin = normalize(artist.latin);
    const english = normalize(artist.name.en);
    if (local !== latin) return true;
    return state.lang === "en" && english !== latin;
  }

  function projectYear(artist) {
    return String(artist.project.date).slice(0, 4);
  }

  function projectDate(artist) {
    return new Date(`${artist.project.date}T12:00:00Z`).getTime();
  }

  function motifMarkup(index, className) {
    const variants = [
      `<g fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="260" cy="42" r="66"/><circle cx="260" cy="42" r="44"/><circle cx="260" cy="42" r="16"/>
        <path d="M-10 211 338 63"/><path d="M286 0v96M218 0v48"/>
      </g>
      <circle cx="260" cy="42" r="5" fill="currentColor" stroke="none"/>`,
      `<g fill="none" stroke="currentColor" stroke-width="1">
        <path d="M184 0v240M208 0v240M232 0v240M256 0v240M280 0v240M304 0v240"/>
        <circle cx="232" cy="120" r="82"/><path d="M150 240 314 0"/>
      </g>`,
      `<g fill="none" stroke="currentColor" stroke-width="1">
        <rect x="202" y="17" width="157" height="157" transform="rotate(14 280 95)"/>
        <rect x="222" y="37" width="117" height="117" transform="rotate(14 280 95)"/>
        <path d="M0 192h320M0 210h320M0 228h320"/>
      </g>`,
      `<g fill="none" stroke="currentColor" stroke-width="1">
        <path d="M228 240c0-92 64-151 128-186"/><path d="M124 240c0-58 40-96 81-119"/><path d="M24 240c0-30 21-50 43-61"/>
        <circle cx="228" cy="87" r="6" fill="currentColor" stroke="none"/>
      </g>`,
      `<g fill="none" stroke="currentColor" stroke-width="1">
        <path d="M320 0 0 240M220 0 0 165M320 75 95 240"/>
        <circle cx="267" cy="53" r="38"/><circle cx="267" cy="53" r="5" fill="currentColor" stroke="none"/>
      </g>`,
      `<g fill="none" stroke="currentColor" stroke-width="1">
        <path d="M20 44h80M20 62h125M20 80h52M244 206h56M268 188h32"/>
        <circle cx="272" cy="60" r="79"/><circle cx="272" cy="60" r="35"/>
        <path d="M184 0v240"/>
      </g>`
    ];

    return `<svg class="${className}" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${variants[index % variants.length]}</svg>`;
  }

  /* ------------------------------------------------------------------------
     Charts
     ------------------------------------------------------------------------ */

  function renderCharts() {
    if (!els.yearChart || !els.regionChart) return;

    const startYear = 2022;
    const endYear = 2026;
    const yearCounts = {};
    for (let year = startYear; year <= endYear; year += 1) yearCounts[year] = 0;
    artists.forEach((artist) => {
      const year = Number(projectYear(artist));
      if (yearCounts[year] !== undefined) yearCounts[year] += 1;
    });
    const maxYearCount = Math.max(...Object.values(yearCounts), 1);

    els.yearChart.innerHTML = Object.entries(yearCounts).map(([year, count]) => {
      const width = count === 0 ? 0 : Math.max(4, (count / maxYearCount) * 100);
      return `
        <div class="chart-row" role="img" aria-label="${escapeAttr(tf("yearAria", { year, count }))}">
          <span class="chart-label">${year}</span>
          <span class="chart-track"><span class="chart-bar" style="--w:${width.toFixed(1)}%"></span></span>
          <span class="chart-value">${pad(count)}</span>
        </div>`;
    }).join("");

    const regionStats = regions.map((region) => {
      const entries = artists.filter((artist) => artist.region === region.id);
      const avg = entries.reduce((sum, artist) => sum + artist.heat, 0) / entries.length;
      return { ...region, avg, count: entries.length };
    }).sort((a, b) => b.avg - a.avg);

    els.regionChart.innerHTML = regionStats.map((region) => {
      const average = region.avg.toFixed(1);
      return `
        <div class="chart-row" role="img" aria-label="${escapeAttr(tf("regionAria", { region: region.name[state.lang], value: average }))}" title="${escapeAttr(region.name[state.lang])}">
          <span class="chart-label"><i class="region-dot" style="--region-color:${region.color}"></i>${escapeHTML(region.shortName?.[state.lang] || region.name[state.lang])}</span>
          <span class="chart-track"><span class="chart-bar" style="--w:${average}%;--region-color:${region.color}"></span></span>
          <span class="chart-value">${average}</span>
        </div>`;
    }).join("");

    els.regionChart.querySelectorAll(".chart-bar").forEach((bar) => {
      bar.style.background = bar.closest(".chart-row").querySelector(".region-dot").style.getPropertyValue("--region-color");
    });
  }

  /* ------------------------------------------------------------------------
     Method dialog
     ------------------------------------------------------------------------ */

  function renderMethod() {
    if (!els.methodWeights) return;
    els.methodWeights.innerHTML = T.methodWeights.map((item) => `
      <div class="weight-row">
        <span class="weight-value">${escapeHTML(item.value)}</span>
        <span class="weight-label">${escapeHTML(item.label)}</span>
        <p class="weight-body">${escapeHTML(item.body)}</p>
      </div>`).join("");
  }

  function openMethod() {
    renderMethod();
    document.body.classList.add("method-open");
    if (typeof els.methodDialog.showModal === "function") {
      els.methodDialog.showModal();
    } else {
      els.methodDialog.setAttribute("open", "");
    }
  }

  function closeMethod() {
    if (els.methodDialog.open) els.methodDialog.close();
    document.body.classList.remove("method-open");
  }

  /* ------------------------------------------------------------------------
     Artist drawer
     ------------------------------------------------------------------------ */

  function openArtist(artistId, trigger) {
    const artist = ARTIST_MAP[artistId];
    if (!artist) return;

    if (els.artistDialog.open) {
      drawerArtistId = artist.id;
      renderDrawer(artist);
      return;
    }

    previousFocus = trigger || document.activeElement;
    drawerArtistId = artist.id;
    renderDrawer(artist);
    clearTimeout(drawerCloseTimer);
    document.body.classList.add("drawer-open");
    els.artistDialog.showModal();
    if (els.player.parentElement !== els.artistDialog) {
      els.artistDialog.appendChild(els.player);
    }
    requestAnimationFrame(() => els.artistDialog.classList.add("is-open"));
    const closeButton = els.drawerContent.querySelector(".drawer-close");
    if (closeButton) closeButton.focus({ preventScroll: true });
  }

  function closeArtist() {
    if (!els.artistDialog.open) return;
    els.artistDialog.classList.remove("is-open");
    drawerCloseTimer = window.setTimeout(() => {
      if (els.artistDialog.open) els.artistDialog.close();
    }, 380);
  }

  function renderDrawer(artist) {
    const region = REGION_MAP[artist.region];
    const localizedName = artist.name[state.lang] || artist.name.en;
    const alias = shouldShowAlias(artist) ? artist.latin : "";
    const year = projectYear(artist);
    const originalIndex = artists.indexOf(artist);
    const serial = pad(HEAT_RANK.get(artist.id));
    const projectType = T.types[artist.project.type] || artist.project.type;
    const styleNames = artist.styles.map((styleId) => styleLabel(styleId));
    const styleName = styleNames[0] || styleLabel("hip-hop");
    const date = formatReleaseDate(artist.project.date);
    const preview = artist.project.preview;
    const topTracks = TOP_TRACKS[artist.id] || [];
    const playableTracks = topTracks.filter((track) => track.previewUrl).length;
    const topTracksLabel = topTracks.length === playableTracks
      ? tf("topTracksCount", { count: topTracks.length })
      : tf("topTracksCountMixed", { count: topTracks.length, playable: playableTracks });
    const platformLinks = buildPlatformLinks(artist);
    const isCurrent = currentArtistId === artist.id && !audio.paused;
    const trackCountLabel = T.projectMeta
      .replace("{type}", "")
      .replace("{count}", artist.project.tracks)
      .replace(/^\s*·\s*/, "")
      .trim();

    els.drawerContent.innerHTML = `
      <div class="drawer-top" style="--drawer-accent:${region.color}">
        ${motifMarkup(originalIndex, "drawer-motif")}
        <div class="drawer-bar">
          <span>${escapeHTML(T.drawerKicker)} · ${serial} / ${escapeHTML(region.code)}</span>
          <button type="button" class="drawer-close" data-close-drawer aria-label="${escapeAttr(T.closeDrawer)}">
            <svg viewBox="0 0 18 18" aria-hidden="true"><path d="m2 2 14 14M16 2 2 16" stroke="currentColor" stroke-width="1.4"/></svg>
          </button>
        </div>
        <div class="drawer-identity">
          <div class="drawer-name-wrap">
            <p class="drawer-region">${escapeHTML(region.name[state.lang])} · ${escapeHTML(artist.base[state.lang] || artist.base.en)}</p>
            <h2 class="drawer-name" id="drawerName">${escapeHTML(localizedName)}</h2>
            ${alias ? `<p class="drawer-alias">${escapeHTML(alias)}</p>` : ""}
          </div>
          <div class="drawer-heat">
            <strong>${artist.heat}</strong>
            <span>${escapeHTML(T.heatLabel)}<br>${escapeHTML(T.heatNote)}</span>
          </div>
        </div>
        <div class="drawer-meta">
          <div class="drawer-meta-item"><span>${escapeHTML(T.baseLabel)}</span><b>${escapeHTML(artist.base[state.lang] || artist.base.en)}</b></div>
          <div class="drawer-meta-item"><span>${escapeHTML(T.regionLabel)}</span><b>${escapeHTML(region.name[state.lang])}</b></div>
          <div class="drawer-meta-item"><span>${escapeHTML(T.styleLabel)}</span><b>${escapeHTML(styleName)}</b></div>
          <div class="drawer-meta-item"><span>${escapeHTML(T.activeLabel)}</span><b>${escapeHTML(T.activeValue)}</b></div>
        </div>
      </div>
      <div class="drawer-body">
        <section class="drawer-section" style="border-top:0;padding-top:0">
          <div class="drawer-label"><span>${escapeHTML(T.bioTitle)}</span><span>${escapeHTML(artist.tags.join(" / "))}</span></div>
          <p class="drawer-bio">${escapeHTML(artist.bio[state.lang] || artist.bio.en)}</p>
          <div class="drawer-styles" aria-label="${escapeAttr(T.styleLabel)}">
            ${styleNames.map((name) => `<span class="style-tag">${escapeHTML(name)}</span>`).join("")}
          </div>
        </section>

        <section class="drawer-section">
          <div class="drawer-label"><span>${escapeHTML(T.latestTitle)}</span><span>${escapeHTML(year)}</span></div>
          <div class="project-card">
            <div class="project-art">
              <img src="${escapeAttr(preview.artwork)}" alt="${escapeAttr(tf("coverAlt", { track: preview.title }))}" loading="lazy" referrerpolicy="no-referrer">
              <span>${escapeHTML(artist.initial)}</span>
            </div>
            <div class="project-info">
              <p class="project-type">${escapeHTML(projectType)} · ${escapeHTML(date)} · ${escapeHTML(trackCountLabel)}</p>
              <p class="project-title">${escapeHTML(artist.project.title)}</p>
              <p class="project-credit">${escapeHTML(preview.title)}</p>
            </div>
            <a class="project-link" href="${escapeAttr(artist.project.appleUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(T.openApple)}">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
            </a>
          </div>

          <button type="button" class="drawer-play${isCurrent ? " is-playing" : ""}" data-preview="${artist.id}" aria-label="${escapeAttr(isCurrent ? T.pause30 : tf("previewAria", { name: localizedName, track: preview.title }))}">
            <span class="drawer-play__left">
              <svg class="icon-play" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0v12l10-6Z" fill="currentColor"/></svg>
              <svg class="icon-pause" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0h3.4v12H0zM6.6 0H10v12H6.6z" fill="currentColor"/></svg>
              <span class="drawer-play__text">${escapeHTML(isCurrent ? T.pause30 : T.play30)}</span>
            </span>
            <small>${escapeHTML(T.officialPreview)}</small>
          </button>
          <div class="preview-caption">
            <span>${escapeHTML(preview.title)}</span>
            <span>${escapeHTML(T.previewNote)}</span>
          </div>
        </section>

        ${topTracks.length ? `
        <section class="drawer-section tracks-section">
          <div class="drawer-label"><span>${escapeHTML(T.topTracksKicker)}</span><span>${escapeHTML(topTracksLabel)}</span></div>
          <ol class="track-list">
            ${topTracks.map((track, index) => {
              const key = `${artist.id}:${index}`;
              const active = currentTrackKey === key && !audio.paused;
              const playable = Boolean(track.previewUrl);
              const externalUrl = track.appleUrl || track.externalUrl || artist.project.appleUrl;
              return `
              <li class="track-row${active ? " is-playing" : ""}${playable ? "" : " is-external"}">
                <span class="track-index">${pad(index + 1)}</span>
                <div class="track-copy">
                  <b>${escapeHTML(track.title)}</b>
                  <span>${escapeHTML(track.album || artist.project.title)}${track.year ? ` · ${escapeHTML(track.year)}` : ""}</span>
                </div>
                <a class="track-open" href="${escapeAttr(externalUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(track.externalUrl ? "NETEASE" : T.openApple)}">↗</a>
                ${playable ? `<button type="button" class="track-play${active ? " is-playing" : ""}" data-track="${key}" data-track-title="${escapeAttr(track.title)}" aria-label="${escapeAttr(active ? T.trackPause : T.trackPlay)}">
                  <svg class="icon-play" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0v12l10-6Z" fill="currentColor"/></svg>
                  <svg class="icon-pause" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0h3.4v12H0zM6.6 0H10v12H6.6z" fill="currentColor"/></svg>
                </button>` : `<span class="track-source">NETEASE</span>`}
              </li>`;
            }).join("")}
          </ol>
          <p class="track-note">${escapeHTML(T.trackNote)}</p>
        </section>` : ""}

        <section class="drawer-section">
          <div class="drawer-label"><span>${escapeHTML(T.listenTitle)}</span><span>${escapeHTML(T.appleCatalog)}</span></div>
          <div class="platform-grid">${platformLinks}</div>
          <p class="listen-note">${escapeHTML(T.listenNote)}</p>
          <div class="data-anchor">
            <span>${escapeHTML(T.dataAnchor)} · ${escapeHTML(T.appleCatalog)}</span>
            <a href="${escapeAttr(artist.artistAppleUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(T.viewOnApple)} ↗</a>
          </div>
        </section>
      </div>`;

    const image = els.drawerContent.querySelector(".project-art img");
    if (image) {
      image.addEventListener("error", () => {
        const wrapper = image.closest(".project-art");
        if (wrapper) wrapper.classList.add("is-fallback");
      });
    }
    syncPreviewButtons();
  }

  function buildPlatformLinks(artist) {
    const ids = regionPlatforms[artist.region] || ["spotify", "apple", "youtube"];
    return ids.map((platformId) => {
      const platform = platforms[platformId];
      if (!platform) return "";
      const isApple = platformId === "apple";
      const query = platformSearchQuery(artist, platformId);
      const href = isApple ? artist.project.appleUrl : platform.url(query);
      const label = isApple ? T.openApple : tf("searchOn", { platform: platform.name[state.lang] });
      return `
        <a class="platform-link" style="--platform-color:${PLATFORM_COLORS[platformId] || "#151513"}" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(label)}">
          <span class="platform-link__left">
            <span class="platform-tag">${escapeHTML(platform.tag)}</span>
            <span>${escapeHTML(platform.name[state.lang])}</span>
          </span>
          <span aria-hidden="true">↗</span>
        </a>`;
    }).join("");
  }

  function platformSearchQuery(artist, platformId) {
    let name = artist.name.en;
    if (platformId === "netease" || platformId === "qq" || platformId === "kkbox") name = artist.name.zh;
    if (platformId === "melon" || platformId === "bugs") name = artist.name.ko;
    if (platformId === "line" || platformId === "amazon") name = artist.name.ja;
    return `${name} ${artist.project.title}`;
  }

  function formatReleaseDate(dateString) {
    const date = new Date(`${dateString}T12:00:00Z`);
    try {
      return new Intl.DateTimeFormat(T.locale, { year: "numeric", month: "short" }).format(date);
    } catch (error) {
      return dateString.slice(0, 7);
    }
  }

  /* ------------------------------------------------------------------------
     Audio preview player
     ------------------------------------------------------------------------ */

  function playPreview(artist, trigger, track = null, trackKey = null) {
    const preview = track ? {
      title: track.title,
      url: track.previewUrl,
      artwork: track.artwork,
      appleUrl: track.appleUrl
    } : artist?.project?.preview;
    const resolvedKey = trackKey || `${artist?.id || ""}:project`;
    if (!artist || !preview || !preview.url) {
      showToast(T.previewUnavailable);
      return;
    }

    lastFocusedPreview = trigger || document.activeElement;

    if (currentArtistId === artist.id && currentTrackKey === resolvedKey) {
      if (audio.paused) {
        if (audio.ended) audio.currentTime = 0;
        startPlayback();
      } else {
        audio.pause();
      }
      return;
    }

    currentArtistId = artist.id;
    currentTrackKey = resolvedKey;
    currentPreviewAppleUrl = preview.appleUrl || artist.project.appleUrl;
    playerIsLoading = true;
    clearTimeout(playerHideTimer);

    els.player.hidden = false;
    requestAnimationFrame(() => els.player.classList.add("is-open"));
    els.player.classList.add("is-loading");
    els.player.classList.remove("is-playing");

    els.playerTrack.textContent = preview.title;
    els.playerArtist.textContent = `${artist.name[state.lang] || artist.name.en} · ${track ? (track.album || artist.project.title) : artist.project.title}`;
    els.playerOpen.href = currentPreviewAppleUrl;
    els.playerSeek.value = "0";
    els.playerProgressFill.style.width = "0%";
    els.playerTime.textContent = `0:00 / 0:30`;

    els.playerArtWrap.classList.remove("is-fallback");
    els.playerArtFallback.textContent = artist.initial;
    els.playerArt.hidden = false;
    els.playerArt.src = artist.avatar || preview.artwork;
    els.playerArt.alt = `${artist.name[state.lang] || artist.name.en} — platform avatar`;

    els.playerArt.onerror = () => {
      els.playerArtWrap.classList.add("is-fallback");
    };

    audio.src = preview.url;
    audio.currentTime = 0;
    startPlayback();
    syncPreviewButtons();
  }

  function startPlayback() {
    playerIsLoading = true;
    els.player.classList.add("is-loading");
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        playerIsLoading = false;
        els.player.classList.remove("is-loading");
        els.player.classList.remove("is-playing");
        showToast(T.previewFailed, artistCurrentAppleUrl());
        syncPreviewButtons();
      });
    }
  }

  function closePlayer() {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    currentArtistId = null;
    currentTrackKey = null;
    currentPreviewAppleUrl = null;
    playerIsLoading = false;
    els.player.classList.remove("is-playing", "is-loading", "is-open");
    clearTimeout(playerHideTimer);
    playerHideTimer = window.setTimeout(() => {
      els.player.hidden = true;
    }, 360);
    syncPreviewButtons();
  }

  function artistCurrentAppleUrl() {
    if (!currentArtistId) return "https://music.apple.com/";
    if (currentPreviewAppleUrl) return currentPreviewAppleUrl;
    const artist = ARTIST_MAP[currentArtistId];
    return artist ? (artist.project.preview.appleUrl || artist.project.appleUrl) : "https://music.apple.com/";
  }

  function updatePlayerTimeline() {
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30;
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const ratio = Math.min(1, Math.max(0, current / duration));
    els.playerProgressFill.style.width = `${ratio * 100}%`;
    els.playerSeek.value = String(Math.round(ratio * 1000));
    els.playerTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(safe / 60);
    const remainder = safe % 60;
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  function syncPreviewButtons() {
    if (!els.artistGrid) return;
    const isReallyPlaying = !audio.paused && !audio.ended;
    const isActiveArtist = currentArtistId !== null;

    document.querySelectorAll("[data-preview]").forEach((button) => {
      const artistId = button.dataset.preview;
      const isCurrent = isActiveArtist && artistId === currentArtistId && currentTrackKey === `${artistId}:project`;
      const shouldShowPlaying = isCurrent && isReallyPlaying;
      button.classList.toggle("is-playing", shouldShowPlaying);
      const artist = ARTIST_MAP[artistId];
      if (!artist) return;
      const previewLabel = tf("previewAria", {
        name: artist.name[state.lang] || artist.name.en,
        track: artist.project.preview.title
      });
      button.setAttribute("aria-label", shouldShowPlaying ? T.pause30 : previewLabel);
      if (button.classList.contains("drawer-play")) {
        const label = button.querySelector(".drawer-play__text");
        if (label) label.textContent = shouldShowPlaying ? T.pause30 : T.play30;
      }
    });

    document.querySelectorAll("[data-track]").forEach((button) => {
      const key = button.dataset.track;
      const artistId = key.split(":")[0];
      const active = isActiveArtist && currentTrackKey === key && isReallyPlaying;
      button.classList.toggle("is-playing", active);
      const row = button.closest(".track-row");
      if (row) row.classList.toggle("is-playing", active);
      const label = active ? (T.trackPause || T.pause30) : (T.trackPlay || T.play30);
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });

    const playLabel = isReallyPlaying ? T.pausePreview : T.playPreview;
    els.playerPlay.setAttribute("aria-label", playLabel);
    els.playerPlay.setAttribute("title", playLabel);
    els.player.classList.toggle("is-playing", isReallyPlaying);
    if (!playerIsLoading) els.player.classList.remove("is-loading");
  }

  function updatePlayerLabels() {
    if (!els.player) return;
    els.playerClose.setAttribute("aria-label", T.closePlayer);
    els.playerOpen.setAttribute("aria-label", T.playerOpen);
    els.playerSeek.setAttribute("aria-label", T.seekAria);
    const isReallyPlaying = !audio.paused && !audio.ended;
    els.playerPlay.setAttribute("aria-label", isReallyPlaying ? T.pausePreview : T.playPreview);
    els.playerPlay.setAttribute("title", isReallyPlaying ? T.pausePreview : T.playPreview);
    els.playerClose.setAttribute("title", T.closePlayer);
    els.playerOpen.setAttribute("title", T.playerOpen);
    if (els.playerVolume) {
      els.playerVolume.setAttribute("aria-label", T.volumeLabel);
      const effectivelyMuted = state.muted || state.volume === 0;
      els.playerMute.setAttribute("aria-label", effectivelyMuted ? T.unmute : T.mute);
      els.playerMute.setAttribute("title", effectivelyMuted ? T.unmute : T.mute);
    }
  }

  audio.addEventListener("playing", () => {
    playerIsLoading = false;
    els.player.classList.remove("is-loading");
    els.player.classList.add("is-playing");
    syncPreviewButtons();
    updatePlayerTimeline();
  });

  audio.addEventListener("pause", () => {
    playerIsLoading = false;
    els.player.classList.remove("is-loading");
    els.player.classList.remove("is-playing");
    syncPreviewButtons();
  });

  audio.addEventListener("waiting", () => {
    playerIsLoading = true;
    els.player.classList.add("is-loading");
  });

  audio.addEventListener("loadedmetadata", updatePlayerTimeline);
  audio.addEventListener("timeupdate", updatePlayerTimeline);
  audio.addEventListener("durationchange", updatePlayerTimeline);

  audio.addEventListener("ended", () => {
    playerIsLoading = false;
    els.player.classList.remove("is-playing", "is-loading");
    syncPreviewButtons();
  });

  audio.addEventListener("error", () => {
    if (!currentArtistId) return;
    playerIsLoading = false;
    els.player.classList.remove("is-playing", "is-loading");
    showToast(T.previewFailed, artistCurrentAppleUrl());
    syncPreviewButtons();
  });

  /* ------------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------------ */

  function showToast(message, link) {
    clearTimeout(toastTimer);
    els.toastText.textContent = message;
    if (link) {
      els.toastLink.href = link;
      els.toastLink.textContent = `${T.openAppleFallback} ↗`;
      els.toastLink.hidden = false;
    } else {
      els.toastLink.hidden = true;
    }
    els.toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      els.toast.hidden = true;
    }, 7000);
  }

  /* ------------------------------------------------------------------------
     Events
     ------------------------------------------------------------------------ */

  function bindEvents() {
    els.langSwitch.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lang]");
      if (button) setLanguage(button.dataset.lang);
    });

    els.regionChips.addEventListener("click", (event) => {
      const button = event.target.closest("[data-region]");
      if (!button) return;
      state.region = button.dataset.region;
      state.animateCards = false;
      renderFilters();
      renderArtists();
      focusActiveRegionChip();
    });

    els.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      state.animateCards = false;
      renderArtists();
    });

    els.sortSelect.addEventListener("change", (event) => {
      state.sort = event.target.value;
      state.animateCards = false;
      renderArtists();
    });

    els.styleSelect.addEventListener("change", (event) => {
      state.style = event.target.value;
      state.animateCards = false;
      renderArtists();
    });

    els.manifestoChoices.forEach((button) => {
      button.addEventListener("click", () => setManifesto(button.dataset.manifestoChoice));
    });

    els.resetFilters.addEventListener("click", resetFilters);

    els.artistGrid.addEventListener("click", (event) => {
      const previewButton = event.target.closest("[data-preview]");
      if (previewButton) {
        event.preventDefault();
        event.stopPropagation();
        const artist = ARTIST_MAP[previewButton.dataset.preview];
        if (artist) playPreview(artist, previewButton);
        return;
      }
      const openButton = event.target.closest("[data-open]");
      if (openButton) {
        openArtist(openButton.dataset.open, openButton);
      }
    });

    els.drawerContent.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-drawer]")) {
        closeArtist();
        return;
      }
      const trackButton = event.target.closest("[data-track]");
      if (trackButton) {
        const key = trackButton.dataset.track;
        const [artistId, rawIndex] = key.split(":");
        const artist = ARTIST_MAP[artistId];
        const track = TOP_TRACKS[artistId]?.[Number(rawIndex)];
        if (artist && track) playPreview(artist, trackButton, track, key);
        return;
      }
      const previewButton = event.target.closest("[data-preview]");
      if (previewButton) {
        const artist = ARTIST_MAP[previewButton.dataset.preview];
        if (artist) playPreview(artist, previewButton);
      }
    });

    els.playerPlay.addEventListener("click", () => {
      if (!currentArtistId) return;
      if (audio.paused) {
        if (audio.ended) audio.currentTime = 0;
        startPlayback();
      } else {
        audio.pause();
      }
    });

    els.playerClose.addEventListener("click", closePlayer);

    els.playerSeek.addEventListener("input", (event) => {
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30;
      const ratio = Number(event.target.value) / 1000;
      audio.currentTime = ratio * duration;
      updatePlayerTimeline();
    });

    els.playerVolume.addEventListener("input", (event) => {
      setVolume(event.target.value);
    });

    els.playerMute.addEventListener("click", toggleMute);

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-open-method]")) {
        event.preventDefault();
        openMethod();
      }
      if (event.target.closest("[data-close-method]")) {
        closeMethod();
      }
    });

    els.methodDialog.addEventListener("click", (event) => {
      if (event.target === els.methodDialog) closeMethod();
    });
    els.methodDialog.addEventListener("close", () => {
      document.body.classList.remove("method-open");
    });

    els.artistDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeArtist();
    });

    els.artistDialog.addEventListener("click", (event) => {
      if (event.target === els.artistDialog) {
        const rect = els.artistDialog.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right
          && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!inside) closeArtist();
      }
    });

    els.artistDialog.addEventListener("close", () => {
      drawerArtistId = null;
      els.artistDialog.classList.remove("is-open");
      document.body.classList.remove("drawer-open");
      if (els.player.parentElement === els.artistDialog) {
        document.body.appendChild(els.player);
      }
      clearTimeout(drawerCloseTimer);
      if (previousFocus && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
      previousFocus = null;
    });

    els.drawerContent.addEventListener("error", (event) => {
      if (event.target.matches && event.target.matches(".project-art img")) {
        const wrapper = event.target.closest(".project-art");
        if (wrapper) wrapper.classList.add("is-fallback");
      }
    }, true);

    document.addEventListener("keydown", (event) => {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      const isField = ["INPUT", "TEXTAREA", "SELECT"].includes(tag)
        || (document.activeElement && document.activeElement.isContentEditable);
      const hasOpenDialog = Boolean(document.querySelector("dialog[open]"));

      if (event.key === "/" && !isField && !hasOpenDialog) {
        event.preventDefault();
        els.searchInput.focus();
      }

      if (event.key === "Escape" && !hasOpenDialog && els.player.classList.contains("is-open")) {
        closePlayer();
      }
    });

    window.addEventListener("pagehide", () => {
      audio.pause();
    });
  }

  function resetFilters() {
    state.region = "all";
    state.style = "all";
    state.query = "";
    state.sort = "heat";
    state.animateCards = true;
    els.searchInput.value = "";
    els.styleSelect.value = "all";
    els.sortSelect.value = "heat";
    renderFilters();
    renderArtists();
    focusActiveRegionChip();
  }

  function focusActiveRegionChip() {
    const activeChip = els.regionChips.querySelector(".chip[aria-pressed=\"true\"]");
    if (activeChip) activeChip.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHTML(value).replace(/`/g, "&#96;");
  }
})();

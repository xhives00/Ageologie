const root = document.documentElement;
const body = document.body;
const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
const viewport = document.querySelector("#viewport");
const menuButtons = [...document.querySelectorAll(".menu-button")];
const targetButtons = [...document.querySelectorAll("[data-target]")];
const langButtons = [...document.querySelectorAll(".lang-button")];
const scenePanels = [...document.querySelectorAll(".scene-panel")];

let activeTarget = "hero";
let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
let tick = 0;
let travelTimer;
let focusTimer;
let panelLayer = 20;
let particles = [];

const sectionMap = {
  hero: { x: 880, y: 610, w: 820, h: 420, accent: "rgba(47, 125, 120, 0.34)", glowX: "50%", glowY: "48%" },
  sluzby: { x: 240, y: 220, w: 820, h: 420, accent: "rgba(55, 132, 96, 0.36)", glowX: "25%", glowY: "24%" },
  blog: { x: 1580, y: 210, w: 820, h: 420, accent: "rgba(202, 87, 83, 0.34)", glowX: "76%", glowY: "25%" },
  galerie: { x: 900, y: 1160, w: 820, h: 420, accent: "rgba(156, 113, 70, 0.38)", glowX: "50%", glowY: "78%" },
  cenik: { x: 310, y: 1110, w: 820, h: 420, accent: "rgba(226, 167, 64, 0.4)", glowX: "26%", glowY: "78%" },
  kontakt: { x: 1510, y: 1050, w: 820, h: 420, accent: "rgba(65, 107, 180, 0.34)", glowX: "74%", glowY: "76%" },
};

const translations = {
  cs: {
    "brand.tagline": "In\u017een\u00fdrsk\u00e1 geologie, hydrogeologie, radon",
    "nav.services": "Slu\u017eby",
    "nav.blog": "Blog",
    "nav.gallery": "Galerie",
    "nav.prices": "Cen\u00edk",
    "nav.contact": "Kontakt",
    "object.map": "Mapa vrt\u016f",
    "hero.eyebrow": "Aplikovan\u00e1 geologie v ter\u00e9nu",
    "hero.title": "Geologick\u00e9 pr\u016fzkumy postaven\u00e9 na kvalitn\u00edch ter\u00e9nn\u00edch datech.",
    "hero.copy": "Poskytujeme \u0161irokou nab\u00eddku geologick\u00fdch slu\u017eeb, rychl\u00e9 term\u00edny dod\u00e1n\u00ed a v\u00fdstupy, kter\u00fdm rozum\u00ed investor, projektant i \u00fa\u0159ad.",
    "hero.cta": "Poptat pr\u016fzkum",
    "hero.secondary": "Pr\u00e1ce z ter\u00e9nu",
    "services.eyebrow": "Co firma d\u011bl\u00e1",
    "services.title": "Slu\u017eby",
    "services.one.title": "In\u017een\u00fdrsko-geologick\u00e9 pr\u016fzkumy",
    "services.one.copy": "Pr\u016fzkumy pro rodinn\u00e9 domy, bytov\u00e9 domy, haly, op\u011brn\u00e9 zdi i liniov\u00e9 stavby.",
    "services.two.title": "Hydrogeologick\u00e9 pr\u016fzkumy",
    "services.two.copy": "Vsakovac\u00ed zkou\u0161ky, hydrodynamick\u00e9 zkou\u0161ky, pasport j\u00edmac\u00edch objekt\u016f a odb\u011bry vod.",
    "services.three.title": "Sond\u00e1\u017en\u00ed pr\u00e1ce a radon",
    "services.three.copy": "J\u00e1drov\u00e9 geologick\u00e9 sondy, dynamick\u00e9 penetrace a stanoven\u00ed radonov\u00e9ho indexu pozemku.",
    "blog.eyebrow": "Aktivita, kter\u00e1 buduje d\u016fv\u011bru",
    "blog.title": "Blog a soci\u00e1ln\u00ed s\u00edt\u011b",
    "blog.one.meta": "\u00dano 5, 2026",
    "blog.one.title": "Pro\u010d se vyplat\u00ed objednat in\u017een\u00fdrsko-geologick\u00fd pr\u016fzkum?",
    "blog.one.copy": "Kr\u00e1tk\u00fd \u010dl\u00e1nek z praxe vysv\u011btl\u00ed, pro\u010d se pr\u016fzkum vyplat\u00ed je\u0161t\u011b p\u0159ed za\u010d\u00e1tkem stavby.",
    "blog.two.meta": "Nov\u00e1 akce z ter\u00e9nu",
    "blog.two.title": "Fotky z realizace rovnou na web, Facebook a Instagram",
    "blog.two.copy": "Po p\u0159ihl\u00e1\u0161en\u00ed sta\u010d\u00ed p\u0159idat fotky, lokalitu a kr\u00e1tk\u00fd koment\u00e1\u0159. Web z toho p\u0159iprav\u00ed \u010dl\u00e1nek i soci\u00e1ln\u00ed p\u0159\u00edsp\u011bvky.",
    "gallery.eyebrow": "Pr\u00e1ce, kter\u00e1 je vid\u011bt",
    "gallery.title": "Galerie",
    "gallery.copy": "Fotky z ter\u00e9nu ukazuj\u00ed techniku, skute\u010dn\u00e9 realizace a rozsah zak\u00e1zek. Galerie bude napojen\u00e1 na blog i soci\u00e1ln\u00ed s\u00edt\u011b, aby web p\u016fsobil aktivn\u011b a d\u016fv\u011bryhodn\u011b.",
    "prices.eyebrow": "Transparentn\u00ed start rozhovoru",
    "prices.title": "Cen\u00edk",
    "prices.one": "J\u00e1drov\u00e1 geologick\u00e1 sonda",
    "prices.one.value": "od 2100 K\u010d/m",
    "prices.two": "Dynamick\u00e1 penetrace",
    "prices.two.value": "900 K\u010d/m",
    "prices.three": "Pr\u016fzkum pro rodinn\u00fd d\u016fm",
    "prices.three.value": "14 000 - 25 000 K\u010d",
    "prices.four": "Vsakovac\u00ed zkou\u0161ka",
    "prices.four.value": "od 5000 K\u010d",
    "prices.five": "Hydrogeologick\u00fd pr\u016fzkum pro \u010cOV",
    "prices.five.value": "od 10 000 K\u010d",
    "prices.six": "Radonov\u00fd index pozemku",
    "prices.six.value": "od 4000 K\u010d",
    "prices.note": "Re\u00e1ln\u00e1 cena z\u00e1vis\u00ed na lokalit\u011b, geologick\u00fdch podm\u00ednk\u00e1ch, p\u0159\u00edstupu na pozemek a rozsahu prac\u00ed.",
    "contact.eyebrow": "Rychl\u00e1 cesta k zak\u00e1zce",
    "contact.title": "Kontakt",
    "contact.one.role": "In\u017een\u00fdrskogeologick\u00e9 pr\u016fzkumy",
    "contact.two.role": "Hydrogeologie, vsakovac\u00ed zkou\u0161ky, radon",
    "social.instagram": "Instagram",
    "social.facebook": "Facebook",
    "social.x": "X",
    "form.name": "Jm\u00e9no",
    "form.email": "E-mail",
    "form.message": "Stru\u010dn\u011b popi\u0161te pozemek nebo projekt",
    "form.submit": "Odeslat popt\u00e1vku",
  },
  en: {
    "brand.tagline": "Engineering geology, hydrogeology, radon",
    "nav.services": "Services",
    "nav.blog": "Blog",
    "nav.gallery": "Gallery",
    "nav.prices": "Pricing",
    "nav.contact": "Contact",
    "object.map": "Borehole map",
    "hero.eyebrow": "Applied geology in the field",
    "hero.title": "Geological surveys built on reliable field data.",
    "hero.copy": "We provide a broad range of geological services, fast delivery dates and outputs that investors, designers and authorities can work with.",
    "hero.cta": "Request a survey",
    "hero.secondary": "Field work",
    "services.eyebrow": "What the company does",
    "services.title": "Services",
    "services.one.title": "Engineering geological surveys",
    "services.one.copy": "Surveys for family houses, apartment buildings, halls, retaining walls and linear structures.",
    "services.two.title": "Hydrogeological surveys",
    "services.two.copy": "Infiltration tests, hydrodynamic tests, intake structure passports and water sampling.",
    "services.three.title": "Borehole work and radon",
    "services.three.copy": "Core geological boreholes, dynamic penetration tests and radon index assessment.",
    "blog.eyebrow": "Activity that builds trust",
    "blog.title": "Blog and social media",
    "blog.one.meta": "Feb 5, 2026",
    "blog.one.title": "Why order an engineering geological survey?",
    "blog.one.copy": "A short practical article explains why the survey pays off before construction starts.",
    "blog.two.meta": "New field project",
    "blog.two.title": "Project photos published to the website, Facebook and Instagram",
    "blog.two.copy": "After login, the team adds photos, location and a short note. The site prepares a blog article and social posts.",
    "gallery.eyebrow": "Visible field work",
    "gallery.title": "Gallery",
    "gallery.copy": "Field photos show equipment, real projects and the scale of the work. The gallery will connect to the blog and social channels so the website feels active and trustworthy.",
    "prices.eyebrow": "A transparent start",
    "prices.title": "Pricing",
    "prices.one": "Core geological borehole",
    "prices.one.value": "from CZK 2100/m",
    "prices.two": "Dynamic penetration test",
    "prices.two.value": "CZK 900/m",
    "prices.three": "Survey for a family house",
    "prices.three.value": "CZK 14,000 - 25,000",
    "prices.four": "Infiltration test",
    "prices.four.value": "from CZK 5000",
    "prices.five": "Hydrogeological survey for WWTP",
    "prices.five.value": "from CZK 10,000",
    "prices.six": "Radon index of land",
    "prices.six.value": "from CZK 4000",
    "prices.note": "The real price depends on location, geological conditions, site access and the scope of work.",
    "contact.eyebrow": "A fast route to the project",
    "contact.title": "Contact",
    "contact.one.role": "Engineering geological surveys",
    "contact.two.role": "Hydrogeology, infiltration tests, radon",
    "social.instagram": "Instagram",
    "social.facebook": "Facebook",
    "social.x": "X",
    "form.name": "Name",
    "form.email": "E-mail",
    "form.message": "Briefly describe the land or project",
    "form.submit": "Send inquiry",
  },
  de: {
    "brand.tagline": "Ingenieurgeologie, Hydrogeologie, Radon",
    "nav.services": "Leistungen",
    "nav.blog": "Blog",
    "nav.gallery": "Galerie",
    "nav.prices": "Preise",
    "nav.contact": "Kontakt",
    "object.map": "Bohrkarte",
    "hero.eyebrow": "Angewandte Geologie im Gel\u00e4nde",
    "hero.title": "Geologische Untersuchungen auf Basis verl\u00e4sslicher Gel\u00e4ndedaten.",
    "hero.copy": "Wir bieten ein breites Spektrum geologischer Leistungen, schnelle Liefertermine und Unterlagen, mit denen Bauherren, Planer und Beh\u00f6rden arbeiten k\u00f6nnen.",
    "hero.cta": "Untersuchung anfragen",
    "hero.secondary": "Gel\u00e4ndearbeiten",
    "services.eyebrow": "Was das Unternehmen macht",
    "services.title": "Leistungen",
    "services.one.title": "Ingenieurgeologische Untersuchungen",
    "services.one.copy": "Untersuchungen f\u00fcr Einfamilienh\u00e4user, Mehrfamilienh\u00e4user, Hallen, St\u00fctzmauern und Linienbauwerke.",
    "services.two.title": "Hydrogeologische Untersuchungen",
    "services.two.copy": "Versickerungsversuche, hydrodynamische Tests, Dokumentation von Fassungsobjekten und Wasserproben.",
    "services.three.title": "Sondierungen und Radon",
    "services.three.copy": "Geologische Kernbohrungen, dynamische Penetrationen und Bestimmung des Radonindex.",
    "blog.eyebrow": "Aktivit\u00e4t, die Vertrauen schafft",
    "blog.title": "Blog und soziale Medien",
    "blog.one.meta": "5. Feb. 2026",
    "blog.one.title": "Warum lohnt sich eine ingenieurgeologische Untersuchung?",
    "blog.one.copy": "Ein kurzer Praxisartikel erkl\u00e4rt, warum sich die Untersuchung bereits vor Baubeginn auszahlt.",
    "blog.two.meta": "Neues Projekt im Gel\u00e4nde",
    "blog.two.title": "Fotos direkt auf Website, Facebook und Instagram",
    "blog.two.copy": "Nach dem Login werden Fotos, Standort und ein kurzer Kommentar erg\u00e4nzt. Daraus entstehen Blogartikel und Social-Media-Beitr\u00e4ge.",
    "gallery.eyebrow": "Sichtbare Gel\u00e4ndearbeit",
    "gallery.title": "Galerie",
    "gallery.copy": "Fotos aus dem Gel\u00e4nde zeigen Technik, echte Projekte und den Umfang der Auftr\u00e4ge. Die Galerie wird mit Blog und Social Media verbunden, damit die Website aktiv und vertrauensw\u00fcrdig wirkt.",
    "prices.eyebrow": "Ein transparenter Einstieg",
    "prices.title": "Preise",
    "prices.one": "Geologische Kernbohrung",
    "prices.one.value": "ab 2100 CZK/m",
    "prices.two": "Dynamische Penetration",
    "prices.two.value": "900 CZK/m",
    "prices.three": "Untersuchung f\u00fcr ein Einfamilienhaus",
    "prices.three.value": "14.000 - 25.000 CZK",
    "prices.four": "Versickerungsversuch",
    "prices.four.value": "ab 5000 CZK",
    "prices.five": "Hydrogeologische Untersuchung f\u00fcr Kl\u00e4ranlage",
    "prices.five.value": "ab 10.000 CZK",
    "prices.six": "Radonindex des Grundst\u00fccks",
    "prices.six.value": "ab 4000 CZK",
    "prices.note": "Der tats\u00e4chliche Preis h\u00e4ngt von Standort, geologischen Bedingungen, Zug\u00e4nglichkeit und Arbeitsumfang ab.",
    "contact.eyebrow": "Der schnelle Weg zum Auftrag",
    "contact.title": "Kontakt",
    "contact.one.role": "Ingenieurgeologische Untersuchungen",
    "contact.two.role": "Hydrogeologie, Versickerungsversuche, Radon",
    "social.instagram": "Instagram",
    "social.facebook": "Facebook",
    "social.x": "X",
    "form.name": "Name",
    "form.email": "E-Mail",
    "form.message": "Grundst\u00fcck oder Projekt kurz beschreiben",
    "form.submit": "Anfrage senden",
  },
};

function resize() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * ratio);
  canvas.height = Math.floor(innerHeight * ratio);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  focusSection(activeTarget, false);
}

function updateActiveMenu(target) {
  menuButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === target);
  });
}

function raisePanel(target) {
  const panel = document.querySelector(`[data-section="${target}"]`);
  if (!panel) return;

  panelLayer += 1;
  scenePanels.forEach((item) => item.classList.toggle("active-panel", item === panel));
  panel.style.zIndex = String(panelLayer);
}

function getPanelMetrics(target) {
  const panel = document.querySelector(`[data-section="${target}"]`);
  const section = sectionMap[target];
  if (!panel || !section) return null;

  return {
    ...section,
    x: panel.offsetLeft,
    y: panel.offsetTop,
    w: panel.offsetWidth,
    h: panel.offsetHeight,
  };
}

function calculateFocusScale(metrics) {
  const targetWidth = innerWidth * 0.8;
  const targetHeight = innerHeight * 0.78;
  const scale = Math.min(targetWidth / metrics.w, targetHeight / metrics.h);
  return Math.max(0.84, Math.min(scale, 1.85));
}

function calculateOverviewScale() {
  const scaleX = (innerWidth * 0.86) / viewport.offsetWidth;
  const scaleY = (innerHeight * 0.78) / viewport.offsetHeight;
  return Math.max(0.38, Math.min(scaleX, scaleY, 0.72));
}

function moveCameraTo(metrics, scale, duration) {
  viewport.style.transitionDuration = `${duration}ms`;
  const x = innerWidth / 2 - scale * (metrics.x + metrics.w / 2);
  const y = innerHeight / 2 - scale * (metrics.y + metrics.h / 2);
  root.style.setProperty("--grid-x", `${x}px`);
  root.style.setProperty("--grid-y", `${y}px`);
  root.style.setProperty("--stage-scale", String(scale));
}

function showOverview(duration = 420) {
  const metrics = {
    x: 0,
    y: 0,
    w: viewport.offsetWidth,
    h: viewport.offsetHeight,
  };

  moveCameraTo(metrics, calculateOverviewScale(), duration);
}

function focusSection(target, animate = true) {
  activeTarget = target;
  updateActiveMenu(target);
  raisePanel(target);
  clearTimeout(focusTimer);

  const section = sectionMap[target];

  if (innerWidth <= 860) {
    focusMobileSection(target, section, animate);
    return;
  }

  const metrics = getPanelMetrics(target);
  if (!metrics) return;

  root.style.setProperty("--travel-color", metrics.accent);
  root.style.setProperty("--travel-x", metrics.glowX);
  root.style.setProperty("--travel-y", metrics.glowY);

  if (animate) {
    clearTimeout(travelTimer);
    body.classList.add("is-traveling");
    spawnTransitionParticles(metrics);
    showOverview(420);
    focusTimer = setTimeout(() => {
      moveCameraTo(metrics, calculateFocusScale(metrics), 980);
    }, 430);
    travelTimer = setTimeout(() => body.classList.remove("is-traveling"), 1220);
    return;
  }

  moveCameraTo(metrics, calculateFocusScale(metrics), 0);
}

function focusMobileSection(target, section, animate = true) {
  const panel = document.querySelector(`[data-section="${target}"]`);
  if (!panel) return;

  if (section) {
    root.style.setProperty("--travel-color", section.accent);
    root.style.setProperty("--travel-x", section.glowX);
    root.style.setProperty("--travel-y", section.glowY);
  }

  clearTimeout(travelTimer);
  if (animate) {
    body.classList.add("is-traveling", "mobile-jump");
    spawnTransitionParticles(section || { glowX: "50%", glowY: "50%" }, 44);
    setTimeout(() => {
      panel.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 90);
    travelTimer = setTimeout(() => body.classList.remove("is-traveling", "mobile-jump"), 920);
    return;
  }

  panel.scrollIntoView({ behavior: "auto", block: "center" });
}

function spawnTransitionParticles(metrics, count = 76) {
  const targetX = (parseFloat(metrics.glowX) / 100) * innerWidth;
  const targetY = (parseFloat(metrics.glowY) / 100) * innerHeight;
  const colors = [
    "47, 125, 120",
    "200, 85, 61",
    "226, 167, 64",
    "112, 95, 74",
    "245, 236, 204",
  ];

  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 220;
    const speed = 0.45 + Math.random() * 2.6;
    const fromTarget = Math.random() > 0.42;

    particles.push({
      x: fromTarget ? targetX + Math.cos(angle) * distance : Math.random() * innerWidth,
      y: fromTarget ? targetY + Math.sin(angle) * distance : Math.random() * innerHeight,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.8,
      vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.8,
      size: 1.6 + Math.random() * 5.2,
      life: 0,
      maxLife: 46 + Math.random() * 58,
      color: colors[Math.floor(Math.random() * colors.length)],
      spin: (Math.random() - 0.5) * 0.14,
      rotation: Math.random() * Math.PI,
      shape: Math.random() > 0.55 ? "chip" : "dust",
    });
  }

  particles = particles.slice(-180);
}

function setLanguage(lang) {
  const dictionary = translations[lang] || translations.cs;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) element.textContent = dictionary[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (dictionary[key]) element.placeholder = dictionary[key];
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.dataset.i18nAria;
    if (dictionary[key]) element.setAttribute("aria-label", dictionary[key]);
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  try {
    localStorage.setItem("ageologie-language", lang);
  } catch {
    return;
  }
}

function drawDeskTexture() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const driftX = (mouse.x - innerWidth / 2) * 0.006;
  const driftY = (mouse.y - innerHeight / 2) * 0.006;

  ctx.save();
  ctx.translate(driftX, driftY);

  for (let y = -40; y < innerHeight + 80; y += 46) {
    ctx.beginPath();
    for (let x = -80; x < innerWidth + 90; x += 28) {
      const wave = Math.sin((x + tick * 0.12) * 0.012 + y * 0.01) * 4;
      if (x === -80) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.strokeStyle = "rgba(20, 37, 39, 0.045)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const accents = [
    ["#2f7d78", innerWidth * 0.18, innerHeight * 0.78],
    ["#c8553d", innerWidth * 0.83, innerHeight * 0.24],
    ["#d9a13f", innerWidth * 0.76, innerHeight * 0.82],
  ];

  accents.forEach(([color, x, y], index) => {
    ctx.beginPath();
    ctx.arc(x, y, 26 + index * 12 + Math.sin(tick * 0.018 + index) * 3, 0, Math.PI * 2);
    ctx.strokeStyle = `${color}22`;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  ctx.restore();
}

function drawParticles() {
  if (!particles.length) return;

  particles = particles.filter((particle) => particle.life < particle.maxLife);

  particles.forEach((particle) => {
    particle.life += 1;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.985;
    particle.vy = particle.vy * 0.985 + 0.012;
    particle.rotation += particle.spin;

    const alpha = Math.max(0, 1 - particle.life / particle.maxLife);
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = `rgba(${particle.color}, ${alpha * 0.62})`;
    ctx.strokeStyle = `rgba(${particle.color}, ${alpha * 0.42})`;

    if (particle.shape === "chip") {
      ctx.beginPath();
      ctx.moveTo(0, -particle.size);
      ctx.lineTo(particle.size * 0.92, particle.size * 0.2);
      ctx.lineTo(particle.size * 0.22, particle.size);
      ctx.lineTo(-particle.size * 0.9, particle.size * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

function draw() {
  tick += 1;
  drawDeskTexture();
  drawParticles();
  requestAnimationFrame(draw);
}

addEventListener("resize", resize);
addEventListener("mousemove", (event) => {
  mouse = { x: event.clientX, y: event.clientY };
});

targetButtons.forEach((button) => {
  button.addEventListener("click", () => focusSection(button.dataset.target));
});

scenePanels.forEach((panel) => {
  panel.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-target]")) return;
    focusSection(panel.dataset.section);
  });
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

const savedLanguage = (() => {
  try {
    return localStorage.getItem("ageologie-language");
  } catch {
    return null;
  }
})();

setLanguage(savedLanguage || "cs");
resize();
focusSection("hero", false);
draw();

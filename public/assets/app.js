const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (id) => document.getElementById(id);

// Links from config.json: allow only in-page anchors, site paths, http(s), mailto: and tel:.
// Anything else (javascript:, data:, protocol-relative //…) becomes a harmless "#".
const safeHref = (href) => {
  const h = String(href ?? '').trim();
  return /^(#|\/(?!\/)|https?:\/\/|mailto:|tel:)/i.test(h) ? h : '#';
};

const ARROW = `<svg class="w-3 h-4 shrink-0" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
  ${[[2,2],[5,5],[8,8],[5,11],[2,14],[2,8],[5,8]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="1"/>`).join('')}</svg>`;

const radial = (n, r, fn) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2;
  return fn(12 + Math.cos(a) * r, 12 + Math.sin(a) * r, a);
}).join('');

const ICON_PATHS = {
  ai: '<rect x="2.5" y="2.5" width="19" height="19" rx="5"/><path d="M6.5 16.5 9.5 7.5l3 9M7.6 13.3h3.8M16.5 7.5v9"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  user: '<circle cx="12" cy="7.5" r="4.5"/><path d="M3.5 21.5a8.5 8.5 0 0 1 17 0"/>',
  funnel: '<ellipse cx="12" cy="4.5" rx="9" ry="2.5"/><path d="M3 4.5l7 8.5v7.5l4-1.5v-6l7-8.5"/>',
  coins: '<ellipse cx="7.5" cy="5" rx="5" ry="2"/><path d="M2.5 5v4c0 1.1 2.2 2 5 2s5-.9 5-2V5M2.5 9v4c0 1.1 2.2 2 5 2M2.5 13v4c0 1.1 2.2 2 5 2"/><circle cx="16" cy="15" r="6"/><path d="M17.6 13c-.4-.5-1-.7-1.6-.7-.9 0-1.6.5-1.6 1.2 0 1.6 3.4.9 3.4 2.6 0 .7-.8 1.2-1.7 1.2-.7 0-1.3-.3-1.7-.8M16 11v1.3M16 17.4v1.3"/>',
  health: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  cart: '<circle cx="8" cy="21" r="1.2"/><circle cx="19" cy="21" r="1.2"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12M9 11h10"/>',
  cloud: '<path d="M17.5 17H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 12h2.5l1-2 1.5 4 1-2h2M12 17v3M9 17v2M15 17v2"/><circle cx="12" cy="21" r=".8"/><circle cx="9" cy="20" r=".8"/><circle cx="15" cy="20" r=".8"/>',
  briefcase: '<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 12h20M10.5 12v2h3v-2"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5.5 5.5"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 17h6M9.5 19.5h5M10.5 22h3M10.5 13.5 12 6.5l1.5 7"/>',
  network: '<circle cx="12" cy="12" r="2.6"/>' + radial(8, 8.5, (x, y) => `<path d="M${(12 + (x - 12) * .31).toFixed(2)} ${(12 + (y - 12) * .31).toFixed(2)}L${(12 + (x - 12) * .8).toFixed(2)} ${(12 + (y - 12) * .8).toFixed(2)}"/><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.7"/>`),
  gear: '<path d="M10.3 2.5h3.4l.5 2.6 1.9.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.9 2.6.5v3.4l-2.6.5-.8 1.9 1.5 2.2-2.4 2.4-2.2-1.5-1.9.8-.5 2.6h-3.4l-.5-2.6-1.9-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.9-2.6-.5v-3.4l2.6-.5.8-1.9-1.5-2.2 2.4-2.4 2.2 1.5 1.9-.8z"/><circle cx="12" cy="12" r="4.6"/><path d="m10 12.1 1.4 1.4 2.6-2.8"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 7 9 6.5L21 7"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.4-5.1A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/>',
  sheet: '<rect x="3.5" y="2.5" width="17" height="19" rx="2.5"/><path d="M3.5 8.5h17M3.5 14.5h17M9.5 8.5v13"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/>'
};

const iconPath = (key) => Object.prototype.hasOwnProperty.call(ICON_PATHS, key) ? ICON_PATHS[key] : '';

// Stacked strokes fake a glass tube: soft wide halo, translucent blue edge, bright inner core.
const icon = (key, size = 'w-24 h-24') => {
  const d = iconPath(key);
  return `
  <div class="glass-icon ${size}">
    <svg viewBox="-1 -1 26 26" class="w-full h-full" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <g stroke="#a5f3fc" stroke-opacity=".35" stroke-width="3.6">${d}</g>
      <g stroke="url(#glassEdge)" stroke-width="2.3">${d}</g>
      <g stroke="url(#glassCore)" stroke-width="1">${d}</g>
    </svg>
  </div>`;
};

const eyebrow = (t) => `<span class="inline-block rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200/70 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-ink">${esc(t)}</span>`;

const btn = (cta, variant = 'primary', extra = '') => {
  const styles = variant === 'primary'
    ? 'btn-sky'
    : 'bg-dark text-white hover:bg-black';
  return `<a href="${esc(safeHref(cta.href))}" class="inline-flex items-center justify-center gap-3 rounded-md px-5 py-3 text-sm font-semibold transition ${styles} ${extra}">${esc(cta.label)}${ARROW}</a>`;
};

const sectionHead = (s) => `
  <div class="text-center mx-auto max-w-2xl reveal">
    ${eyebrow(s.eyebrow)}
    <h2 class="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">${esc(s.title)}</h2>
    ${s.subtitle ? `<p class="mt-4 text-muted text-base sm:text-lg leading-relaxed">${esc(s.subtitle)}</p>` : ''}
  </div>`;

const dotLine = (extra = '') => `<div class="relative dash-line ${extra}"><span class="absolute -left-1 -top-[3px] w-[7px] h-[7px] rounded-full bg-ink"></span><span class="absolute -right-1 -top-[3px] w-[7px] h-[7px] rounded-full bg-ink"></span></div>`;

const brand = (c, w = 'w-20') => `<span class="brand ${w}"><img src="${esc(c.site.logoImage)}" alt="${esc(c.site.name)}" /></span>`;

/* ---------- Sections ---------- */

function renderNav(c) {
  const links = c.nav.links.map(l => `<a href="${esc(safeHref(l.href))}" class="text-sm font-medium text-ink hover:text-accentdeep transition">${esc(l.label)}</a>`).join('');
  $('nav').innerHTML = `
    <nav class="max-w-6xl mx-auto rounded-xl bg-white/85 backdrop-blur border border-line shadow-[0_4px_20px_rgba(12,34,51,.05)]">
      <div class="flex items-center justify-between px-4 sm:px-5 py-2.5">
        <a href="/" aria-label="${esc(c.site.name)} home">${brand(c, 'w-20 sm:w-24')}</a>
        <div class="hidden md:flex items-center gap-8">${links}</div>
        <div class="hidden md:block">${btn(c.nav.cta, 'secondary')}</div>
        <button id="menu-btn" class="md:hidden p-2 rounded-md border border-line text-ink" aria-label="Toggle menu" aria-expanded="false">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
      <div id="mobile-menu" class="hidden md:hidden border-t border-line px-4 py-4 flex flex-col gap-4">
        ${links}
        ${btn(c.nav.cta, 'secondary', 'w-full')}
      </div>
    </nav>`;
  const b = $('menu-btn'), m = $('mobile-menu');
  b.addEventListener('click', () => {
    const open = m.classList.toggle('hidden') === false;
    b.setAttribute('aria-expanded', open);
  });
  m.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { m.classList.add('hidden'); b.setAttribute('aria-expanded', 'false'); }));
}

function renderHero(c) {
  const h = c.hero;
  // Center sphere ringed by eight smaller ones of varied size, as in the design.
  const ring = [[24, 0], [17, 45], [22, 90], [15, 135], [23, 180], [14, 225], [20, 270], [13, 315]];
  // Each bubble gets its own path, slow duration and negative delay so they never move in sync.
  const motion = (i) => `--drift:drift${'ABC'[i % 3]};--dur:${14 + (i * 7) % 9}s;--delay:-${(i * 3.7) % 12}s`;
  const bubbles = [`<span class="bubble" style="width:26%;height:26%;left:50%;top:50%;${motion(0)}"></span>`]
    .concat(ring.map(([s, deg], i) => {
      const a = (deg - 90) * Math.PI / 180;
      return `<span class="bubble" style="width:${s}%;height:${s}%;left:${50 + Math.cos(a) * 37}%;top:${50 + Math.sin(a) * 37}%;${motion(i + 1)}"></span>`;
    })).join('');
  $('hero').innerHTML = `
    <div class="halftone w-[160%] h-72 -left-1/4 top-28 -rotate-[14deg]"></div>
    <div class="relative max-w-6xl mx-auto px-4 pt-16 pb-24 sm:pt-24 sm:pb-28 grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
      <div class="reveal">
        ${eyebrow(h.eyebrow)}
        <h1 class="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em]">${esc(h.title)}</h1>
        <p class="mt-6 max-w-md text-lg text-muted leading-relaxed">${esc(h.subtitle)}</p>
        <div class="mt-10 flex flex-wrap gap-4">${btn(h.primaryCta)}${btn(h.secondaryCta, 'secondary')}</div>
      </div>
      <div class="relative mx-auto w-full max-w-[320px] sm:max-w-[400px] aspect-square">${bubbles}</div>
    </div>`;
}

function renderLogos(c) {
  const row = c.logos.items.map(it => `
    <span class="flex items-center gap-2.5 px-8 text-lg font-semibold text-ink/80 whitespace-nowrap">
      <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200/70 grid place-items-center text-accentdeep shadow-[0_0_10px_rgba(56,189,248,.18)]">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPath(it.icon)}</svg>
      </span>${esc(it.label)}
    </span>`).join('');
  $('logos').innerHTML = `
    <div class="relative max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-8">
      <p class="text-sm text-ink md:w-80 shrink-0 text-center md:text-left">${esc(c.logos.text)}</p>
      <div class="marquee-mask overflow-hidden flex-1 w-full"><div class="marquee-track">${row}${row}</div></div>
    </div>`;
}

function renderStats(c) {
  $('stats').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div class="grid grid-cols-2 lg:grid-cols-4 rounded-2xl sky-panel overflow-hidden">
        ${c.stats.map((s, i) => `
          <div class="p-6 sm:p-8 text-center border-line ${i % 2 ? '' : 'border-r'} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i < 3 ? 'lg:border-r' : 'lg:border-r-0'}">
            <div class="min-h-[4.75rem] sm:min-h-[5.5rem] flex flex-col items-center justify-center">
            ${s.value
              ? `<div class="font-display text-4xl sm:text-5xl font-semibold text-accentdeep [text-shadow:0_0_18px_rgba(56,189,248,.35)]">${esc(s.value)}</div>
                 <div class="mt-2 text-sm sm:text-base font-medium text-ink">${esc(s.label)}</div>`
              : `<div class="font-display text-2xl sm:text-3xl leading-tight font-semibold text-accentdeep [text-shadow:0_0_18px_rgba(56,189,248,.35)]">${esc(s.label)}</div>`}
            </div>
            ${s.note ? `<div class="mt-1.5 text-xs sm:text-sm text-muted leading-snug max-w-[16rem] mx-auto">${esc(s.note)}</div>` : ''}
          </div>`).join('')}
      </div>
    </div>`;
}

function renderProblems(c) {
  const p = c.problems;
  $('problems').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-24">
      ${sectionHead(p)}
      <div class="mt-16 grid md:grid-cols-3 gap-6">
        ${p.items.map(it => `
          <article class="group reveal rounded-2xl border border-line bg-white p-8 text-center transition hover:shadow-[0_12px_40px_rgba(12,34,51,.07)]">
            <h3 class="font-display text-2xl font-semibold">${esc(it.title)}</h3>
            <svg viewBox="0 0 100 110" class="mx-auto my-10 w-28" aria-hidden="true">
              <polygon points="50,4 95,30 95,80 50,106 5,80 5,30" fill="url(#hexFill)" stroke="#c9e5f4" stroke-width="2"/>
              <polygon points="50,16 84,36 84,74 50,94 16,74 16,36" fill="#f5fbff" stroke="#d5e8f3" stroke-width="1.5"/>
              <text x="50" y="66" text-anchor="middle" font-family="Inter Tight, sans-serif" font-weight="700" font-size="30" fill="#38bdf8" style="filter: drop-shadow(0 0 5px rgba(34,211,238,.55)) drop-shadow(0 0 12px rgba(34,211,238,.3))">${esc(it.number)}</text>
            </svg>
            <p class="text-muted leading-relaxed">${esc(it.description)}</p>
          </article>`).join('')}
      </div>
    </div>`;
}

function renderServices(c) {
  const s = c.services;
  const rows = [];
  for (let i = 0; i < s.items.length; i += 2) rows.push(s.items.slice(i, i + 2));
  $('services').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-24">
      ${sectionHead(s)}
      ${rows.map(row => `
        ${dotLine('mt-16')}
        <div class="pt-12 grid md:grid-cols-2 gap-x-16 gap-y-16">
          ${row.map(it => `
            <article class="group reveal">
              ${icon(it.icon, 'w-24 h-24 sm:w-28 sm:h-28')}
              <h3 class="mt-8 font-display text-2xl font-semibold">${esc(it.title)}</h3>
              <p class="mt-4 text-muted leading-relaxed max-w-md">${esc(it.description)}</p>
              <span class="mt-8 inline-block rounded bg-gradient-to-r from-sky-100 to-cyan-100 px-3 py-2 text-sm text-sky-700 shadow-[0_0_14px_rgba(34,211,238,.18)]">${esc(it.outcome)}</span>
            </article>`).join('')}
        </div>`).join('')}
      <div class="mt-16 text-center">
        <button id="services-more-btn" type="button" aria-expanded="false" aria-controls="services-more" class="inline-flex items-center justify-center gap-3 rounded-md px-5 py-3 text-sm font-semibold transition btn-sky"><span class="btn-label">${esc(s.cta.label)}</span>${ARROW}</button>
        <div id="services-more" class="hidden mt-8 mx-auto max-w-3xl rounded-2xl sky-panel px-6 py-6 sm:px-10 sm:py-8 text-left">
          <p class="text-ink text-base sm:text-lg leading-relaxed">${esc(s.cta.details)}</p>
          ${s.cta.points ? `<ul class="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-5">${s.cta.points.map(pt => `
            <li class="flex gap-3">
              <span class="mt-2 w-2 h-2 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,.6)]"></span>
              <div>
                <h4 class="font-display font-semibold text-ink">${esc(pt.title)}</h4>
                <p class="mt-1 text-sm text-muted leading-relaxed">${esc(pt.text)}</p>
              </div>
            </li>`).join('')}</ul>` : ''}
          ${s.cta.closing ? `<p class="mt-6 pt-6 border-t border-line text-ink leading-relaxed">${esc(s.cta.closing)}</p>` : ''}
        </div>
      </div>
    </div>`;

  // "Learn More" reveals an explanation paragraph in place instead of jumping to the contact form.
  const moreBtn = $('services-more-btn'), more = $('services-more');
  moreBtn.addEventListener('click', () => {
    const open = more.classList.toggle('hidden') === false;
    moreBtn.setAttribute('aria-expanded', open);
    moreBtn.querySelector('.btn-label').textContent = open ? (s.cta.lessLabel || s.cta.label) : s.cta.label;
  });
}

function renderIndustries(c) {
  const s = c.industries;
  $('industries').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-24">
      <div class="grid md:grid-cols-2 gap-8 items-end reveal">
        <div>${eyebrow(s.eyebrow)}<h2 class="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">${esc(s.title)}</h2></div>
        <p class="text-muted leading-relaxed md:max-w-sm md:justify-self-end">${esc(s.subtitle)}</p>
      </div>
      ${dotLine('mt-10')}
      ${s.items.map((it, i) => `
        <article class="group reveal grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr_auto] gap-x-6 gap-y-6 items-center py-10 ${i ? 'border-t border-dashed border-line' : ''}">
          <span class="text-accentdeep text-sm sm:text-base">${esc(it.number)}</span>
          <div>
            <h3 class="font-display text-2xl font-semibold">${esc(it.title)}</h3>
            <p class="mt-3 text-muted leading-relaxed max-w-md">${esc(it.description)}</p>
          </div>
          <div class="col-start-2 sm:col-start-3 sm:pr-6">${icon(it.icon, 'w-24 h-24 sm:w-28 sm:h-28')}</div>
        </article>`).join('')}
    </div>`;
}

function renderProcess(c) {
  const s = c.process;
  $('process').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-24 relative">
      ${sectionHead(s)}
      <svg class="hidden lg:block absolute inset-x-0 top-[290px] w-full h-72 pointer-events-none" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 210 Q500 -70 1000 210" fill="none" stroke="#a9d6ec" stroke-width="1.5" stroke-dasharray="5 6"/>
      </svg>
      <div class="relative mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        ${s.steps.map((st, i) => `
          <article class="group reveal text-center ${i === 1 || i === 2 ? 'lg:-mt-6' : 'lg:mt-16'}">
            <div class="flex justify-center">${icon(st.icon, 'w-24 h-24')}</div>
            <h3 class="mt-6 font-display text-2xl font-semibold">${esc(st.title)}</h3>
            <p class="mt-3 text-muted leading-relaxed text-sm sm:text-base">${esc(st.description)}</p>
          </article>`).join('')}
      </div>
    </div>`;
}

function renderCase(c) {
  const s = c.caseStudy;
  $('case').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-24">
      <div class="text-center mx-auto max-w-3xl reveal">
        ${eyebrow(s.eyebrow)}
        <h2 class="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">${esc(s.title)}</h2>
        ${s.tagline ? `<p class="mt-5 font-display text-lg sm:text-xl font-semibold tracking-[-0.01em] text-accentdeep">${esc(s.tagline)}</p>` : ''}
        ${s.subtitle ? `<p class="mt-3 mx-auto max-w-xl text-muted text-base sm:text-lg leading-relaxed">${esc(s.subtitle)}</p>` : ''}
      </div>
      ${dotLine('mt-16')}
      <div class="mt-8 rounded-2xl sky-panel p-5 sm:p-8 lg:p-10 grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-10 reveal">
        <div class="flex flex-col">
          <span class="self-start rounded-full bg-gradient-to-r from-sky-100 to-cyan-100 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-sky-700 shadow-[0_0_14px_rgba(34,211,238,.18)]">${esc(s.result)}</span>
          <div class="mt-7 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted">
            ${s.tags.map(esc).join('<span class="w-1 h-1 rounded-full bg-accent"></span>')}
          </div>
          <h3 class="mt-3 font-display text-2xl sm:text-3xl font-semibold leading-snug tracking-[-0.015em]">${esc(s.headline)}</h3>
          <div class="mt-8 lg:mt-auto pt-6">${btn(s.cta, 'secondary')}</div>
        </div>
        ${s.image ? `
        <div class="relative rounded-xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[420px] bg-[#0d0908]">
          <img src="${esc(s.image)}" alt="${esc(s.imageAlt || '')}" class="absolute inset-0 w-full h-full object-cover" />
        </div>` : `
        <div class="scene relative rounded-xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[420px]" role="img" aria-label="Modern office lobby with glowing ceiling lights">
          <span class="ring" style="width:46%;height:16%;left:14%;top:8%"></span>
          <span class="ring" style="width:34%;height:12%;left:38%;top:18%"></span>
          <span class="ring" style="width:30%;height:10%;left:24%;top:27%"></span>
          <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#3b2a1d] to-transparent"></div>
          <div class="absolute right-0 top-[30%] w-1/2 h-[45%] border-l border-t border-white/10 bg-gradient-to-b from-white/5 to-transparent"></div>
          <div class="absolute left-[8%] top-[42%] w-[16%] h-[13%] rounded-sm bg-gradient-to-br from-red-500/70 to-slate-200/40"></div>
          <div class="absolute left-[15%] bottom-[12%] w-[42%] h-[14%] rounded-[50%] bg-[#141010] shadow-[0_10px_40px_rgba(255,190,110,.55)]"></div>
          <div class="absolute inset-0 opacity-25 mix-blend-overlay" style="background-image:radial-gradient(#fff 0.6px,transparent 0.8px);background-size:3px 3px"></div>
        </div>`}
      </div>
      <div class="mt-12 text-center">${btn(s.allCta)}</div>
    </div>`;
}

function renderPricing(c) {
  const s = c.pricing;
  $('pricing').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-24">
      ${sectionHead(s)}
      ${s.proof ? `
      <div class="mt-10 mx-auto max-w-2xl rounded-xl sky-panel px-5 py-4 text-center reveal">
        <div class="text-xs font-semibold uppercase tracking-wide text-accentdeep">${esc(s.proof.label)}</div>
        <p class="mt-1 text-sm sm:text-base text-ink leading-relaxed">${esc(s.proof.text)}</p>
      </div>` : ''}
      ${dotLine('mt-12')}
      <div class="mt-12 grid md:grid-cols-3 gap-10 md:gap-x-8 md:gap-y-0">
        ${s.plans.map(p => `
          <article class="reveal flex flex-col md:grid md:grid-rows-subgrid md:row-span-7">
            <h3 class="font-display text-3xl font-semibold text-accentdeep">${esc(p.name)}<span class="whitespace-nowrap">-${esc(p.price)}</span></h3>
            <div class="mt-3 text-lg font-medium">${esc(p.period)}</div>
            <p class="mt-6 text-muted leading-relaxed">${esc(p.description)}</p>
            <p class="mt-3 text-sm font-medium text-accentdeep leading-snug">${esc(p.roi || '')}</p>
            <ul class="mt-6 space-y-1.5 text-ink">
              ${p.features.map(f => `<li>• ${esc(f)}</li>`).join('')}
            </ul>
            <div class="mt-8">${btn(p.cta, p.featured ? 'primary' : 'secondary', 'w-full')}</div>
            <ul class="mt-4 space-y-2 text-xs sm:text-sm text-muted leading-snug">
              ${(p.notes || []).map(n => `<li class="flex gap-2"><svg viewBox="0 0 24 24" class="w-4 h-4 shrink-0 mt-px text-accentdeep" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg><span>${esc(n)}</span></li>`).join('')}
            </ul>
          </article>`).join('')}
      </div>
    </div>`;
}

function renderFaq(c) {
  const s = c.faq;
  $('faq').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-24 grid lg:grid-cols-[1fr_1.4fr] gap-12">
      <div class="reveal">${eyebrow(s.eyebrow)}<h2 class="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em] max-w-sm leading-[1.05]">${esc(s.title)}</h2></div>
      <div class="divide-y divide-line border-y border-line">
        ${s.items.map(it => `
          <details class="reveal py-5">
            <summary class="flex cursor-pointer items-center justify-between gap-6 text-lg text-ink hover:text-accentdeep transition">
              ${esc(it.q)}
              <span class="faq-plus text-2xl leading-none text-muted transition-transform">+</span>
            </summary>
            <p class="mt-4 pr-10 text-muted leading-relaxed">${esc(it.a)}</p>
          </details>`).join('')}
      </div>
    </div>`;
}

function renderContact(c) {
  const s = c.contact;
  const field = (f) => {
    const base = 'mt-2 w-full rounded-md bg-white border border-line px-4 py-3 text-ink placeholder:text-muted/50 focus:outline-none focus:border-accentdeep focus:ring-1 focus:ring-accentdeep';
    const input = f.type === 'textarea'
      ? `<textarea name="${esc(f.name)}" rows="4" maxlength="5000" placeholder="${esc(f.placeholder)}" class="${base}" ${f.required ? 'required' : ''}></textarea>`
      : `<input name="${esc(f.name)}" type="${esc(f.type)}" maxlength="${f.type === 'email' ? 254 : 200}" placeholder="${esc(f.placeholder)}" class="${base}" ${f.required ? 'required' : ''} />`;
    return `<label class="block ${f.type === 'textarea' ? 'sm:col-span-2' : ''}">
      <span class="text-sm text-ink">${esc(f.label)}${f.required ? ' <span class="text-accentdeep">*</span>' : ''}</span>
      ${input}
      <span class="field-error hidden mt-1 text-xs text-red-600"></span>
    </label>`;
  };
  $('contact').innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-24">
      <div class="relative overflow-hidden rounded-3xl sky-panel-strong p-6 sm:p-12 grid lg:grid-cols-[1fr_1.3fr] gap-12">
        <div class="halftone w-[140%] h-56 -left-1/4 bottom-0 -rotate-12 opacity-50"></div>
        <div class="relative reveal">
          ${eyebrow(s.eyebrow)}
          <h2 class="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">${esc(s.title)}</h2>
          <p class="mt-5 text-muted leading-relaxed">${esc(s.subtitle)}</p>
          ${contactLinks(s, 'mt-8')}
        </div>
        <form id="contact-form" novalidate class="relative grid sm:grid-cols-2 gap-5 reveal">
          ${s.fields.map(field).join('')}
          <!-- Honeypot: hidden from people; Web3Forms rejects submissions where it is checked -->
          <input type="checkbox" name="botcheck" class="hidden" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <div class="sm:col-span-2">
            <button type="submit" class="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-md px-6 py-3 text-sm font-semibold btn-sky disabled:opacity-60 disabled:cursor-wait"><span class="btn-label">${esc(s.submit)}</span>${ARROW}</button>
            <p id="form-success" class="hidden mt-4 text-sm text-green-700" role="status">${esc(s.success)}</p>
            <p id="form-error" class="hidden mt-4 text-sm text-red-600" role="alert">${esc(s.error)}</p>
          </div>
        </form>
      </div>
    </div>`;

  const form = $('contact-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    $('form-success').classList.add('hidden');
    $('form-error').classList.add('hidden');
    let ok = true;
    form.querySelectorAll('input:not([name="botcheck"]), textarea').forEach(el => {
      const err = el.parentElement.querySelector('.field-error');
      let msg = '';
      if (el.required && !el.value.trim()) msg = 'This field is required.';
      else if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = 'Please enter a valid email.';
      err.textContent = msg;
      err.classList.toggle('hidden', !msg);
      el.classList.toggle('border-red-500', !!msg);
      if (msg) ok = false;
    });
    if (!ok) return;

    // Bots that tick the honeypot get a silent fake success.
    if (form.botcheck.checked) { form.reset(); $('form-success').classList.remove('hidden'); return; }

    const w3f = s.web3forms || {};
    if (!w3f.accessKey) {
      console.warn('Web3Forms access key missing: set contact.web3forms.accessKey in config.json');
      $('form-error').classList.remove('hidden');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const label = button.querySelector('.btn-label');
    button.disabled = true;
    label.textContent = s.sending || s.submit;
    try {
      const data = Object.fromEntries(new FormData(form));
      // Web3Forms (https://docs.web3forms.com): JSON POST to /submit with the public access key.
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: w3f.accessKey,
          subject: w3f.subject,
          from_name: w3f.fromName,
          replyto: data.email,
          ...data,
          botcheck: false,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
      form.reset();
      $('form-success').classList.remove('hidden');
    } catch (err) {
      console.error('Contact form submission failed:', err);
      $('form-error').classList.remove('hidden');
    } finally {
      button.disabled = false;
      label.textContent = s.submit;
    }
  });
}

// Email + WhatsApp links from config.contact; each is omitted while its value is empty.
const WA_TEXT = 'Hello%2C%20I%27m%20interested%20in%20your%20AI%20services.';
function contactLinks(ct, wrapClass) {
  const email = String(ct.email || '').trim();
  const wa = String(ct.whatsapp || '').replace(/\D/g, '');
  if (!email && !wa) return '';
  return `<div class="${wrapClass} flex flex-wrap items-center gap-x-6 gap-y-4">
    ${email ? `<a href="mailto:${esc(email)}" class="text-accentdeep font-medium hover:underline">${esc(email)}</a>` : ''}
    ${wa ? `<a href="https://wa.me/${wa}?text=${WA_TEXT}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2.5 rounded-md px-5 py-3 text-sm font-semibold transition bg-dark text-white hover:bg-black">
      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 7.95 19.35z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2z"/></svg>
      WhatsApp Business</a>` : ''}
  </div>`;
}

function renderFooter(c) {
  $('footer').innerHTML = `
    <div class="border-t border-line sky-panel">
      <div class="max-w-6xl mx-auto px-4 py-16">
        ${brand(c, 'w-24')}
        <p class="mt-6 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">${esc(c.site.tagline)}</p>
        <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-10">
          ${c.footer.columns.map(col => `
            <div>
              <h4 class="text-lg font-medium">${esc(col.title)}</h4>
              <ul class="mt-4 space-y-3">
                ${col.links.map(l => `<li><a href="${esc(safeHref(l.href))}" class="text-sm text-muted hover:text-accentdeep transition">${esc(l.label)}</a></li>`).join('')}
              </ul>
            </div>`).join('')}
        </div>
        <p class="mt-14 pt-6 border-t border-line text-xs text-muted">${esc(c.site.copyright)}</p>
      </div>
    </div>`;
}

function observeReveals() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
  const io = new IntersectionObserver((entries) => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}

/* ---------- Sub-pages ---------- */

// Escapes config text, then turns {email} into a mailto link and {cookiePolicy} into an internal link.
const fillText = (t, c) => {
  const email = String(c.contact.email || '').trim();
  return esc(t)
    .replace(/\{email\}/g, email
      ? `<a href="mailto:${esc(email)}" class="text-accentdeep font-medium hover:underline">${esc(email)}</a>`
      : '[contact email]')
    .replace(/\{cookiePolicy\}/g, '<a href="/cookie-policy" class="text-accentdeep font-medium hover:underline">Cookie Policy</a>');
};

const pageHead = (p, c) => `
  <div class="text-center mx-auto max-w-3xl reveal">
    ${p.code ? `<div class="font-display text-7xl sm:text-8xl font-semibold text-accentdeep [text-shadow:0_0_24px_rgba(56,189,248,.35)]">${esc(p.code)}</div>` : ''}
    <div class="${p.code ? 'mt-6' : ''}">${eyebrow(p.eyebrow)}</div>
    <h1 class="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">${esc(p.heading)}</h1>
    ${p.updated ? `<p class="mt-4 text-sm text-muted">${esc(p.updated)}</p>` : ''}
    ${p.subtitle ? `<p class="mt-5 mx-auto max-w-xl text-muted text-base sm:text-lg leading-relaxed">${fillText(p.subtitle, c)}</p>` : ''}
  </div>`;

const PAGE_VIEWS = {
  legal: (p, c) => `
    <div class="max-w-6xl mx-auto px-4 pt-16 pb-24">
      ${pageHead(p, c)}
      ${dotLine('mt-14')}
      <article class="mt-10 mx-auto max-w-3xl rounded-2xl sky-panel p-6 sm:p-10 reveal">
        <p class="text-ink leading-relaxed">${fillText(p.intro, c)}</p>
        ${p.sections.map(sec => `
          <section class="mt-10">
            <h2 class="font-display text-xl sm:text-2xl font-semibold tracking-[-0.01em]">${esc(sec.heading)}</h2>
            ${(sec.paragraphs || []).map(t => `<p class="mt-3 text-muted leading-relaxed">${fillText(t, c)}</p>`).join('')}
            ${sec.list ? `<ul class="mt-3 space-y-2">${sec.list.map(t => `
              <li class="flex gap-3 text-muted leading-relaxed"><span class="mt-2.5 w-1.5 h-1.5 shrink-0 rounded-full bg-accent"></span><span>${fillText(t, c)}</span></li>`).join('')}</ul>` : ''}
            ${sec.after ? `<p class="mt-3 text-muted leading-relaxed">${fillText(sec.after, c)}</p>` : ''}
          </section>`).join('')}
      </article>
    </div>`,

  message: (p, c) => `
    <div class="max-w-6xl mx-auto px-4 pt-20 pb-28 sm:pt-28 sm:pb-36">
      ${pageHead(p, c)}
      <p class="mt-6 mx-auto max-w-xl text-center text-muted text-base sm:text-lg leading-relaxed reveal">${fillText(p.text, c)}</p>
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
        ${p.ctas.map(cta => btn(cta, cta.variant || 'primary', 'w-full sm:w-auto')).join('')}
      </div>
    </div>`,

  integrations: (p, c) => `
    <div class="max-w-6xl mx-auto px-4 pt-16 pb-24">
      ${pageHead(p, c)}
      ${dotLine('mt-14')}
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${p.items.map(it => `
          <article class="group reveal rounded-2xl border border-line bg-white p-6 sm:p-7 transition hover:shadow-[0_12px_40px_rgba(12,34,51,.07)]">
            ${icon(it.icon, 'w-14 h-14')}
            <h2 class="mt-5 font-display text-xl font-semibold">${esc(it.title)}</h2>
            ${it.tools ? `<p class="mt-1 text-sm font-medium text-accentdeep">${esc(it.tools)}</p>` : ''}
            <p class="mt-3 text-sm text-muted leading-relaxed">${esc(it.description)}</p>
          </article>`).join('')}
      </div>
      ${p.note ? `<p class="mt-10 mx-auto max-w-2xl text-center text-sm text-muted leading-relaxed reveal">${fillText(p.note, c)}</p>` : ''}
      <div class="mt-12 text-center reveal">${btn(p.cta)}</div>
    </div>`
};

/* ---------- Router (History API; serve.py falls back to index.html for unknown paths) ---------- */

const normPath = (p) => (p.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/');

function setMeta(title, description) {
  document.title = title;
  document.querySelector('meta[name="description"]').setAttribute('content', description || '');
}

function scrollToTarget(hash, smooth) {
  let id = hash ? hash.slice(1) : '';
  try { id = decodeURIComponent(id); } catch { /* keep the raw hash */ }
  const el = id && document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'instant' });
}

function route(c) {
  const path = normPath(location.pathname);
  const isHome = path === '/';
  $('home').classList.toggle('hidden', !isHome);
  $('page').classList.toggle('hidden', isHome);
  if (isHome) return setMeta(c.site.title, c.site.description);

  const p = c.pages[path] || c.pages['/404'];
  $('page').innerHTML = PAGE_VIEWS[p.type](p, c);
  setMeta(p.title, p.description);
  observeReveals();
}

function startRouter(c) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    const url = new URL(a.href);
    // Leave external links, mailto:, and real files (images, json, …) to the browser.
    if (url.origin !== location.origin || /\.[a-z0-9]+$/i.test(url.pathname) && !/\/index\.html$/.test(url.pathname)) return;
    e.preventDefault();
    const samePage = normPath(url.pathname) === normPath(location.pathname);
    if (url.pathname + url.hash !== location.pathname + location.hash) history.pushState(null, '', url.pathname + url.hash);
    if (!samePage) route(c);
    // New page opens at the top (or at its #section); same-page anchors scroll smoothly.
    scrollToTarget(url.hash, samePage);
  });
  window.addEventListener('popstate', () => { route(c); scrollToTarget(location.hash, false); });
  route(c);
  if (location.hash) scrollToTarget(location.hash, false);
}

fetch('config.json', { cache: 'no-store' })
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(c => {
    document.title = c.site.title;
    [renderNav, renderHero, renderLogos, renderStats, renderProblems, renderServices,
     renderIndustries, renderProcess, renderCase, renderPricing, renderFaq, renderContact, renderFooter]
      .forEach(fn => fn(c));
    observeReveals();
    startRouter(c);
  })
  .catch(err => {
    console.error('Failed to load config.json', err);
    $('load-error').classList.remove('hidden');
  });

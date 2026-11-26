/* Der Adventskalender: Türchen, Datum, Speicher, Briefansicht und Effekte */
(function () {
  const { h, shake, pick, answerBox, matches, FALSCH } = window.SpielHelfer;

  /* ---------- Rätsel entschlüsseln ---------- */
  const RAETSEL = JSON.parse(
    new TextDecoder().decode(Uint8Array.from(atob(window.RAETSEL_CODE.split('').reverse().join('')), (c) => c.charCodeAt(0)))
  );

  /* ---------- Einstellungen ---------- */
  const JAHR = 2026;
  const params = new URLSearchParams(location.search);
  const VORSCHAU = params.has('vorschau');
  const SPEICHER = VORSCHAU ? 'kai-advent-2026-vorschau' : 'kai-advent-2026';

  // Im Vorschau-Modus kann man mit ?vorschau&heute=5 so tun, als wäre der 5. Dezember
  function heute() {
    const p = params.get('heute');
    if (VORSCHAU && p) {
      if (/^\d{1,2}$/.test(p)) return new Date(JAHR, 11, +p, 9);
      const d = new Date(p + 'T09:00:00');
      if (!isNaN(d)) return d;
    }
    return new Date();
  }
  const HEUTE = heute();
  const tagDatum = (tag) => new Date(JAHR, 11, tag);
  const istOffen = (tag) => VORSCHAU || HEUTE >= tagDatum(tag);
  const istHeute = (tag) => HEUTE.getFullYear() === JAHR && HEUTE.getMonth() === 11 && HEUTE.getDate() === tag;
  const tageBis = (tag) => Math.ceil((tagDatum(tag) - new Date(HEUTE.getFullYear(), HEUTE.getMonth(), HEUTE.getDate())) / 86400000);

  /* ---------- Speicher ---------- */
  function laden() {
    try { return JSON.parse(localStorage.getItem(SPEICHER)) || { geloest: {} }; } catch (e) { return { geloest: {} }; }
  }
  let stand = laden();
  function speichern() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(stand)); } catch (e) { /* privat-Modus */ }
  }

  /* ---------- Türchen ---------- */
  // gemischte Reihenfolge, feste Größen
  const REIHENFOLGE = [17, 3, 24, 9, 1, 14, 6, 21, 11, 8, 2, 19, 13, 5, 22, 16, 10, 23, 4, 15, 7, 20, 12, 18];
  const GROESSE = { 24: 'big', 8: 'big', 1: 'wide', 12: 'wide', 20: 'wide', 6: 'tall', 15: 'tall', 17: 'tall' };
  const FARBEN = ['v-red', 'v-green', 'v-cream', 'v-pine', 'v-red', 'v-cream', 'v-green', 'v-pine'];
  const MUSTER = ['p-dots', 'p-none', 'p-stripes', 'p-check', 'p-none', 'p-dots'];

  const NOCH_NICHT = [
    (n) => `Noch nicht, Zucker 🍬 Noch ${n} ${n === 1 ? 'Tag' : 'Tage'}.`,
    () => 'Na na na, nicht schummeln, Kuschelkai 😏',
    () => 'Geduld, Herz. Dieses Türchen schläft noch 😴',
    (n, t) => `Netter Versuch! Das ist erst am ${t}. Dezember dran.`,
    () => 'Finger weg, du Naschkatze 🙈',
    (n) => `Psst, noch ${n} Mal schlafen 🌙`,
    () => 'Ich seh genau, was du da machst 👀💕',
  ];

  const grid = document.getElementById('tuerchen');
  const doors = {};

  function baueTuerchen() {
    grid.innerHTML = '';
    REIHENFOLGE.forEach((tag, i) => {
      const deko = Bilder.motive.filter((_, i) => i !== 5); // ohne Herz, das gibt es erst nach dem Lösen
      const motiv = deko[(tag * 5) % deko.length];
      const d = h('button', {
        class: `door ${FARBEN[i % FARBEN.length]} ${MUSTER[(tag * 7) % MUSTER.length]} ${GROESSE[tag] || ''}`,
        type: 'button',
        'aria-label': `Türchen ${tag}`,
        'data-tag': tag,
        style: `--wobble:${((tag * 37) % 7) - 3}`,
        onclick: () => klick(tag),
      },
        h('span', { class: 'door-inside' }, h('span', { class: 'inside-gift', html: Bilder.geschenk })),
        h('span', { class: 'door-leaf' },
          h('span', { class: 'leaf-front' },
            h('span', { class: 'leaf-frame' }),
            h('span', { class: 'motif', html: motiv }),
            h('span', { class: 'num' }, tag),
            h('span', { class: 'seal', 'aria-hidden': 'true', html: Bilder.motive[5] }),
            h('span', { class: 'today-tag' }, 'heute')),
          h('span', { class: 'leaf-back' })));
      doors[tag] = d;
      grid.append(d);
    });
    aktualisiereTuerchen();
  }

  function aktualisiereTuerchen() {
    for (let tag = 1; tag <= 24; tag++) {
      const d = doors[tag];
      d.classList.toggle('solved', !!stand.geloest[tag]);
      d.classList.toggle('today', istHeute(tag));
      d.classList.toggle('locked', !istOffen(tag));
      d.setAttribute('aria-label', `Türchen ${tag}` + (stand.geloest[tag] ? ', schon gelöst' : !istOffen(tag) ? ', noch zu' : ''));
    }
    const zahl = Object.keys(stand.geloest).length;
    document.getElementById('fortschritt').textContent = zahl ? `${zahl} von 24 Türchen gelöst 💚` : '';
  }

  function klick(tag) {
    const d = doors[tag];
    if (!istOffen(tag)) {
      shake(d);
      const n = tageBis(tag);
      toast(pick(NOCH_NICHT)(n, tag));
      return;
    }
    d.classList.add('is-open');
    setTimeout(() => oeffneTag(tag), 650);
  }

  /* ---------- Statuszeile oben ---------- */
  function status() {
    const el = document.getElementById('status');
    const start = tagDatum(1);
    if (VORSCHAU) {
      el.textContent = 'Vorschau: Alle Türchen sind offen.';
      return;
    }
    if (HEUTE < start) {
      const n = tageBis(1);
      el.textContent = n === 1 ? 'Morgen geht es los! ✨' : `Noch ${n} Tage, dann öffnet sich das erste Türchen ✨`;
    } else if (HEUTE.getFullYear() === JAHR && HEUTE.getMonth() === 11 && HEUTE.getDate() <= 24) {
      const t = HEUTE.getDate();
      el.textContent = t === 24 ? 'Heute ist Heiligabend 🎄' : stand.geloest[t] ? `Türchen ${t} ist geschafft. Bis morgen, Herz 💚` : `Heute wartet Türchen ${t} auf dich`;
    } else {
      el.textContent = 'Frohe Weihnachten, mein Herz 🎄';
    }
  }

  /* ---------- Briefansicht ---------- */
  const modal = document.getElementById('modal');
  const sheet = document.getElementById('sheet');
  let aktiverTag = null;
  let timer = null;

  const WOCHENTAG = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  const TITEL = {
    emoji: 'Emojirätsel', hangman: 'Galgenmännchen', scramble: 'Buchstabensalat', wordle: 'Wortraten',
    slide: 'Schiebepuzzle', quiz: 'Quiz', memory: 'Memory', lock: 'Herzschloss', wordsearch: 'Wörter suchen',
    crossword: 'Kreuzworträtsel', whoami: 'Wer bin ich?', order: 'Backstube', cipher: 'Geheimschrift', multi: 'Schatzsuche',
  };

  function brief(tag) {
    const text = (window.BRIEFE[tag] || '').trim();
    const teile = text.split(/\n\s*\n/);
    const lang = tag === 8 || tag === 24;
    return h('article', { class: 'letter' + (lang ? ' long' : '') },
      h('span', { class: 'wax', 'aria-hidden': 'true' }, 'K'),
      ...teile.map((p, i) => h('p', { class: i === 0 ? 'greet' : '' }, p)),
      h('p', { class: 'sign' }, window.UNTERSCHRIFT || 'In Liebe', h('span', { class: 'sign-heart', html: Bilder.motive[5] })));
  }

  function oeffneTag(tag, nochmal) {
    clearTimeout(timer);
    aktiverTag = tag;
    const r = RAETSEL[tag];
    sheet.innerHTML = '';
    sheet.scrollTop = 0;
    const kopf = h('header', { class: 'sheet-head' },
      h('div', {},
        h('small', {}, WOCHENTAG.format(tagDatum(tag))),
        h('h2', {}, `Türchen ${tag}`)),
      h('button', { class: 'close', type: 'button', 'aria-label': 'Schließen', onclick: schliessen }, '×'));
    sheet.append(kopf, brief(tag));

    const geloest = !!stand.geloest[tag];
    if (geloest && !nochmal) {
      sheet.append(aufloesungKarte(tag, stand.geloest[tag] === 'aufgeloest'));
      sheet.append(h('button', { class: 'btn btn-ghost again', type: 'button', onclick: () => oeffneTag(tag, true) }, 'Rätsel nochmal spielen'));
    } else {
      sheet.append(spielKarte(tag, r));
    }

    if (!modal.classList.contains('show')) {
      modal.classList.add('show');
      document.body.classList.add('noscroll');
      history.pushState({ tag }, '');
    }
  }

  function spielKarte(tag, r) {
    let fehler = 0;
    let phase = 'spiel';
    let fertig = false;
    let tippNr = 0;
    const grenze = r.aufloesenNach || 3;

    const karte = h('section', { class: 'game-card' });
    karte.append(h('div', { class: 'game-head' },
      h('span', { class: 'game-label' }, TITEL[r.type] || 'Rätsel'),
      h('p', {}, r.intro || '')));
    const feld = h('div', { class: 'game-field' });
    const feedback = h('p', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
    const tippListe = h('ul', { class: 'tipps' });
    const tippBtn = h('button', { class: 'btn btn-gold btn-small', type: 'button', onclick: tipp }, '💡 Tipp');
    const loesBtn = h('button', { class: 'btn btn-ghost btn-small hidden', type: 'button', onclick: aufloesen }, 'Auflösen');
    const werkzeug = h('div', { class: 'tools' }, tippBtn, loesBtn);
    karte.append(feld, feedback, tippListe, werkzeug);

    const tipps = () => (phase === 'spiel' ? r.hints : (r.final && r.final.hints)) || [];
    function tippAnzeigen() {
      const t = tipps();
      tippBtn.disabled = tippNr >= t.length;
      tippBtn.textContent = !t.length || tippNr >= t.length ? 'Keine Tipps mehr' : tippNr ? '💡 Noch ein Tipp' : '💡 Tipp';
      tippBtn.classList.toggle('hidden', !t.length);
    }
    function tipp() {
      const t = tipps();
      if (tippNr >= t.length) return;
      tippListe.append(h('li', { class: 'pop-in' }, t[tippNr]));
      tippNr++;
      tippAnzeigen();
    }

    const api = {
      fail(n = 1) {
        fehler += n;
        if (fehler >= grenze) zeigeAufloesen();
      },
      say(text, art) {
        feedback.textContent = text || '';
        feedback.className = 'feedback ' + (art || '');
      },
      solved() {
        if (fertig || phase !== 'spiel') return;
        if (r.final) frage();
        else abschluss(false);
      },
    };
    function zeigeAufloesen() { loesBtn.classList.remove('hidden'); }
    timer = setTimeout(zeigeAufloesen, 180000);

    let spiel;
    try {
      spiel = window.Spiele[r.type](feld, r.cfg, api);
    } catch (e) {
      console.error(e);
      feld.append(h('p', {}, 'Ups, hier ist etwas schiefgelaufen. Du darfst trotzdem auflösen 💚'));
      zeigeAufloesen();
    }
    tippAnzeigen();

    function frage() {
      phase = 'frage';
      fehler = 0;
      tippNr = 0;
      tippListe.innerHTML = '';
      tippAnzeigen();
      glitzer(feld, 30);
      const box = answerBox({
        onSubmit: (v) => {
          if (matches(v, r.final.answers)) { box.el.remove(); abschluss(false); return true; }
          api.fail();
          api.say(pick(FALSCH), 'bad');
          return false;
        },
      });
      const f = h('div', { class: 'final pop-in' }, h('p', { class: 'final-q' }, r.final.q), box.el);
      feld.after(f);
      api.say('Geschafft! Jetzt noch eine letzte Frage …', 'good');
      setTimeout(() => f.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }

    function aufloesen() {
      if (fertig) return;
      if (spiel && spiel.solveNow) spiel.solveNow();
      karte.querySelectorAll('.final form').forEach((f) => f.remove());
      abschluss(true);
    }

    function abschluss(aufgeloest) {
      if (fertig) return;
      fertig = true;
      clearTimeout(timer);
      werkzeug.remove();
      api.say(aufgeloest ? 'Kein Problem, Herz. Hier ist die Lösung 💚' : 'Du hast es geschafft! ✨', 'good');
      if (!stand.geloest[tag] || stand.geloest[tag] === 'aufgeloest') stand.geloest[tag] = aufgeloest ? 'aufgeloest' : true;
      speichern();
      aktualisiereTuerchen();
      status();
      const k = aufloesungKarte(tag, aufgeloest);
      karte.after(k);
      glitzer(karte, 70);
      if (tag === 24) setTimeout(konfetti, 300);
      setTimeout(() => k.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450);
    }
    return karte;
  }

  function aufloesungKarte(tag, aufgeloest) {
    const r = RAETSEL[tag];
    return h('section', { class: 'reveal pop-in' + (tag === 24 ? ' finale' : '') },
      h('span', { class: 'reveal-label' }, aufgeloest ? 'Die Lösung' : 'Gelöst ✨'),
      h('h3', {}, r.solution),
      h('p', {}, r.reveal),
      h('div', { class: 'tag-card' },
        h('span', { class: 'tag-hole' }),
        h('span', { class: 'tag-gift', html: Bilder.geschenk }),
        h('span', {}, 'Jetzt darfst du ', h('b', {}, `Päckchen Nr. ${tag}`), ' auspacken!')));
  }

  function schliessen(vonHistory) {
    if (!modal.classList.contains('show')) return;
    clearTimeout(timer);
    modal.classList.remove('show');
    document.body.classList.remove('noscroll');
    if (aktiverTag && doors[aktiverTag]) {
      const d = doors[aktiverTag];
      setTimeout(() => d.classList.remove('is-open'), 150);
    }
    aktiverTag = null;
    setTimeout(() => { if (!modal.classList.contains('show')) sheet.innerHTML = ''; }, 400);
    if (vonHistory !== true && history.state && history.state.tag) history.back();
  }
  window.addEventListener('popstate', () => schliessen(true));
  modal.addEventListener('click', (e) => { if (e.target === modal) schliessen(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') schliessen(); });

  /* ---------- Hinweis unten ---------- */
  let toastTimer;
  function toast(text) {
    const t = document.getElementById('toast');
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- Schnee ---------- */
  function schnee() {
    const c = document.getElementById('schnee');
    const ctx = c.getContext('2d');
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, flocken = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function groesse() {
      W = c.width = innerWidth * dpr;
      H = c.height = innerHeight * dpr;
      c.style.width = innerWidth + 'px';
      c.style.height = innerHeight + 'px';
      const n = Math.round(Math.min(140, (innerWidth * innerHeight) / 9000)) * (ruhig ? 0.3 : 1);
      flocken = Array.from({ length: n }, () => neu(true));
    }
    function neu(irgendwo) {
      const r = (Math.random() ** 2 * 2.6 + 0.8) * dpr;
      return { x: Math.random() * W, y: irgendwo ? Math.random() * H : -10, r, v: (0.25 + r / dpr * 0.32) * dpr, p: Math.random() * 6.28, a: 0.45 + Math.random() * 0.5 };
    }
    function bild() {
      ctx.clearRect(0, 0, W, H);
      for (const f of flocken) {
        f.y += f.v;
        f.p += 0.012;
        f.x += Math.sin(f.p) * 0.35 * dpr;
        if (f.y > H + 10) Object.assign(f, neu(false));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${f.a})`;
        ctx.arc(f.x, f.y, f.r, 0, 6.283);
        ctx.fill();
      }
      requestAnimationFrame(bild);
    }
    addEventListener('resize', groesse);
    groesse();
    bild();
  }

  /* ---------- Lichterkette ---------- */
  function lichter() {
    const el = document.getElementById('lichter');
    const w = el.clientWidth || innerWidth;
    const n = Math.max(7, Math.round(w / 44));
    const step = w / n;
    let d = 'M0 4';
    const birnen = [];
    const farben = ['#f1d58f', '#e0473f', '#fbf4e6', '#7fc59a', '#f1d58f', '#e0473f'];
    for (let i = 0; i < n; i++) {
      const x = i * step + step / 2;
      d += ` Q${x} 26 ${(i + 1) * step} 4`;
      birnen.push(`<g class="bulb" style="--i:${i};--c:${farben[i % farben.length]}"><rect x="${x - 2.6}" y="13" width="5.2" height="5" rx="1" fill="#2a3b30"/><ellipse cx="${x}" cy="23.5" rx="4.6" ry="6.5" fill="var(--c)"/></g>`);
    }
    el.innerHTML = `<svg viewBox="0 0 ${w} 34" width="100%" height="34" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="#2a3b30" stroke-width="1.6"/>${birnen.join('')}</svg>`;
  }

  /* ---------- Glitzer & Konfetti ---------- */
  const fx = document.getElementById('fx');
  const fctx = fx.getContext('2d');
  let teilchen = [];
  let laeuft = false;
  function fxGroesse() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    fx.width = innerWidth * dpr;
    fx.height = innerHeight * dpr;
    fx.style.width = innerWidth + 'px';
    fx.style.height = innerHeight + 'px';
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', fxGroesse);
  fxGroesse();
  function stern(x, y, r, rot) {
    fctx.save();
    fctx.translate(x, y);
    fctx.rotate(rot);
    fctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rr = i % 2 ? r * 0.32 : r;
      const a = (i * Math.PI) / 4;
      fctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    fctx.closePath();
    fctx.fill();
    fctx.restore();
  }
  function fxLoop() {
    fctx.clearRect(0, 0, innerWidth, innerHeight);
    teilchen = teilchen.filter((p) => p.life > 0);
    for (const p of teilchen) {
      p.life--;
      p.vy += p.g;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      fctx.globalAlpha = Math.min(1, p.life / 30);
      fctx.fillStyle = p.c;
      if (p.kind === 'star') stern(p.x, p.y, p.r * (0.7 + 0.3 * Math.sin(p.life / 3)), p.rot);
      else {
        fctx.save();
        fctx.translate(p.x, p.y);
        fctx.rotate(p.rot);
        fctx.fillRect(-p.r, -p.r * 0.45, p.r * 2, p.r * 0.9 * Math.abs(Math.cos(p.life / 6)) + 1);
        fctx.restore();
      }
    }
    fctx.globalAlpha = 1;
    if (teilchen.length) requestAnimationFrame(fxLoop);
    else laeuft = false;
  }
  function starte() { if (!laeuft) { laeuft = true; requestAnimationFrame(fxLoop); } }
  function glitzer(el, n = 60) {
    const b = el.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = Math.min(Math.max(b.top + b.height / 2, 80), innerHeight - 80);
    const farben = ['#f1d58f', '#d8b25a', '#fff6d8', '#ffffff', '#f6c1c7'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 6;
      teilchen.push({ kind: 'star', x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, g: 0.08, r: 3 + Math.random() * 5, rot: Math.random() * 3, vr: (Math.random() - 0.5) * 0.3, life: 50 + Math.random() * 40, c: pick(farben) });
    }
    starte();
  }
  function konfetti() {
    const farben = ['#a3202f', '#e0473f', '#f1d58f', '#d8b25a', '#2f6b4b', '#7fc59a', '#fbf4e6'];
    let welle = 0;
    const iv = setInterval(() => {
      for (let i = 0; i < 70; i++) {
        teilchen.push({ kind: Math.random() < 0.2 ? 'star' : 'paper', x: Math.random() * innerWidth, y: -20 - Math.random() * 80, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3, g: 0.04, r: 4 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.25, life: 200 + Math.random() * 80, c: pick(farben) });
      }
      starte();
      if (++welle >= 6) clearInterval(iv);
    }, 350);
  }

  /* ---------- Vorschau-Leiste ---------- */
  function vorschauLeiste() {
    if (!VORSCHAU) return;
    const bar = h('div', { class: 'preview-bar' },
      h('span', {}, '👀 Vorschau'),
      h('button', { class: 'btn btn-small btn-ghost light', type: 'button', onclick: () => {
        if (!confirm('Alle Vorschau-Lösungen zurücksetzen?')) return;
        stand = { geloest: {} };
        speichern();
        aktualisiereTuerchen();
      } }, 'Zurücksetzen'),
      h('button', { class: 'btn btn-small btn-ghost light', type: 'button', onclick: () => { konfetti(); } }, 'Konfetti'));
    document.body.prepend(bar);
    document.body.classList.add('has-preview');
  }

  /* ---------- Start ---------- */
  vorschauLeiste();
  baueTuerchen();
  status();
  lichter();
  addEventListener('resize', lichter);
  schnee();

  // Falls die Seite über Nacht offen bleibt: um Mitternacht neu laden
  if (!VORSCHAU) {
    const morgen = new Date(HEUTE.getFullYear(), HEUTE.getMonth(), HEUTE.getDate() + 1, 0, 0, 5);
    setTimeout(() => location.reload(), Math.min(morgen - HEUTE, 2147483000));
  }
})();

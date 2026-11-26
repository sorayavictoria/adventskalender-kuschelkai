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
  const SPEICHER = VORSCHAU ? 'kai-advent-2026-vorschau-2' : 'kai-advent-2026';

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

  const NOCH_NICHT = [
    (n) => `Noch nicht, Zucker 🍬 Noch ${n} ${n === 1 ? 'Tag' : 'Tage'}.`,
    () => 'Na na na, nicht schummeln, Kuschelkai 😏',
    () => 'Geduld, Herz. Dieses Türchen schläft noch 😴',
    (n, t) => `Netter Versuch! Das ist erst am ${t}. Dezember dran.`,
    () => 'Finger weg, du Naschkatze 🙈',
    (n) => `Psst, noch ${n} Mal schlafen 🌙`,
    () => 'Ich seh genau, was du da machst 👀💕',
  ];

  /* ---------- Der Baum mit 24 Türchen ---------- */
  // Kugeln: [Tag, x, y] in Einheiten des Baumbilds (100 breit, 112 hoch)
  const REIHEN = [
    [31, [43.5, 56.5]],
    [46, [36, 50, 64]],
    [57.5, [30, 43.3, 56.7, 70]],
    [70, [24, 37, 50, 63, 76]],
    [81.5, [15, 29, 43, 57, 71, 85]],
  ];
  const KUGEL_TAGE = [3, 17, 11, 1, 21, 9, 14, 5, 19, 23, 2, 13, 7, 22, 10, 18, 4, 16, 12, 20];
  const KUGEL_FARBEN = ['k-beere', 'k-gold', 'k-lila', 'k-schnee', 'k-eis', 'k-tanne'];
  const KUGEL_MUSTER = ['', 'm-band', 'm-punkte', '', 'm-zickzack'];
  const pos = (x, y) => `left:${x}%;top:${(y / 112) * 100}%;`;

  const szene = document.getElementById('szene');
  const doors = {};

  function herz() { return h('span', { class: 'herz', 'aria-hidden': 'true', html: Bilder.motive[5] }); }
  function schild() { return h('span', { class: 'heute-schild' }, 'heute ✨'); }

  function baueBaum() {
    szene.innerHTML = Bilder.baum_gross();
    let i = 0;
    REIHEN.forEach(([y, xs]) => xs.forEach((x) => {
      const tag = KUGEL_TAGE[i];
      const farbe = KUGEL_FARBEN[(i * 5 + 2) % KUGEL_FARBEN.length];
      const muster = KUGEL_MUSTER[(tag * 3) % KUGEL_MUSTER.length];
      const b = h('button', {
        class: `platz kugel-btn ${farbe}-btn`, type: 'button', 'data-tag': tag,
        style: pos(x, y) + `--sw:${3.4 + ((tag * 7) % 10) / 6}s;--sd:-${(tag * 0.37) % 3}s`,
        onclick: () => klick(tag),
      },
        h('span', { class: 'kugel-schwung' },
          h('span', { class: 'faden' }),
          h('span', { class: 'kappe' }),
          h('span', { class: `kugel ${farbe} ${muster}` }, h('span', { class: 'num' }, tag)),
          herz()),
        schild());
      doors[tag] = b;
      szene.append(b);
      i++;
    }));

    // Stern = Türchen 24
    const stern = h('button', { class: 'platz stern-btn', type: 'button', 'data-tag': 24, style: pos(50, 9), onclick: () => klick(24) },
      h('span', {
        html: '<svg class="stern-svg" viewBox="0 0 100 100"><defs><radialGradient id="sg" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#fff8d8"/><stop offset=".55" stop-color="#f6dc96"/><stop offset="1" stop-color="#c99a3b"/></radialGradient></defs><path d="M50 4 L62 36 L96 38 L69 59 L79 93 L50 73 L21 93 L31 59 L4 38 L38 36 Z" fill="url(#sg)" stroke="#fff3c4" stroke-width="2" stroke-linejoin="round"/></svg>',
      }),
      h('span', { class: 'num' }, '24'), herz(), schild());
    doors[24] = stern;
    szene.append(stern);

    // Geschenke unter dem Baum
    const paket = (tag, x, y, w, klasse, ar) => {
      const b = h('button', { class: 'platz paket-btn', type: 'button', 'data-tag': tag, style: pos(x, y) + `--w:${w}%;--ar:${ar}`, onclick: () => klick(tag) },
        h('span', { class: `paket ${klasse}` },
          h('span', { class: 'paket-box' }),
          h('span', { class: 'paket-deckel' }, h('span', { class: 'schleife', html: '<svg viewBox="0 0 40 20"><path d="M20 18 C12 2 0 2 3 12 C5 18 20 18 20 18Z M20 18 C28 2 40 2 37 12 C35 18 20 18 20 18Z" fill="#f6dc96" stroke="#c99a3b" stroke-width="1.2"/></svg>' }))),
        h('span', { class: 'num' }, tag), herz(), schild());
      doors[tag] = b;
      szene.append(b);
    };
    paket(8, 73, 95.5, 21, 'p-lila', 1.1);
    paket(15, 33, 98.5, 12.5, 'p-beere', 1);
    const stiefel = h('button', { class: 'platz paket-btn stiefel-btn', type: 'button', 'data-tag': 6, style: pos(17, 96) + '--w:13%', onclick: () => klick(6) },
      h('span', { class: 'stiefel', html: Bilder.stiefel }), h('span', { class: 'num' }, 6), herz(), schild());
    doors[6] = stiefel;
    szene.append(stiefel);
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
    document.getElementById('fortschritt').textContent = zahl ? (zahl === 24 ? 'Alle 24 Türchen geschafft 💜' : `${zahl} von 24 Türchen geschafft 💜`) : '';
  }

  function klick(tag) {
    const d = doors[tag];
    if (!istOffen(tag)) {
      shake(d);
      toast(pick(NOCH_NICHT)(tageBis(tag), tag));
      return;
    }
    d.classList.add('is-open');
    glitzer(d, 26);
    setTimeout(() => oeffneTag(tag), 800);
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

  const DATUM_LANG = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  function brief(tag) {
    const text = (window.BRIEFE[tag] || '').trim();
    const teile = text.split(/\n\s*\n/);
    const lang = tag === 8 || tag === 24;
    return h('article', { class: 'letter' + (lang ? ' long' : '') },
      h('p', { class: 'datum' }, DATUM_LANG.format(tagDatum(tag))),
      ...teile.map((p, i) => h('p', { class: i === 0 ? 'greet' : '' }, p)),
      h('p', { class: 'sign' }, window.UNTERSCHRIFT || 'In Liebe', h('span', { class: 'sign-heart', html: Bilder.motive[5] })),
      h('span', { class: 'zweig', html: Bilder.zweig }));
  }

  function fotos(tag) {
    const liste = (window.FOTOS || {})[tag];
    if (!liste || !liste.length) return null;
    const winkel = [-3, 2.5, -1.5, 3];
    return h('div', { class: 'fotos' + (liste.length > 1 ? ' viele' : '') },
      ...liste.map((f, i) => {
        const img = h('img', { src: f.src, alt: f.text || 'Foto von uns', loading: 'lazy' });
        const fig = h('figure', { class: 'polaroid', style: `--r:${winkel[i % winkel.length]}deg` }, img, f.text ? h('figcaption', {}, f.text) : null);
        img.onerror = () => fig.remove();
        return fig;
      }));
  }

  function umschlag(tag, weiter) {
    const wrap = h('div', { class: 'umschlag-wrap' });
    const u = h('button', { class: 'umschlag', type: 'button', 'aria-label': 'Brief öffnen' },
      h('span', { class: 'u-hinten' }),
      h('span', { class: 'u-brief' }),
      h('span', { class: 'u-vorne' }),
      h('span', { class: 'u-adresse' }, 'für Kai'),
      h('span', { class: 'u-klappe' }),
      h('span', { class: 'u-siegel' }, 'K'));
    const hinweis = h('p', { class: 'umschlag-hinweis' }, 'Tippe auf das Siegel 💌');
    let auf = false;
    u.onclick = () => {
      if (auf) return;
      auf = true;
      u.classList.add('offen');
      hinweis.remove();
      setTimeout(() => { wrap.remove(); weiter(); }, 1500);
    };
    wrap.append(u, hinweis);
    return wrap;
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
    sheet.append(kopf);

    // In der Vorschau startet jedes Türchen immer mit dem Spiel
    const geloest = !VORSCHAU && !!stand.geloest[tag];
    const inhalt = () => {
      sheet.append(brief(tag));
      const f = fotos(tag);
      if (f) sheet.append(f);
      if (geloest && !nochmal) {
        sheet.append(aufloesungKarte(tag, stand.geloest[tag] === 'aufgeloest'));
        sheet.append(h('button', { class: 'btn btn-ghost light again', type: 'button', onclick: () => oeffneTag(tag, true) }, 'Rätsel nochmal spielen'));
      } else {
        sheet.append(spielKarte(tag, r));
      }
    };
    // Beim ersten Öffnen kommt der Brief im Umschlag
    if (!geloest && !nochmal) sheet.append(umschlag(tag, inhalt));
    else inhalt();

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
    const karte = h('section', { class: 'reveal pop-in' + (tag === 24 ? ' finale' : '') },
      h('span', { class: 'reveal-label' }, aufgeloest ? 'Die Lösung' : 'Gelöst ✨'),
      h('h3', {}, r.solution),
      h('p', {}, r.reveal));

    const anhaenger = h('div', { class: 'tag-card' },
      h('span', { class: 'tag-hole' }),
      h('span', { class: 'tag-gift', html: Bilder.geschenk }),
      h('span', {}, 'Jetzt darfst du ', h('b', {}, `Päckchen Nr. ${tag}`), ' auspacken!'));

    // Kai darf vorher raten, was drin ist
    const tipps = stand.tipps || (stand.tipps = {});
    if (r.keinTipp) {
      karte.append(anhaenger);
    } else if (tipps[tag]) {
      karte.append(h('p', { class: 'mein-tipp' }, `Dein Tipp: „${tipps[tag]}“`), anhaenger);
    } else {
      const box = answerBox({
        placeholder: 'Mein Tipp …',
        button: 'Merken',
        onSubmit: (v) => {
          tipps[tag] = v.trim().slice(0, 80);
          speichern();
          raten.replaceWith(h('p', { class: 'mein-tipp pop-in' }, `Dein Tipp: „${tipps[tag]}“`));
          karte.append(anhaenger);
          glitzer(anhaenger, 24);
          return true;
        },
      });
      const ueberspringen = h('button', { class: 'btn btn-ghost light btn-small', type: 'button', style: 'margin-top:10px', onclick: () => { raten.remove(); karte.append(anhaenger); } }, 'Ohne Tipp auspacken');
      const raten = h('div', { class: 'raten' },
        h('label', {}, 'Was glaubst du, steckt in deinem Päckchen? Schreib deinen Tipp auf, bevor du auspackst.'),
        box.el, ueberspringen);
      karte.append(raten);
    }
    return karte;
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

  /* ---------- Sterne am Himmel ---------- */
  function sterne() {
    const el = document.getElementById('himmel');
    const r = seeded(7);
    for (let i = 0; i < 70; i++) {
      el.append(h('i', { style: `left:${(r() * 100).toFixed(1)}%;top:${(r() * 100).toFixed(1)}%;--s:${(1 + r() * 2.2).toFixed(1)}px;--t:${(2 + r() * 4).toFixed(1)}s;--d:-${(r() * 5).toFixed(1)}s` }));
    }
  }
  function seeded(seed) { let x = seed; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }

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
  baueBaum();
  status();
  sterne();
  schnee();

  // Falls die Seite über Nacht offen bleibt: um Mitternacht neu laden
  if (!VORSCHAU) {
    const morgen = new Date(HEUTE.getFullYear(), HEUTE.getMonth(), HEUTE.getDate() + 1, 0, 0, 5);
    setTimeout(() => location.reload(), Math.min(morgen - HEUTE, 2147483000));
  }
})();

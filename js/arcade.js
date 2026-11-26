/* Geschicklichkeitsspiele mit Punkteziel.
   Alle melden sich wie die anderen Spiele über api.fail() und api.solved(). */
(function () {
  const S = window.Spiele;
  const { h, pick } = window.SpielHelfer;

  /* ---------- Gemeinsame Bühne: Anzeige, Spielfläche, Start und Nochmal ---------- */
  function buehne(root, hoehe, art) {
    const wrap = h('div', { class: 'ar-wrap' });
    const links = h('span', { class: 'ar-links' });
    const rechts = h('span', { class: 'ar-rechts' });
    const hud = h('div', { class: 'ar-hud' }, links, rechts);
    const flaeche = art === 'dom'
      ? h('div', { class: 'ar-feld', style: `height:${hoehe}px` })
      : h('canvas', { class: 'ar-canvas', style: `height:${hoehe}px` });
    const overlay = h('div', { class: 'ar-overlay' });
    const box = h('div', { class: 'ar-box' }, flaeche, overlay);
    wrap.append(hud, box);
    root.append(wrap);

    const st = { wrap, flaeche, w: 0, h: hoehe, ctx: null };
    st.messen = () => {
      st.w = flaeche.clientWidth || 320;
      if (art !== 'dom') {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        flaeche.width = st.w * dpr;
        flaeche.height = hoehe * dpr;
        st.ctx = flaeche.getContext('2d');
        st.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    st.hud = (l, r) => { links.textContent = l; rechts.textContent = r || ''; };
    st.zeige = (titel, text, knopf, los) => {
      overlay.innerHTML = '';
      overlay.append(
        h('div', { class: 'ar-karte pop-in' },
          titel ? h('b', {}, titel) : null,
          text ? h('p', {}, text) : null,
          knopf ? h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { overlay.classList.remove('an'); los(); } }, knopf) : null));
      overlay.classList.add('an');
    };
    st.weg = () => overlay.classList.remove('an');
    st.blitz = (gut) => {
      box.classList.remove('gut', 'schlecht');
      void box.offsetWidth;
      box.classList.add(gut ? 'gut' : 'schlecht');
    };
    st.lebt = () => document.body.contains(wrap);
    return st;
  }
  const herzen = (n, max) => '❤️'.repeat(Math.max(0, n)) + '🤍'.repeat(Math.max(0, max - n));
  const emoji = (ctx, e, x, y, size) => {
    ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(e, x, y);
  };

  /* ---------- Fangen: Dinge mit dem Korb auffangen ---------- */
  S.catch = function (root, cfg, api) {
    const ziel = cfg.ziel || 15;
    const LEBEN = 3;
    const st = buehne(root, 380);
    let korb, dinge, punkte, leben, laeuft = false, zuletzt, bisNeu, fertig = false;

    function neu() { korb = { x: st.w / 2 }; dinge = []; punkte = 0; leben = LEBEN; bisNeu = 0; }
    function zeichne() {
      const c = st.ctx;
      const g = c.createLinearGradient(0, 0, 0, st.h);
      g.addColorStop(0, '#2a1d52'); g.addColorStop(1, '#4a3478');
      c.fillStyle = g; c.fillRect(0, 0, st.w, st.h);
      c.fillStyle = 'rgba(255,255,255,0.9)';
      c.beginPath(); c.ellipse(st.w / 2, st.h + 30, st.w * 0.8, 50, 0, 0, Math.PI * 2); c.fill();
      dinge.forEach((d) => emoji(c, d.e, d.x, d.y, 30));
      emoji(c, cfg.korb || '🧺', korb.x, st.h - 34, 48);
    }
    function schritt(t) {
      if (!laeuft || !st.lebt()) return;
      const dt = Math.min(48, t - zuletzt) / 16.67;
      zuletzt = t;
      bisNeu -= dt;
      if (bisNeu <= 0) {
        bisNeu = Math.max(16, 40 - punkte * 1.2) * (0.7 + Math.random() * 0.6);
        const schlecht = Math.random() < (cfg.anteilSchlecht || 0.3);
        dinge.push({ x: 22 + Math.random() * (st.w - 44), y: -24, v: 2 + Math.random() * 1.3 + punkte * 0.07, e: schlecht ? pick(cfg.schlecht) : pick(cfg.gut), schlecht });
      }
      const ky = st.h - 40;
      dinge = dinge.filter((d) => {
        d.y += d.v * dt;
        if (d.y > ky - 20 && d.y < ky + 16 && Math.abs(d.x - korb.x) < 38) {
          if (d.schlecht) { leben--; st.blitz(false); } else { punkte++; st.blitz(true); }
          return false;
        }
        return d.y < st.h + 30;
      });
      zeichne();
      st.hud(`${punkte} / ${ziel}`, herzen(leben, LEBEN));
      if (punkte >= ziel) return ende(true);
      if (leben <= 0) return ende(false);
      requestAnimationFrame(schritt);
    }
    function start() { st.messen(); neu(); laeuft = true; zuletzt = performance.now(); requestAnimationFrame(schritt); }
    function ende(gewonnen) {
      laeuft = false;
      if (gewonnen) { fertig = true; st.zeige('Geschafft! 🎉', `${punkte} Stück gefangen.`); setTimeout(() => api.solved(), 900); }
      else { api.fail(); st.zeige('Oh nein!', `Du hattest ${punkte} von ${ziel}. Versuch es nochmal.`, 'Nochmal', start); }
    }
    const bewege = (e) => {
      if (!laeuft) return;
      const r = st.flaeche.getBoundingClientRect();
      korb.x = Math.max(24, Math.min(st.w - 24, e.clientX - r.left));
    };
    st.flaeche.addEventListener('pointerdown', bewege);
    st.flaeche.addEventListener('pointermove', bewege);
    const taste = (e) => {
      if (!st.lebt()) return document.removeEventListener('keydown', taste);
      if (!laeuft) return;
      if (e.key === 'ArrowLeft') korb.x = Math.max(24, korb.x - 26);
      if (e.key === 'ArrowRight') korb.x = Math.min(st.w - 24, korb.x + 26);
    };
    document.addEventListener('keydown', taste);
    st.messen(); neu(); zeichne(); st.hud(`0 / ${ziel}`, herzen(LEBEN, LEBEN));
    st.zeige(cfg.titel || 'Bereit?', cfg.anleitung, 'Los geht’s', start);
    return { solveNow() { laeuft = false; fertig = true; st.zeige('Aufgelöst 💜', ''); } };
  };

  /* ---------- Antippen: schnell tippen, bevor es verschwindet ---------- */
  S.tap = function (root, cfg, api) {
    const ziel = cfg.ziel || 20;
    const zeit = cfg.zeit || 30;
    const st = buehne(root, 360, 'dom');
    let punkte, rest, laeuft = false, uhr, spawner;

    function neuesDing() {
      if (!laeuft || !st.lebt()) return stop();
      const schlecht = Math.random() < (cfg.anteilSchlecht || 0.25);
      const b = h('button', { class: 'ar-ding', type: 'button', style: `left:${8 + Math.random() * 76}%;top:${8 + Math.random() * 76}%` }, schlecht ? pick(cfg.schlecht) : pick(cfg.gut));
      let weg = false;
      const entferne = () => { if (weg) return; weg = true; b.classList.add('aus'); setTimeout(() => b.remove(), 220); };
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (weg || !laeuft) return;
        if (schlecht) { punkte = Math.max(0, punkte - 2); st.blitz(false); b.classList.add('falsch'); }
        else { punkte++; st.blitz(true); b.classList.add('treffer'); }
        anzeigen();
        entferne();
        if (punkte >= ziel) ende(true);
      });
      st.flaeche.append(b);
      setTimeout(entferne, Math.max(650, 1300 - punkte * 25));
      spawner = setTimeout(neuesDing, Math.max(300, 640 - punkte * 12) * (0.7 + Math.random() * 0.6));
    }
    function anzeigen() { st.hud(`${punkte} / ${ziel}`, `⏱ ${rest} s`); }
    function start() {
      st.flaeche.innerHTML = '';
      punkte = 0; rest = zeit; laeuft = true; anzeigen();
      uhr = setInterval(() => {
        if (!st.lebt()) return stop();
        rest--; anzeigen();
        if (rest <= 0) ende(false);
      }, 1000);
      neuesDing();
    }
    function stop() { laeuft = false; clearInterval(uhr); clearTimeout(spawner); }
    function ende(gewonnen) {
      if (!laeuft) return;
      stop();
      st.flaeche.innerHTML = '';
      if (gewonnen) { st.zeige('Geschafft! 🎉', `${punkte} Treffer.`); setTimeout(() => api.solved(), 900); }
      else { api.fail(); st.zeige('Die Zeit ist um!', `Du hattest ${punkte} von ${ziel}. Nochmal?`, 'Nochmal', start); }
    }
    st.hud(`0 / ${ziel}`, `⏱ ${zeit} s`);
    st.zeige(cfg.titel || 'Bereit?', cfg.anleitung, 'Los geht’s', start);
    return { solveNow() { stop(); st.flaeche.innerHTML = ''; st.zeige('Aufgelöst 💜', ''); } };
  };

  /* ---------- Stapeln: Kekse genau übereinander fallen lassen ---------- */
  S.stack = function (root, cfg, api) {
    const ziel = cfg.ziel || 10;
    const H = 24;
    const st = buehne(root, 400);
    let stapel, akt, laeuft = false, zuletzt, kamera, punkte;

    function neu() {
      const w0 = Math.min(st.w * 0.55, 220);
      stapel = [{ x: (st.w - w0) / 2, w: w0, f: 0 }];
      punkte = 0; kamera = 0;
      naechster();
    }
    function naechster() {
      const oben = stapel[stapel.length - 1];
      const vonLinks = stapel.length % 2 === 0;
      // Start knapp im Bild, damit der Keks sofort sichtbar hin und her fährt
      akt = { x: vonLinks ? 0 : st.w - oben.w, w: oben.w, v: (vonLinks ? 1 : -1) * (2.1 + punkte * 0.18), f: stapel.length };
    }
    function keks(c, x, y, w, f) {
      const g = c.createLinearGradient(0, y, 0, y + H);
      g.addColorStop(0, '#e9b874'); g.addColorStop(1, '#b97a3c');
      c.fillStyle = g;
      c.beginPath();
      c.roundRect ? c.roundRect(x, y, w, H - 2, 9) : c.rect(x, y, w, H - 2);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.85)';
      c.fillRect(x + 6, y + 3, Math.max(0, w - 12), 4);
      const farben = ['#e0473f', '#7fc59a', '#f6dc96', '#b9a6e0'];
      for (let i = 0; i < Math.floor(w / 18); i++) {
        c.fillStyle = farben[(i + f) % farben.length];
        c.fillRect(x + 8 + ((i * 18 + f * 7) % Math.max(1, w - 16)), y + 11 + ((i + f) % 2) * 4, 5, 3);
      }
    }
    function zeichne() {
      const c = st.ctx;
      const g = c.createLinearGradient(0, 0, 0, st.h);
      g.addColorStop(0, '#2a1d52'); g.addColorStop(1, '#4a3478');
      c.fillStyle = g; c.fillRect(0, 0, st.w, st.h);
      const boden = st.h - 30 + kamera;
      c.fillStyle = '#f5f2fb';
      c.fillRect(st.w / 2 - 140, boden + 2, 280, 8);
      stapel.forEach((k, i) => keks(c, k.x, boden - (i + 1) * H, k.w, k.f));
      if (akt && laeuft) keks(c, akt.x, boden - (stapel.length + 1) * H - 30, akt.w, akt.f);
    }
    function schritt(t) {
      if (!laeuft || !st.lebt()) return;
      const dt = Math.min(48, t - zuletzt) / 16.67;
      zuletzt = t;
      akt.x += akt.v * dt;
      if (akt.x <= 0 && akt.v < 0) { akt.x = 0; akt.v *= -1; }
      if (akt.x + akt.w >= st.w && akt.v > 0) { akt.x = st.w - akt.w; akt.v *= -1; }
      const zielKamera = Math.max(0, (stapel.length + 3) * H - (st.h - 110));
      kamera += (zielKamera - kamera) * 0.12;
      zeichne();
      requestAnimationFrame(schritt);
    }
    function fallen() {
      if (!laeuft) return;
      const oben = stapel[stapel.length - 1];
      let links = Math.max(akt.x, oben.x);
      let rechts = Math.min(akt.x + akt.w, oben.x + oben.w);
      if (Math.abs(akt.x - oben.x) < 10) { links = oben.x; rechts = oben.x + oben.w; } // fast perfekt zählt als perfekt
      const breite = rechts - links;
      if (breite <= 8) return ende(false);
      stapel.push({ x: links, w: breite, f: akt.f });
      punkte++;
      st.blitz(true);
      st.hud(`${punkte} / ${ziel}`, '🍪');
      if (punkte >= ziel) return ende(true);
      naechster();
    }
    function start() { st.messen(); neu(); laeuft = true; zuletzt = performance.now(); st.hud(`0 / ${ziel}`, '🍪'); requestAnimationFrame(schritt); }
    function ende(gewonnen) {
      laeuft = false;
      zeichne();
      if (gewonnen) { st.zeige('Was für ein Turm! 🎉', `${punkte} Kekse gestapelt.`); setTimeout(() => api.solved(), 900); }
      else { st.blitz(false); api.fail(); st.zeige('Daneben!', `Der Keks ist runtergefallen. Du hattest ${punkte} von ${ziel}.`, 'Nochmal', start); }
    }
    st.flaeche.addEventListener('pointerdown', (e) => { e.preventDefault(); fallen(); });
    const taste = (e) => {
      if (!st.lebt()) return document.removeEventListener('keydown', taste);
      if (e.key === ' ' || e.key === 'Enter') { if (laeuft) { e.preventDefault(); fallen(); } }
    };
    document.addEventListener('keydown', taste);
    st.messen(); neu(); zeichne(); st.hud(`0 / ${ziel}`, '🍪');
    st.wrap.__zustand = () => ({ akt, oben: stapel[stapel.length - 1], laeuft, punkte }); // nur für Tests
    st.zeige(cfg.titel || 'Bereit?', cfg.anleitung, 'Los geht’s', start);
    return { solveNow() { laeuft = false; st.zeige('Aufgelöst 💜', ''); } };
  };

  /* ---------- Springen: Rentier über Hindernisse ---------- */
  S.runner = function (root, cfg, api) {
    const ziel = cfg.ziel || 12;
    const st = buehne(root, 280);
    const HINDERNISSE = [['⛄', 40], ['🎁', 32], ['🌲', 44]];
    let reh, hin, laeuft = false, zuletzt, punkte, tempo, abstand, boden, flocken;

    function neu() {
      boden = st.h - 46;
      reh = { y: boden, vy: 0 };
      hin = []; punkte = 0; tempo = 4.6; abstand = 60;
      flocken = Array.from({ length: 24 }, () => ({ x: Math.random() * st.w, y: Math.random() * st.h, r: 1 + Math.random() * 2 }));
    }
    function springen() {
      if (!laeuft) return;
      if (reh.y >= boden - 0.5) reh.vy = -12.2;
    }
    function zeichne() {
      const c = st.ctx;
      const g = c.createLinearGradient(0, 0, 0, st.h);
      g.addColorStop(0, '#1b1336'); g.addColorStop(1, '#4a3478');
      c.fillStyle = g; c.fillRect(0, 0, st.w, st.h);
      c.fillStyle = '#f6ecc9';
      c.beginPath(); c.arc(st.w - 46, 42, 16, 0, Math.PI * 2); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.8)';
      flocken.forEach((f) => { c.beginPath(); c.arc(f.x, f.y, f.r, 0, Math.PI * 2); c.fill(); });
      c.fillStyle = '#f5f2fb';
      c.fillRect(0, boden + 20, st.w, st.h - boden);
      hin.forEach((o) => emoji(c, o.e, o.x, boden + 20 - o.h / 2, o.h));
      c.save();
      c.translate(70, reh.y);
      c.scale(-1, 1); // Rentier schaut nach rechts
      emoji(c, '🦌', 0, 0, 46);
      c.restore();
    }
    function schritt(t) {
      if (!laeuft || !st.lebt()) return;
      const dt = Math.min(48, t - zuletzt) / 16.67;
      zuletzt = t;
      reh.vy += 0.62 * dt;
      reh.y = Math.min(boden, reh.y + reh.vy * dt);
      if (reh.y >= boden) reh.vy = 0;
      flocken.forEach((f) => { f.y += 0.6 * dt; f.x -= tempo * 0.15 * dt; if (f.y > st.h) f.y = -4; if (f.x < 0) f.x = st.w; });
      abstand -= tempo * dt;
      if (abstand <= 0) {
        const [e, hh] = pick(HINDERNISSE);
        hin.push({ x: st.w + 30, e, h: hh, gezaehlt: false });
        abstand = 170 + Math.random() * 170 + tempo * 8;
      }
      for (const o of hin) {
        o.x -= tempo * dt;
        // Zusammenstoß (etwas großzügig)
        if (Math.abs(o.x - 70) < (o.h * 0.38 + 12) && reh.y + 16 > boden + 20 - o.h * 0.8) return ende(false);
        if (!o.gezaehlt && o.x < 50) { o.gezaehlt = true; punkte++; st.hud(`${punkte} / ${ziel}`, '🦌'); tempo += 0.22; if (punkte >= ziel) return ende(true); }
      }
      hin = hin.filter((o) => o.x > -40);
      zeichne();
      requestAnimationFrame(schritt);
    }
    function start() { st.messen(); neu(); laeuft = true; zuletzt = performance.now(); st.hud(`0 / ${ziel}`, '🦌'); requestAnimationFrame(schritt); }
    function ende(gewonnen) {
      laeuft = false;
      zeichne();
      if (gewonnen) { st.zeige('Geschafft! 🎉', `${punkte} Hindernisse übersprungen.`); setTimeout(() => api.solved(), 900); }
      else { st.blitz(false); api.fail(); st.zeige('Autsch!', `Das Rentier ist gestolpert. Du hattest ${punkte} von ${ziel}.`, 'Nochmal', start); }
    }
    st.flaeche.addEventListener('pointerdown', (e) => { e.preventDefault(); springen(); });
    const taste = (e) => {
      if (!st.lebt()) return document.removeEventListener('keydown', taste);
      if ((e.key === ' ' || e.key === 'ArrowUp') && laeuft) { e.preventDefault(); springen(); }
    };
    document.addEventListener('keydown', taste);
    st.messen(); neu(); zeichne(); st.hud(`0 / ${ziel}`, '🦌');
    st.zeige(cfg.titel || 'Bereit?', cfg.anleitung, 'Los geht’s', start);
    return { solveNow() { laeuft = false; st.zeige('Aufgelöst 💜', ''); } };
  };

  /* ---------- Glockenspiel: Melodie merken und nachspielen ---------- */
  S.simon = function (root, cfg, api) {
    const ziel = cfg.ziel || 6;
    const PADS = [['🔔', '#c22f40', 523.25], ['⭐', '#d9ac4d', 659.25], ['🎄', '#2f7a58', 783.99], ['💜', '#8a6fd0', 1046.5]];
    const st = buehne(root, 330, 'dom');
    let folge = [], pos = 0, darf = false, audio = null;
    const pads = PADS.map(([e, farbe], i) => {
      const b = h('button', { class: 'ar-pad', type: 'button', style: `--farbe:${farbe}`, 'aria-label': `Glocke ${i + 1}` }, e);
      b.addEventListener('pointerdown', (ev) => { ev.preventDefault(); druck(i); });
      return b;
    });
    st.flaeche.classList.add('ar-pads');
    pads.forEach((p) => st.flaeche.append(p));

    function ton(i) {
      try {
        audio = audio || new (window.AudioContext || window.webkitAudioContext)();
        const o = audio.createOscillator(), g = audio.createGain();
        o.type = 'sine'; o.frequency.value = PADS[i][2];
        g.gain.setValueAtTime(0.0001, audio.currentTime);
        g.gain.exponentialRampToValueAtTime(0.25, audio.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.45);
        o.connect(g).connect(audio.destination);
        o.start(); o.stop(audio.currentTime + 0.5);
      } catch (e) { /* ohne Ton geht es auch */ }
    }
    function leuchte(i, ms) {
      pads[i].classList.add('an');
      ton(i);
      setTimeout(() => pads[i].classList.remove('an'), ms);
    }
    function vorspielen() {
      darf = false;
      st.hud(`Runde ${folge.length} / ${ziel}`, '👀 Hör zu …');
      const tempo = Math.max(330, 620 - folge.length * 35);
      folge.forEach((p, k) => setTimeout(() => { if (st.lebt()) leuchte(p, tempo * 0.6); }, 500 + k * tempo));
      setTimeout(() => { darf = true; pos = 0; st.hud(`Runde ${folge.length} / ${ziel}`, '👆 Du bist dran'); }, 500 + folge.length * tempo);
    }
    function druck(i) {
      if (!darf) return;
      leuchte(i, 220);
      if (i !== folge[pos]) {
        darf = false;
        st.blitz(false);
        api.fail();
        st.zeige('Falscher Ton!', `Du hast Runde ${folge.length - 1} von ${ziel} geschafft.`, 'Nochmal', start);
        return;
      }
      pos++;
      if (pos === folge.length) {
        darf = false;
        st.blitz(true);
        if (folge.length >= ziel) {
          st.zeige('Wunderschön gespielt! 🎶', `Alle ${ziel} Runden geschafft.`);
          setTimeout(() => api.solved(), 900);
          return;
        }
        folge.push(Math.floor(Math.random() * 4));
        setTimeout(vorspielen, 600);
      }
    }
    function start() { folge = [Math.floor(Math.random() * 4)]; vorspielen(); }
    st.hud(`Runde 0 / ${ziel}`, '🔔');
    st.zeige(cfg.titel || 'Bereit?', cfg.anleitung, 'Los geht’s', start);
    return { solveNow() { darf = false; st.zeige('Aufgelöst 💜', ''); } };
  };

  /* ---------- Heiz ein: im richtigen Moment tippen ---------- */
  S.timing = function (root, cfg, api) {
    const ziel = cfg.ziel || 6;
    const st = buehne(root, 360, 'dom');
    st.flaeche.classList.add('hz-feld');
    const rohr = h('div', { class: 'hz-rohr' });
    const fuellung = h('div', { class: 'hz-fuellung' });
    const kugel = h('div', { class: 'hz-kugel' });
    const zone = h('div', { class: 'hz-zone' });
    const nadel = h('div', { class: 'hz-nadel' }, h('span', {}, '◀'));
    const skala = h('div', { class: 'hz-skala' });
    for (let i = 0; i <= 10; i++) skala.append(h('i', { style: `bottom:${i * 10}%` }));
    rohr.append(fuellung, zone, skala);
    const spur = h('div', { class: 'hz-spur' }, nadel);
    const knopf = h('div', { class: 'hz-tipp' }, 'Tippen, wenn die Nadel im roten Bereich ist');
    st.flaeche.append(h('div', { class: 'hz-thermo' }, rohr, kugel), spur, knopf);

    let stufe = 0, pos = 0, richtung = 1, tempo, laeuft = false, zuletzt, zoneUnten, zoneHoehe, sperre = false;
    function neueZone() {
      zoneHoehe = Math.max(9, 24 - stufe * 2.6);
      zoneUnten = 12 + Math.random() * (78 - zoneHoehe);
      zone.style.bottom = zoneUnten + '%';
      zone.style.height = zoneHoehe + '%';
    }
    function anzeigen() {
      fuellung.style.height = Math.max(6, (stufe / ziel) * 100) + '%';
      st.hud(`${stufe} / ${ziel}`, stufe >= ziel - 1 ? '🔥🔥🔥' : stufe >= ziel / 2 ? '🔥🔥' : '🔥');
    }
    function schritt(t) {
      if (!laeuft || !st.lebt()) return;
      const dt = Math.min(48, t - zuletzt) / 16.67;
      zuletzt = t;
      pos += richtung * tempo * dt;
      if (pos >= 100) { pos = 100; richtung = -1; }
      if (pos <= 0) { pos = 0; richtung = 1; }
      nadel.style.bottom = pos + '%';
      requestAnimationFrame(schritt);
    }
    function tippen(e) {
      e.preventDefault();
      if (!laeuft || sperre) return;
      const drin = pos >= zoneUnten - 2 && pos <= zoneUnten + zoneHoehe + 2;
      sperre = true;
      setTimeout(() => (sperre = false), 250);
      if (drin) {
        stufe++;
        st.blitz(true);
        zone.classList.add('treffer');
        setTimeout(() => zone.classList.remove('treffer'), 300);
        if (stufe >= ziel) { anzeigen(); return ende(); }
        tempo += 0.18;
        neueZone();
      } else {
        st.blitz(false);
        stufe = Math.max(0, stufe - 1);
        api.fail();
      }
      anzeigen();
    }
    function start() {
      stufe = 0; pos = 0; richtung = 1; tempo = 1.25; laeuft = true;
      neueZone(); anzeigen();
      zuletzt = performance.now();
      requestAnimationFrame(schritt);
    }
    function ende() {
      laeuft = false;
      st.flaeche.classList.add('heiss');
      st.zeige('Heiß, heißer, Kai! 🔥', 'Das Thermometer kocht über.');
      setTimeout(() => api.solved(), 1000);
    }
    st.flaeche.addEventListener('pointerdown', tippen);
    const taste = (e) => {
      if (!st.lebt()) return document.removeEventListener('keydown', taste);
      if (e.key === ' ' || e.key === 'Enter') tippen(e);
    };
    document.addEventListener('keydown', taste);
    st.wrap.__zustand = () => ({ pos, zoneUnten, zoneHoehe, laeuft, stufe }); // nur für Tests
    neueZone(); anzeigen();
    st.zeige(cfg.titel || 'Bereit?', cfg.anleitung, 'Los geht’s', start);
    return { solveNow() { laeuft = false; stufe = ziel; anzeigen(); st.flaeche.classList.add('heiss'); st.zeige('Aufgelöst 💜', ''); } };
  };
})();

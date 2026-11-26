/* Weitere Spiele: Sortieren, Freirubbeln, Sternbild, Fehlersuche */
(function () {
  const S = window.Spiele;
  const { h, shake, pick, FALSCH, RICHTIG } = window.SpielHelfer;

  /* ---------- Sortieren: in zwei Schalen einordnen ---------- */
  S.sortieren = function (root, cfg, api) {
    const ziel = cfg.ziel || 12;
    const dinge = [...cfg.dinge].sort(() => Math.random() - 0.5);
    let i = 0, punkte = 0, fertig = false;
    const wrap = h('div', { class: 'so-wrap' });
    root.append(wrap);
    const stand = h('div', { class: 'so-stand' });
    const buehne = h('div', { class: 'so-buehne' });
    const links = h('button', { class: 'so-schale links', type: 'button' }, h('span', { class: 'so-icon' }, cfg.links[0]), h('b', {}, cfg.links[1]));
    const rechts = h('button', { class: 'so-schale rechts', type: 'button' }, h('span', { class: 'so-icon' }, cfg.rechts[0]), h('b', {}, cfg.rechts[1]));
    wrap.append(stand, buehne, h('div', { class: 'so-schalen' }, links, rechts));
    function zeigen() {
      stand.textContent = `${punkte} / ${ziel} richtig einsortiert`;
      buehne.innerHTML = '';
      const d = dinge[i % dinge.length];
      buehne.append(h('div', { class: 'so-ding pop-in' }, h('span', {}, d[0]), h('small', {}, d[1])));
    }
    function waehle(seite, btn) {
      if (fertig) return;
      const d = dinge[i % dinge.length];
      const ding = buehne.firstChild;
      if (d[2] === seite) {
        punkte++;
        ding.classList.add(seite === 'links' ? 'nach-links' : 'nach-rechts');
        btn.classList.add('voll');
        setTimeout(() => btn.classList.remove('voll'), 300);
        api.say(pick(RICHTIG), 'good');
        i++;
        if (punkte >= ziel) { fertig = true; stand.textContent = `${punkte} / ${ziel} richtig einsortiert`; setTimeout(() => api.solved(), 700); return; }
        setTimeout(zeigen, 280);
      } else {
        shake(ding);
        api.fail();
        api.say(pick(['Hmm, schmeck nochmal genau 😋', 'Ganz sicher? Probier die andere Schale.', 'Ups, das gehört woanders hin.']), 'bad');
      }
    }
    links.onclick = () => waehle('links', links);
    rechts.onclick = () => waehle('rechts', rechts);
    zeigen();
    return { solveNow() { fertig = true; punkte = ziel; buehne.innerHTML = ''; stand.textContent = 'Alles einsortiert ✨'; } };
  };

  /* ---------- Freirubbeln: Eisblumen vom Fenster wischen ---------- */
  S.rubbeln = function (root, cfg, api) {
    const wrap = h('div', { class: 'ru-wrap' });
    root.append(wrap);
    wrap.append(h('p', { class: 'g-prompt' }, 'Rubbel mit dem Finger über das gefrorene Fenster.'));
    const karte = h('div', { class: 'ru-karte' },
      h('div', { class: 'ru-innen' },
        h('span', { class: 'ru-deko' }, cfg.deko || '✨'),
        h('b', {}, cfg.wort),
        cfg.unter ? h('small', {}, cfg.unter) : null));
    const c = h('canvas', { class: 'ru-canvas' });
    karte.append(c);
    const balken = h('div', { class: 'ru-balken' }, h('i', {}));
    wrap.append(karte, balken);
    let ctx, w, hh, fertig = false, zuletzt = null, zaehler = 0;
    function aufbauen() {
      w = karte.clientWidth; hh = karte.clientHeight;
      if (!w) return requestAnimationFrame(aufbauen);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = w * dpr; c.height = hh * dpr;
      ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, w, hh);
      g.addColorStop(0, '#e9eefc'); g.addColorStop(0.5, '#cfd8f5'); g.addColorStop(1, '#e3dcf7');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, hh);
      // Eisblumen
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
      for (let k = 0; k < 18; k++) {
        const x = Math.random() * w, y = Math.random() * hh, r = 10 + Math.random() * 22;
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * r * 0.55, y + Math.sin(ang) * r * 0.55);
          ctx.lineTo(x + Math.cos(ang + 0.5) * r * 0.75, y + Math.sin(ang + 0.5) * r * 0.75); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(90,80,140,0.55)';
      ctx.font = '600 16px Nunito, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('❄  hier rubbeln  ❄', w / 2, hh / 2 + 5);
      ctx.globalCompositeOperation = 'destination-out';
    }
    function rubbel(x, y) {
      ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      if (zuletzt) ctx.moveTo(zuletzt[0], zuletzt[1]); else ctx.moveTo(x - 0.1, y);
      ctx.lineTo(x, y); ctx.stroke();
      zuletzt = [x, y];
      if (++zaehler % 8 === 0) pruefen();
    }
    function pruefen() {
      if (!c.width || !c.height) return;
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let frei = 0, n = 0;
      for (let k = 3; k < d.length; k += 4 * 40) { n++; if (d[k] < 40) frei++; }
      const anteil = frei / n;
      balken.firstChild.style.width = Math.min(100, (anteil / 0.6) * 100) + '%';
      if (anteil > 0.6 && !fertig) {
        fertig = true;
        c.classList.add('weg');
        api.say('Freigerubbelt! ✨', 'good');
        setTimeout(() => api.solved(), 900);
      }
    }
    const punkt = (e) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    let unten = false;
    c.addEventListener('pointerdown', (e) => { if (fertig) return; e.preventDefault(); unten = true; zuletzt = null; c.setPointerCapture(e.pointerId); rubbel(...punkt(e)); });
    c.addEventListener('pointermove', (e) => { if (unten && !fertig) rubbel(...punkt(e)); });
    const hoch = () => { unten = false; zuletzt = null; if (!fertig) pruefen(); };
    c.addEventListener('pointerup', hoch);
    c.addEventListener('pointercancel', hoch);
    requestAnimationFrame(aufbauen);
    return { solveNow() { fertig = true; c.classList.add('weg'); balken.firstChild.style.width = '100%'; } };
  };

  /* ---------- Sternbild: Sterne der Reihe nach verbinden ---------- */
  S.sternbild = function (root, cfg, api) {
    const P = cfg.punkte;
    let naechster = 0, fertig = false;
    const wrap = h('div', { class: 'sb-wrap' });
    root.append(wrap);
    wrap.append(h('p', { class: 'g-prompt' }, 'Tippe die Sterne der Reihe nach an, angefangen bei 1.'));
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 300 200');
    svg.setAttribute('class', 'sb-svg');
    const linien = document.createElementNS(ns, 'g');
    const flaeche = document.createElementNS(ns, 'path');
    flaeche.setAttribute('class', 'sb-flaeche');
    svg.append(flaeche, linien);
    for (let k = 0; k < 40; k++) {
      const s = document.createElementNS(ns, 'circle');
      s.setAttribute('cx', Math.random() * 300); s.setAttribute('cy', Math.random() * 200);
      s.setAttribute('r', 0.4 + Math.random() * 0.8); s.setAttribute('class', 'sb-hinten');
      svg.insertBefore(s, flaeche);
    }
    const sterne = P.map(([x, y], k) => {
      const g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'sb-stern');
      g.innerHTML = `<circle cx="${x}" cy="${y}" r="13" fill="transparent"/><circle class="sb-punkt" cx="${x}" cy="${y}" r="3.6"/><text x="${x + 6}" y="${y - 6}">${k + 1}</text>`;
      g.addEventListener('pointerdown', (e) => { e.preventDefault(); tippe(k, g); });
      svg.append(g);
      return g;
    });
    wrap.append(svg);
    function linie(a, b) {
      const l = document.createElementNS(ns, 'line');
      l.setAttribute('x1', P[a][0]); l.setAttribute('y1', P[a][1]); l.setAttribute('x2', P[b][0]); l.setAttribute('y2', P[b][1]);
      l.setAttribute('class', 'sb-linie');
      linien.append(l);
    }
    function tippe(k, g) {
      if (fertig) return;
      if (k !== naechster) {
        g.classList.add('falsch');
        setTimeout(() => g.classList.remove('falsch'), 400);
        api.fail();
        api.say(`Such mal die ${naechster + 1} ⭐`, 'bad');
        return;
      }
      g.classList.add('an');
      if (k > 0) linie(k - 1, k);
      naechster++;
      api.say('', '');
      if (naechster === P.length) fertig = true, abschluss(true);
    }
    function abschluss(echt) {
      linie(P.length - 1, 0);
      flaeche.setAttribute('d', 'M' + P.map((p) => p.join(' ')).join(' L') + ' Z');
      svg.classList.add('fertig');
      if (echt) { api.say('Wunderschön! ✨', 'good'); setTimeout(() => api.solved(), 1100); }
    }
    return {
      solveNow() {
        fertig = true;
        linien.innerHTML = '';
        sterne.forEach((g) => g.classList.add('an'));
        for (let k = 1; k < P.length; k++) linie(k - 1, k);
        abschluss(false);
      },
    };
  };

  /* ---------- Fehlersuche: Unterschiede zwischen zwei Bildern ---------- */
  S.fehler = function (root, cfg, api) {
    const F = window.Bilder.FEHLER;
    const gefunden = new Set();
    let fehlklicks = 0, fertig = false;
    const wrap = h('div', { class: 'fe-wrap' });
    root.append(wrap);
    const stand = h('div', { class: 'fe-stand' });
    const oben = h('div', { class: 'fe-bild', html: window.Bilder.weihnachtsabend(false) });
    const unten = h('div', { class: 'fe-bild', html: window.Bilder.weihnachtsabend(true) });
    wrap.append(h('p', { class: 'g-prompt' }, `Im unteren Bild haben sich ${F.length} Unterschiede versteckt. Tippe sie an!`), stand, oben, unten);
    function anzeigen() { stand.textContent = `${gefunden.size} von ${F.length} gefunden`; }
    function markiere(i) {
      [oben, unten].forEach((b) => {
        const svg = b.querySelector('svg');
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', F[i][0]); c.setAttribute('cy', F[i][1]); c.setAttribute('r', F[i][2]);
        c.setAttribute('class', 'fe-kreis');
        svg.append(c);
      });
    }
    [oben, unten].forEach((b) => b.addEventListener('pointerdown', (e) => {
      if (fertig) return;
      const svg = b.querySelector('svg');
      const r = svg.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 300, y = ((e.clientY - r.top) / r.height) * 220;
      const i = F.findIndex(([fx, fy, fr], k) => !gefunden.has(k) && Math.hypot(fx - x, fy - y) < fr + 8);
      if (i >= 0) {
        gefunden.add(i);
        markiere(i);
        anzeigen();
        api.say(pick(RICHTIG), 'good');
        if (gefunden.size === F.length) { fertig = true; setTimeout(() => api.solved(), 900); }
      } else {
        fehlklicks++;
        b.classList.remove('daneben'); void b.offsetWidth; b.classList.add('daneben');
        if (fehlklicks % 4 === 0) api.fail();
      }
    }));
    anzeigen();
    return { solveNow() { fertig = true; F.forEach((_, i) => { if (!gefunden.has(i)) { gefunden.add(i); markiere(i); } }); anzeigen(); } };
  };
})();

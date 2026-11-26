/* Kleine Zeichnungen (SVG) für Türchen und Spiele */
(function () {
  const B = {};

  /* ---------- Motive für die Türchen ---------- */
  B.motive = [
    // Stern
    '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.6 6.1 6.6.5-5 4.3 1.6 6.4L12 16.4l-5.8 3.4 1.6-6.4-5-4.3 6.6-.5z" fill="currentColor"/></svg>',
    // Tanne
    '<svg viewBox="0 0 24 24"><path d="M12 2l4 5h-2.2l3.7 5h-2.4l4.4 6H4.5l4.4-6H6.5l3.7-5H8z" fill="currentColor"/><rect x="10.8" y="18" width="2.4" height="3.5" rx=".6" fill="currentColor"/></svg>',
    // Schneeflocke
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/><path d="M9.5 3.8L12 6l2.5-2.2M9.5 20.2L12 18l2.5 2.2M4 10.2l3.2-.9-.8-3.2M20 13.8l-3.2.9.8 3.2M4 13.8l3.2.9-.8 3.2M20 10.2l-3.2-.9.8-3.2"/></svg>',
    // Kugel
    '<svg viewBox="0 0 24 24"><rect x="10" y="2.5" width="4" height="3" rx=".8" fill="currentColor"/><circle cx="12" cy="14" r="7.5" fill="currentColor"/><path d="M5.5 12.5c2.2 1.6 4.3 1.6 6.5 0s4.3-1.6 6.5 0" stroke="rgba(0,0,0,.25)" stroke-width="1.4" fill="none"/></svg>',
    // Kerze
    '<svg viewBox="0 0 24 24"><path d="M12 2.2c1.6 2 2.2 3.4 2.2 4.4a2.2 2.2 0 01-4.4 0c0-1 .6-2.4 2.2-4.4z" fill="currentColor"/><rect x="8.5" y="10" width="7" height="12" rx="1.2" fill="currentColor"/></svg>',
    // Herz
    '<svg viewBox="0 0 24 24"><path d="M12 21s-7.8-4.9-9.4-10C1.5 7.5 3.8 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.4 0 5.7 3.5 4.6 7-1.6 5.1-9.4 10-9.4 10z" fill="currentColor"/></svg>',
    // Geschenk
    '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="1.5" fill="currentColor"/><rect x="2" y="6.5" width="20" height="4" rx="1" fill="currentColor"/><path d="M12 6.5V21" stroke="rgba(0,0,0,.25)" stroke-width="2"/><path d="M12 6.5C10 3 6.5 3 6.8 5.2 7 6.5 12 6.5 12 6.5zm0 0c2-3.5 5.5-3.5 5.2-1.3-.2 1.3-5.2 1.3-5.2 1.3z" fill="currentColor"/></svg>',
    // Mistelzweig
    '<svg viewBox="0 0 24 24"><path d="M12 3v7" stroke="currentColor" stroke-width="1.5"/><path d="M12 10c-4-1-7 1-7.5 4 3 .6 6-.8 7.5-4zm0 0c4-1 7 1 7.5 4-3 .6-6-.8-7.5-4z" fill="currentColor"/><circle cx="10.5" cy="13.2" r="1.7" fill="currentColor"/><circle cx="13.5" cy="13.2" r="1.7" fill="currentColor"/><circle cx="12" cy="15.6" r="1.7" fill="currentColor"/></svg>',
  ];

  B.geschenk =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="26" width="44" height="30" rx="3" fill="#a3202f"/><rect x="7" y="18" width="50" height="11" rx="2.5" fill="#c22f40"/><rect x="28.5" y="18" width="7" height="38" fill="#e3c06e"/><path d="M32 18c-5-9-14-9-13.3-3.5C19.2 18 32 18 32 18zm0 0c5-9 14-9 13.3-3.5C44.8 18 32 18 32 18z" fill="#e3c06e"/></svg>';

  /* ---------- Weihnachtsbaum fürs Galgenmännchen ---------- */
  B.baum = function () {
    const kugeln = [
      [60, 52, '#a3202f'], [44, 72, '#e3c06e'], [76, 76, '#fbf4e6'],
      [58, 92, '#c22f40'], [36, 104, '#fbf4e6'], [86, 106, '#e3c06e'], [62, 116, '#a3202f'],
    ];
    return (
      '<svg viewBox="0 0 120 140" class="baum-svg" aria-hidden="true">' +
      '<rect x="53" y="122" width="14" height="14" rx="2" fill="#6b4126"/>' +
      '<path d="M60 22 L90 62 H76 L100 94 H84 L108 126 H12 L36 94 H20 L44 62 H30 Z" fill="#2f6b4b"/>' +
      '<path d="M60 22 L90 62 H76 L100 94 H84 L108 126 H60 Z" fill="#245a3e"/>' +
      '<path d="M38 66 Q60 78 84 64 M30 98 Q62 112 94 96" stroke="#e3c06e" stroke-width="1.6" fill="none" stroke-dasharray="2 4" stroke-linecap="round"/>' +
      '<path d="M60 5l3.4 7.6 8.2.7-6.2 5.4 1.9 8L60 22.4l-7.3 4.3 1.9-8-6.2-5.4 8.2-.7z" fill="#f1d58f"/>' +
      kugeln
        .map(
          (k, i) =>
            `<g class="kugel" data-i="${i + 1}"><circle cx="${k[0]}" cy="${k[1]}" r="6.5" fill="${k[2]}"/><circle cx="${k[0] - 2}" cy="${k[1] - 2.2}" r="1.8" fill="#fff" opacity=".7"/></g>`
        )
        .join('') +
      '</svg>'
    );
  };

  /* ---------- Herzschloss ---------- */
  B.schloss = function () {
    return (
      '<svg viewBox="0 0 120 140" class="schloss-svg" aria-hidden="true">' +
      '<path class="buegel" d="M34 66 V42 a26 26 0 0 1 52 0 V66" fill="none" stroke="#d8b25a" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M60 134 C30 116 10 98 10 76 C10 60 22 50 36 50 C47 50 55 56 60 64 C65 56 73 50 84 50 C98 50 110 60 110 76 C110 98 90 116 60 134Z" fill="#a3202f"/>' +
      '<path d="M60 134 C30 116 10 98 10 76 C10 60 22 50 36 50 C47 50 55 56 60 64 Z" fill="#b8283a"/>' +
      '<circle cx="60" cy="86" r="8" fill="#5e1019"/><path d="M56 88 h8 l-2 16 h-4z" fill="#5e1019"/>' +
      '<path d="M26 68 q6-8 14-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".35"/>' +
      '</svg>'
    );
  };

  /* ---------- Schiebepuzzle Bild: Häuschen im Schnee ---------- */
  B.haeuschen = function () {
    const sterne = [[24, 28], [62, 16], [110, 36], [200, 20], [276, 58], [16, 96], [150, 30], [240, 100]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#fff" opacity=".85"/>`).join('');
    const baeume = [[34, 236, 1], [268, 232, 1.2], [242, 246, .8]]
      .map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -56 L18 -24 H9 L24 0 H-24 L-9 -24 H-18Z" fill="#1f4a3b"/><path d="M0 -56 L8 -42 L-8 -42Z M-12 -24 L12 -24 L9 -20 L-9 -20Z" fill="#fff" opacity=".9"/><rect x="-3" y="0" width="6" height="7" fill="#4a3426"/></g>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
<defs><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1b4a"/><stop offset="1" stop-color="#5a4a8a"/></linearGradient>
<radialGradient id="f" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#fff4c9"/><stop offset="1" stop-color="#f2a93b"/></radialGradient>
<radialGradient id="g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd98a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="300" fill="url(#h)"/>${sterne}
<circle cx="238" cy="58" r="20" fill="#f6ecc9"/><circle cx="247" cy="51" r="17" fill="#33245a"/>
<path d="M0 220 Q80 196 160 214 T300 206 V300 H0Z" fill="#cfc6e6"/>
<path d="M0 248 Q90 226 170 244 T300 238 V300 H0Z" fill="#f5f2fb"/>
<ellipse cx="150" cy="210" rx="110" ry="60" fill="url(#g)"/>
<rect x="186" y="84" width="20" height="40" fill="#7a3b2e"/><path d="M183 84 h26 v-6 a13 6 0 0 0 -26 0z" fill="#fff"/>
<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"><path d="M196 70 c-10-10 10-16 0-28 s10-18 0-28"/></g>
<rect x="86" y="140" width="128" height="96" fill="#8f3b32"/>
<path d="M86 160 h128 M86 180 h128 M86 200 h128 M86 220 h128" stroke="#7a3029" stroke-width="2"/>
<path d="M70 146 L150 80 L230 146 Z" fill="#3a2b52"/>
<path d="M66 148 L150 76 L234 148" fill="none" stroke="#fff" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M78 150 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0" fill="#fff"/>
<rect x="100" y="164" width="34" height="30" rx="3" fill="url(#f)" stroke="#f5efe2" stroke-width="5"/>
<path d="M117 164v30M100 179h34" stroke="#f5efe2" stroke-width="3"/>
<rect x="166" y="164" width="34" height="30" rx="3" fill="url(#f)" stroke="#f5efe2" stroke-width="5"/>
<path d="M183 164v30M166 179h34" stroke="#f5efe2" stroke-width="3"/>
<path d="M136 236 V206 a14 14 0 0 1 28 0 V236z" fill="#3a2b52"/><circle cx="158" cy="222" r="2.4" fill="#f2c94c"/>
<circle cx="150" cy="198" r="7" fill="none" stroke="#2f6b4b" stroke-width="4"/><circle cx="150" cy="192" r="2.4" fill="#c22f40"/>
<path d="M98 160 q6 4 10 0 q6 4 10 0 q6 4 10 0 q6 4 10 0 q6 4 10 0" stroke="#f1d58f" stroke-width="1.5" fill="none" stroke-dasharray="1 4" stroke-linecap="round"/>
${baeume}
<g fill="#fff" opacity=".9"><circle cx="40" cy="150" r="2"/><circle cx="262" cy="170" r="2.4"/><circle cx="60" cy="196" r="1.8"/><circle cx="276" cy="130" r="1.6"/><circle cx="20" cy="190" r="1.6"/></g>
</svg>`;
  };

  /* ---------- Schiebepuzzle Bild: kalt und heiß ---------- */
  B.hitze = function () {
    const flocken = [[30, 40], [80, 30], [50, 90], [110, 70], [26, 150], [90, 140], [120, 200], [40, 220], [100, 260]]
      .map(([x, y]) => `<g transform="translate(${x} ${y})" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M0 -9V9M-8 -4.5L8 4.5M-8 4.5L8 -4.5"/></g>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
<defs><linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb4e0"/><stop offset="1" stop-color="#d8ecf8"/></linearGradient>
<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0473f"/><stop offset="1" stop-color="#f6b04c"/></linearGradient></defs>
<rect width="150" height="300" fill="url(#k)"/><rect x="150" width="150" height="300" fill="url(#w)"/>
${flocken}
<path d="M0 250 Q40 236 80 248 T150 242 V300 H0Z" fill="#fff"/>
<g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6">
<path d="M190 250 c-14-18 14-30 0-48 s14-30 0-48"/><path d="M262 250 c-14-18 14-30 0-48 s14-30 0-48"/><path d="M226 120 c-10-14 10-22 0-36"/></g>
<circle cx="250" cy="52" r="26" fill="#ffe08a"/><g stroke="#ffe08a" stroke-width="5" stroke-linecap="round"><path d="M250 12v-8M250 100v-8M210 52h-8M298 52h-8M222 24l-6-6M278 80l6 6M278 24l6-6M222 80l-6 6"/></g>
<rect x="136" y="40" width="28" height="190" rx="14" fill="#fbf4e6" stroke="#6b4126" stroke-width="5"/>
<circle cx="150" cy="240" r="26" fill="#c22f40" stroke="#6b4126" stroke-width="5"/>
<rect x="144" y="70" width="12" height="160" rx="6" fill="#c22f40"/>
<g stroke="#6b4126" stroke-width="3"><path d="M164 70h10M164 100h10M164 130h10M164 160h10M164 190h10"/></g>
<circle cx="142" cy="232" r="6" fill="#fff" opacity=".5"/>
</svg>`;
  };

  /* ---------- Der große Weihnachtsbaum (viewBox 100 x 112) ---------- */
  B.baum_gross = function () {
    function tier(top, bottom, half, wellen) {
      const l = 50 - half, r = 50 + half, step = (r - l) / wellen;
      let d = `M50 ${top} L${r} ${bottom}`;
      for (let i = 0; i < wellen; i++) {
        const x1 = r - step * (i + 1);
        d += ` Q${r - step * (i + 0.5)} ${bottom + 3.2} ${x1} ${bottom}`;
      }
      return d + ' Z';
    }
    function schatten(top, bottom, half, wellen) {
      const r = 50 + half, step = (2 * half) / wellen;
      let d = `M50 ${top} L${r} ${bottom}`;
      const n = Math.floor(wellen / 2);
      for (let i = 0; i < n; i++) d += ` Q${r - step * (i + 0.5)} ${bottom + 3.2} ${r - step * (i + 1)} ${bottom}`;
      return d + ` L50 ${bottom + 1} Z`;
    }
    function schnee(top, bottom, half, wellen) {
      const l = 50 - half, step = (2 * half) / wellen;
      let d = '';
      for (let i = 0; i < wellen; i++) {
        const x0 = l + step * i;
        d += `M${x0 + 0.8} ${bottom + 0.6} Q${x0 + step / 2} ${bottom + 3.6} ${x0 + step - 0.8} ${bottom + 0.6} `;
      }
      return d;
    }
    const tiers = [[12, 38, 21, 5], [26, 61, 33, 7], [44, 86, 47, 9]];
    const lichter = [];
    const girlanden = [
      [[34, 33], [50, 37], [66, 31]],
      [[27, 52], [50, 57], [73, 50]],
      [[18, 74], [50, 80], [82, 72]],
    ];
    let gd = '';
    girlanden.forEach(([a, m, b], gi) => {
      gd += `<path d="M${a[0]} ${a[1]} Q${m[0]} ${m[1] + 6} ${b[0]} ${b[1]}" fill="none" stroke="#f1d58f" stroke-width=".45" opacity=".7"/>`;
      for (let t = 0.06; t < 1; t += 0.11) {
        const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * m[0] + t * t * b[0];
        const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * (m[1] + 6) + t * t * b[1];
        lichter.push(`<circle class="lamp" cx="${x.toFixed(2)}" cy="${(y + 0.5).toFixed(2)}" r=".85" style="--d:${(gi * 0.7 + t * 3).toFixed(2)}s"/>`);
      }
    });
    return `<svg viewBox="0 0 100 112" preserveAspectRatio="xMidYMid meet" aria-hidden="true" class="baum-gross">
<defs>
<linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f7a58"/><stop offset="1" stop-color="#174a35"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#ffd98a" stop-opacity=".28"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
<radialGradient id="boden" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9d0ef"/></radialGradient>
</defs>
<ellipse cx="50" cy="56" rx="50" ry="52" fill="url(#glow)"/>
<ellipse cx="50" cy="100" rx="56" ry="13" fill="url(#boden)"/>
<ellipse cx="50" cy="92" rx="20" ry="2.4" fill="#000" opacity=".16"/>
<rect x="46.3" y="84" width="7.4" height="9" rx="1" fill="#5b3a26"/><rect x="49.5" y="84" width="4.2" height="9" fill="#4a2f1f"/>
${tiers.map(([t, b, h, w]) => `<path d="${tier(t, b, h, w)}" fill="url(#bg1)"/><path d="${schatten(t, b, h, w)}" fill="#0f3a28" opacity=".45"/><path d="${schnee(t, b, h, w)}" fill="none" stroke="#f5f2fb" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>`).join('')}
${gd}${lichter.join('')}
</svg>`;
  };

  /* ---------- Lavendelzweig für das Briefpapier ---------- */
  B.zweig =
    '<svg viewBox="0 0 60 90" aria-hidden="true"><path d="M30 88 C30 60 28 40 22 8" stroke="#6f8a62" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 70 C38 62 44 60 50 60 M29 54 C22 48 16 47 10 48" stroke="#6f8a62" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
    [[22, 8], [24, 14], [21, 19], [25, 24], [22, 29], [26, 34], [23, 39], [27, 44], [50, 58], [46, 56], [10, 46], [14, 44]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="4.6" fill="${i % 2 ? '#9b85c9' : '#b9a6e0'}" transform="rotate(${i % 2 ? 20 : -20} ${x} ${y})"/>`).join('') +
    '</svg>';

  /* ---------- Nikolausstiefel ---------- */
  B.stiefel =
    '<svg viewBox="0 0 64 70" aria-hidden="true"><path d="M18 14 h24 v30 c8 1 16 5 16 14 v4 H10 c-2 0-4-2-4-4 V14z" fill="#c22f40"/><path d="M42 44 c8 1 16 5 16 14 v4 H34z" fill="#a3202f"/><rect x="14" y="6" width="32" height="12" rx="6" fill="#fbf8f2"/><circle cx="14" cy="60" r="0" fill="none"/><path d="M8 58 H58" stroke="#fbf8f2" stroke-width="5" stroke-linecap="round"/></svg>';

  window.Bilder = B;
})();

/* =====================================================================
   DAS WINTERDORF (viewBox 400 x 1080)
   ===================================================================== */
(function () {
  const B = window.Bilder;
  const FW = 46, FH = 50; // Fenstergröße

  // Häuser mit ihren Fenstern (Fenster = Türchen)
  const HAEUSER = [
    { x: 18, y: 140, w: 84, h: 190, dach: 62, farbe: '#e8dcc6', balken: true, laden: 'gruen', fenster: [[37, 165], [37, 247]], glocke: true },
    { x: 120, y: 185, w: 150, h: 125, dach: 64, farbe: '#9c3b32', laden: 'creme', fenster: [[136, 205], [208, 205]], tuer: [180, 262] },
    { x: 288, y: 160, w: 96, h: 185, dach: 58, farbe: '#5a6fa8', laden: 'creme', fenster: [[313, 180], [313, 262]] },
    { x: 10, y: 385, w: 150, h: 125, dach: 68, farbe: '#2f5d4a', laden: 'rot', fenster: [[28, 405], [96, 405]], tuer: [70, 462] },
    { x: 172, y: 350, w: 120, h: 172, dach: 64, farbe: '#e8dcc6', balken: true, laden: 'rot', fenster: [[186, 370], [240, 370], [213, 452]] },
    { x: 304, y: 380, w: 86, h: 172, dach: 58, farbe: '#c99a3b', laden: 'gruen', fenster: [[324, 395], [324, 477]] },
    { x: 6, y: 610, w: 120, h: 115, dach: 60, farbe: '#9c3b32', laden: 'creme', fenster: [[20, 630], [72, 630]], tuer: [48, 683] },
    { x: 140, y: 580, w: 140, h: 182, dach: 72, farbe: '#5a6fa8', laden: 'creme', fenster: [[156, 600], [222, 600], [156, 682], [222, 682]] },
    { x: 290, y: 610, w: 106, h: 115, dach: 60, farbe: '#2f5d4a', laden: 'rot', fenster: [[300, 630], [350, 630]], tuer: [334, 683] },
  ];
  const DY = 60; // so weit ist das Dorf nach unten gerückt
  B.DORF = { HAEUSER, FW, FH, W: 400, H: 1140, DY };

  const tanne = (x, y, s, dunkel) => {
    const c = dunkel ? '#123628' : '#1f4a3b';
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -60 L16 -36 H8 L24 -12 H12 L30 14 H-30 L-12 -12 H-24 L-8 -36 H-16Z" fill="${c}"/><path d="M0 -60 L7 -50 L-7 -50Z M-16 -36 L-6 -36 L-10 -32Z M6 -36 L16 -36 L10 -32Z M-24 -12 L-12 -12 L-16 -8Z M12 -12 L24 -12 L18 -8Z M-30 14 L-16 14 L-22 18Z M16 14 L30 14 L22 18Z" fill="#f2f0fb"/><rect x="-3" y="14" width="6" height="8" fill="#3a2a20"/></g>`;
  };

  function haus(hs) {
    const { x, y, w, h, dach, farbe } = hs;
    const ax = x + w / 2;
    let s = '';
    // Schornstein mit Rauch
    const kx = x + w * 0.72;
    s += `<rect x="${kx}" y="${y - dach * 0.62}" width="14" height="${dach * 0.5}" fill="#4a3426"/><rect x="${kx - 2}" y="${y - dach * 0.66}" width="18" height="7" rx="3" fill="#f5f2fb"/>`;
    s += `<g class="rauch" style="--rd:${(x % 7) * 0.6}s"><path d="M${kx + 7} ${y - dach * 0.7} c-8 -10 8 -16 0 -26 s8 -16 0 -26" fill="none" stroke="#e9e4f7" stroke-width="6" stroke-linecap="round" opacity=".55"/></g>`;
    // Wand
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${farbe}"/>`;
    s += `<rect x="${x + w * 0.62}" y="${y}" width="${w * 0.38}" height="${h}" fill="#000" opacity=".12"/>`;
    if (hs.balken) {
      s += `<g stroke="#6b4a32" stroke-width="3" opacity=".75"><path d="M${x} ${y + 4}H${x + w}M${x + 3} ${y}V${y + h}M${x + w - 3} ${y}V${y + h}"/></g>`;
    } else {
      for (let yy = y + 14; yy < y + h; yy += 14) s += `<path d="M${x} ${yy}H${x + w}" stroke="#000" stroke-width="1" opacity=".08"/>`;
    }
    // Tür
    if (hs.tuer) {
      const [tx, ty] = hs.tuer;
      s += `<path d="M${tx} ${y + h} V${ty + 10} a14 14 0 0 1 28 0 V${y + h}z" fill="#3a2a20"/><circle cx="${tx + 22}" cy="${ty + 28}" r="2" fill="#f6dc96"/>`;
      s += `<circle cx="${tx + 14}" cy="${ty + 12}" r="7" fill="none" stroke="#2f7a58" stroke-width="3.5"/><circle cx="${tx + 14}" cy="${ty + 6}" r="2" fill="#c22f40"/>`;
      s += `<rect x="${tx - 4}" y="${y + h - 3}" width="36" height="5" rx="2" fill="#f5f2fb"/>`;
    }
    // Dach mit dicker Schneedecke
    s += `<path d="M${x - 12} ${y + 4} L${ax} ${y - dach} L${x + w + 12} ${y + 4} Z" fill="#33264f"/>`;
    s += `<path d="M${x - 16} ${y + 6} L${ax} ${y - dach - 6} L${x + w + 16} ${y + 6} q-6 9 -14 3 q-8 8 -16 1 q-8 9 -17 1 q-9 8 -17 0 q-8 9 -17 1 q-9 8 -18 0 q-7 8 -15 1 Z" fill="#f7f5fd"/>`;
    s += `<path d="M${ax} ${y - dach - 6} L${x + w + 16} ${y + 6}" stroke="#d9d0ef" stroke-width="3" opacity=".7"/>`;
    if (hs.glocke) s += `<path d="M${ax - 6} ${y - dach + 22} a6 6 0 0 1 12 0 v6 h3 h-18 h3z" fill="#e0b85c"/><circle cx="${ax}" cy="${y - dach + 31}" r="1.8" fill="#e0b85c"/>`;
    // Schnee vor dem Haus
    s += `<path d="M${x - 10} ${y + h + 4} q${w / 4} -12 ${w / 2 + 10} -4 q${w / 4} -10 ${w / 2 + 10} 4 Z" fill="#f2f0fb"/>`;
    return s;
  }

  function lichterkette(punkte, phase) {
    let d = `M${punkte[0][0]} ${punkte[0][1]}`;
    let lampen = '';
    const farben = ['#ffe7a6', '#ff8a8a', '#a9e6c4', '#c9b6ff'];
    for (let i = 1; i < punkte.length; i++) {
      const [x0, y0] = punkte[i - 1], [x1, y1] = punkte[i];
      const mx = (x0 + x1) / 2, my = Math.max(y0, y1) + 18;
      d += ` Q${mx} ${my} ${x1} ${y1}`;
      for (let t = 0.12; t < 1; t += 0.16) {
        const bx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1;
        const by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1;
        lampen += `<circle class="lamp" cx="${bx.toFixed(1)}" cy="${(by + 2.5).toFixed(1)}" r="2.6" fill="${farben[Math.round(t * 10 + i) % farben.length]}" style="--d:${(phase + t * 2 + i).toFixed(2)}s"/>`;
      }
    }
    return `<path d="${d}" fill="none" stroke="#1d1533" stroke-width="1.2"/>${lampen}`;
  }

  const laterne = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="-58" rx="26" ry="26" fill="url(#laternenSchein)"/><rect x="-2.5" y="-50" width="5" height="62" fill="#2a2140"/><path d="M-9 -50 h18 l-3 -14 h-12z" fill="#ffe1a0"/><path d="M-11 -64 h22 l-11 -8z" fill="#2a2140"/><rect x="-11" y="-51" width="22" height="3" fill="#2a2140"/><path d="M-12 -66 h24" stroke="#f5f2fb" stroke-width="3" stroke-linecap="round"/></g>`;

  const laeufer = (x, y, schal, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-15" r="3.2" fill="#2a2140"/><path d="M-3 -11 h6 l2 9 h-10z" fill="#2a2140"/><path d="M-2 -2 l-3 7 M2 -2 l4 6" stroke="#2a2140" stroke-width="1.8" stroke-linecap="round"/><path d="M-3 -11 h6" stroke="${schal}" stroke-width="2.4"/><path d="M3 -10 l4 3" stroke="${schal}" stroke-width="1.6"/></g>`;

  B.dorf = function () {
    let s = `<svg viewBox="0 0 400 1140" preserveAspectRatio="xMidYMin meet" aria-hidden="true" class="dorf-svg">
<defs>
<linearGradient id="berg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f86c4"/><stop offset="1" stop-color="#4b3f86"/></linearGradient>
<linearGradient id="berg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c62a8"/><stop offset="1" stop-color="#352a66"/></linearGradient>
<linearGradient id="see" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d8fd0"/><stop offset="1" stop-color="#2f2a66"/></linearGradient>
<linearGradient id="hang" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcd6f2"/><stop offset=".5" stop-color="#cfc6ea"/><stop offset="1" stop-color="#b6aadb"/></linearGradient>
<radialGradient id="laternenSchein" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd98a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
<radialGradient id="baumSchein" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd98a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
<linearGradient id="baumG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f7a58"/><stop offset="1" stop-color="#174a35"/></linearGradient>
</defs>`;
    // Berge
    s += `<path d="M0 120 L40 62 L70 92 L118 30 L160 84 L196 52 L240 98 L286 22 L330 80 L362 50 L400 92 V140 H0Z" fill="url(#berg)"/>`;
    s += `<path d="M118 30 L104 50 L114 48 L120 56 L128 46 L136 52 Z M286 22 L270 46 L282 42 L288 52 L296 42 L306 48 Z M40 62 L32 74 L42 72 L48 78 Z M196 52 L186 66 L196 64 L204 70 L210 64 Z M362 50 L352 64 L362 62 L370 68 Z" fill="#f5f2fb" opacity=".95"/>`;
    s += `<path d="M0 132 L52 96 L96 120 L150 88 L210 124 L262 96 L320 126 L372 100 L400 112 V150 H0Z" fill="url(#berg2)"/>`;
    // See mit Mondspiegelung und Schlittschuhläufern
    s += `<rect x="0" y="138" width="400" height="40" fill="url(#see)"/>`;
    s += `<g class="glitzer-see" fill="#fff6d8"><rect x="300" y="142" width="26" height="1.6" rx=".8" opacity=".8"/><rect x="306" y="148" width="16" height="1.4" rx=".7" opacity=".6"/><rect x="302" y="154" width="22" height="1.2" rx=".6" opacity=".5"/><rect x="309" y="160" width="10" height="1" rx=".5" opacity=".4"/></g>`;
    s += `<path d="M20 150 h40 M90 164 h30 M180 146 h50 M240 170 h24" stroke="#dfe4ff" stroke-width="1" opacity=".35"/>`;
    s += `<g class="laeufer">${laeufer(150, 160, '#e2525f', 1)}${laeufer(160, 160, '#b9a6ff', 1)}<path d="M152 148 q4 2 7 0" stroke="#2a2140" stroke-width="1.4" fill="none"/></g>`;
    // Waldrand
    let wald = '';
    for (let i = 0; i < 24; i++) wald += tanne(i * 17 + (i % 3) * 3, 186 + (i % 2) * 6, 0.42 + (i % 4) * 0.05, true);
    s += wald;
    // Hang
    s += `<path d="M0 180 Q100 168 200 182 T400 176 V1140 H0Z" fill="url(#hang)"/>`;
    s += `<g transform="translate(0 ${DY})">`;
    s += `<path d="M0 520 Q120 500 220 530 T400 520 V1080 H0Z" fill="#e3ddf5" opacity=".7"/>`;
    s += `<path d="M0 760 Q140 730 240 760 T400 750 V1080 H0Z" fill="#efebfa"/>`;
    // Fußspuren
    let spuren = '';
    for (let i = 0; i < 16; i++) { const t = i / 15; const x = 220 + Math.sin(t * 5) * 26 - t * 40; const y = 1060 - t * 330; spuren += `<ellipse cx="${(x + (i % 2 ? 5 : -5)).toFixed(1)}" cy="${y.toFixed(1)}" rx="2.4" ry="3.6" fill="#b6aadb" opacity=".55"/>`; }
    s += spuren;
    // Tannen zwischen den Häusern
    s += tanne(112, 330, 0.75) + tanne(282, 330, 0.62) + tanne(168, 540, 0.7) + tanne(298, 556, 0.6) + tanne(132, 760, 0.62) + tanne(392, 300, 0.7) + tanne(8, 545, 0.55);
    // Häuser, von hinten nach vorne
    HAEUSER.forEach((hs) => (s += haus(hs)));
    // Lichterketten
    s += lichterkette([[18, 146], [120, 190], [270, 190], [384, 166]], 0);
    s += lichterkette([[10, 390], [160, 390], [172, 356], [292, 356], [304, 386], [390, 386]], 1.3);
    s += lichterkette([[6, 615], [126, 615], [140, 586], [280, 586], [290, 615], [396, 615]], 2.1);
    // Laternen
    s += laterne(150, 520) + laterne(292, 762) + laterne(30, 770);
    // Großer Baum
    s += `<ellipse cx="200" cy="900" rx="150" ry="140" fill="url(#baumSchein)"/>`;
    s += `<ellipse cx="200" cy="1000" rx="110" ry="12" fill="#b6aadb" opacity=".6"/>`;
    s += `<rect x="192" y="975" width="16" height="22" fill="#5b3a26"/>`;
    const stufe = (top, unten, halb) => `<path d="M200 ${top} L${200 + halb} ${unten} q-${halb / 3} 8 -${halb / 1.5} 2 q-${halb / 3} 8 -${halb / 1.5} 0 q-${halb / 3} 8 -${halb / 1.5} -2 Z" fill="url(#baumG)"/><path d="M200 ${top} L${200 + halb} ${unten} q-${halb / 3} 8 -${halb / 1.5} 2 L200 ${unten + 4}Z" fill="#0f3a28" opacity=".35"/><path d="M${200 - halb} ${unten} q${halb / 3} 8 ${halb / 1.5} 2 q${halb / 3} 8 ${halb / 1.5} 0 q${halb / 3} 8 ${halb / 1.5} -2" fill="none" stroke="#f7f5fd" stroke-width="4" stroke-linecap="round"/>`;
    s += stufe(810, 868, 44) + stufe(842, 920, 66) + stufe(878, 978, 90);
    s += lichterkette([[168, 862], [232, 858]], 0.4) + lichterkette([[148, 912], [252, 906]], 1.1) + lichterkette([[126, 968], [274, 962]], 2);
    const kugeln = [[186, 846, '#c22f40'], [214, 878, '#e0b85c'], [176, 896, '#9b82d6'], [232, 936, '#c22f40'], [160, 944, '#e0b85c'], [206, 952, '#9b82d6'], [250, 890, '#f5f2fb']];
    kugeln.forEach(([x, y, c]) => (s += `<circle cx="${x}" cy="${y}" r="5" fill="${c}"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.4" fill="#fff" opacity=".7"/>`));
    // Schneemann
    s += `<g transform="translate(52 930)"><ellipse cx="0" cy="44" rx="30" ry="6" fill="#b6aadb" opacity=".6"/><circle cx="0" cy="22" r="24" fill="#fbfaff"/><circle cx="0" cy="-12" r="17" fill="#fbfaff"/><circle cx="-6" cy="-15" r="2" fill="#2a2140"/><circle cx="6" cy="-15" r="2" fill="#2a2140"/><path d="M0 -10 l14 3 -14 2z" fill="#f08a2c"/><path d="M-6 -4 q6 4 12 0" stroke="#2a2140" stroke-width="1.6" fill="none"/><path d="M-16 0 h32 v6 h-32z" fill="#c22f40"/><path d="M8 6 v18 h7 v-18z" fill="#c22f40"/><path d="M-12 -26 h24 v-4 h-4 v-16 h-16 v16 h-4z" fill="#2a2140"/><path d="M-8 -30 h16" stroke="#c22f40" stroke-width="3"/><circle cx="0" cy="16" r="2.2" fill="#2a2140"/><circle cx="0" cy="28" r="2.2" fill="#2a2140"/><path d="M-22 14 l-22 -16 M22 14 l20 -18" stroke="#5b3a26" stroke-width="3" stroke-linecap="round"/></g>`;
    // Vordergrund: Schneewehen und Tannenzweige an den Ecken
    s += `<path d="M0 1040 Q60 1016 130 1040 T260 1036 T400 1030 V1080 H0Z" fill="#f9f8fe"/>`;
    s += tanne(-8, 1060, 1.3, true) + tanne(410, 1066, 1.4, true);
    // Schlitten
    s += `<g transform="translate(338 1030)"><path d="M-34 0 h60 q14 0 14 -12" fill="none" stroke="#5b3a26" stroke-width="4" stroke-linecap="round"/><rect x="-30" y="-18" width="54" height="9" rx="2" fill="#9c3b32"/><path d="M-24 -9 v9 M18 -9 v9" stroke="#5b3a26" stroke-width="4"/><path d="M-30 -18 h54" stroke="#f5f2fb" stroke-width="4" stroke-linecap="round"/></g>`;
    s += '</g><rect x="0" y="1100" width="400" height="40" fill="#f9f8fe"/></svg>';
    return s;
  };
})();

/* =====================================================================
   FEHLERSUCHE: Weihnachtsabend (viewBox 300 x 220)
   ===================================================================== */
(function () {
  const B = window.Bilder;
  // Unterschiede: [x, y, Radius]
  B.FEHLER = [
    [84, 44, 14],   // Mond
    [200, 30, 14],  // Stern auf dem Baum
    [222, 118, 10], // zusätzliche Kugel
    [166, 152, 12], // Schleife am Geschenk
    [58, 118, 10],  // Kerzenflamme
    [98, 140, 11],  // Herz auf der Tasse
  ];
  B.weihnachtsabend = function (anders) {
    const sterne = [[34, 34], [52, 58], [100, 30], [64, 28], [40, 80], [96, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join('');
    const kugeln = [[188, 82, '#c22f40'], [212, 96, '#e0b85c'], [182, 128, '#b9a6e0'], [214, 146, '#c22f40'], [196, 112, '#f5f2fb']]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`).join('');
    return `<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<rect width="300" height="220" fill="#3b2a5a"/>
<path d="M0 0h300v6H0z" fill="#2e2148"/>
${[20, 60, 100, 140, 180, 220, 260].map((x) => `<path d="M${x} 6 v170" stroke="#36274f" stroke-width="10"/>`).join('')}
<rect x="18" y="18" width="94" height="84" rx="4" fill="#6b4a32"/>
<rect x="24" y="24" width="82" height="72" fill="#1d2350"/>
${sterne}
${anders ? '' : '<circle cx="84" cy="44" r="10" fill="#fff3d0"/><circle cx="88" cy="41" r="9" fill="#1d2350"/>'}
<path d="M65 24 v72 M24 60 h82" stroke="#6b4a32" stroke-width="4"/>
<path d="M24 96 q20 -8 41 0 q20 -8 41 0 v4 h-82z" fill="#f5f2fb"/>
<rect x="0" y="176" width="300" height="44" fill="#6b4a3a"/>
<path d="M0 176 h300" stroke="#4e3428" stroke-width="3"/>
<ellipse cx="190" cy="194" rx="96" ry="14" fill="#a3202f" opacity=".55"/>
<rect x="26" y="150" width="86" height="7" rx="2" fill="#8a5a3a"/><rect x="34" y="157" width="5" height="22" fill="#6b4a32"/><rect x="100" y="157" width="5" height="22" fill="#6b4a32"/>
<rect x="53" y="128" width="10" height="22" rx="2" fill="#fbf4e6"/>
${anders ? '' : '<path d="M58 113 c5 6 5 10 0 14 c-5 -4 -5 -8 0 -14z" fill="#ffcf6b"/><circle cx="58" cy="122" r="9" fill="#ffcf6b" opacity=".25"/>'}
<path d="M86 132 h22 v15 a6 6 0 0 1 -6 6 h-10 a6 6 0 0 1 -6 -6z" fill="${'#e2525f'}"/><path d="M108 136 a5 5 0 0 1 0 10" stroke="#e2525f" stroke-width="3" fill="none"/>
${anders ? '' : '<path d="M97 146 c-5 -3 -6 -7 -3 -8 c1.5 -.5 3 .5 3 2 c0 -1.5 1.5 -2.5 3 -2 c3 1 2 5 -3 8z" fill="#fff"/>'}
<path d="M90 128 c-3 -4 3 -6 0 -10 M100 128 c-3 -4 3 -6 0 -10" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5"/>
<rect x="194" y="160" width="12" height="18" fill="#5b3a26"/>
<path d="M200 40 L232 92 H218 L244 136 H226 L254 168 H146 L174 136 H156 L182 92 H168 Z" fill="#2f7a58"/>
<path d="M200 40 L232 92 H218 L244 136 H226 L254 168 H200 Z" fill="#245a3e"/>
<path d="M172 100 q28 14 56 -2 M160 142 q40 18 84 -2" stroke="#f6dc96" stroke-width="1.5" fill="none" stroke-dasharray="1 4" stroke-linecap="round"/>
${kugeln}
${anders ? '<circle cx="222" cy="118" r="5" fill="#e0b85c"/>' : ''}
<path d="M200 18 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1z" fill="${anders ? '#e2525f' : '#f6dc96'}"/>
<rect x="150" y="160" width="32" height="24" rx="2" fill="#c22f40"/><path d="M166 160 v24 M150 171 h32" stroke="#f6dc96" stroke-width="4"/>
${anders ? '' : '<path d="M166 160 c-6 -10 -14 -6 -9 -1 z M166 160 c6 -10 14 -6 9 -1 z" fill="#f6dc96"/>'}
<rect x="232" y="164" width="30" height="20" rx="2" fill="#9b82d6"/><path d="M247 164 v20" stroke="#fff" stroke-width="3"/>
<rect x="204" y="170" width="20" height="14" rx="2" fill="#2f7a58"/><path d="M214 170 v14" stroke="#c22f40" stroke-width="3"/>
</svg>`;
  };
})();

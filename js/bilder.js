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

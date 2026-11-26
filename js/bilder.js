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

  /* ---------- Schiebepuzzle Bild: Lebkuchenhaus ---------- */
  B.lebkuchenhaus = function () {
    const sterne = [[30, 30], [70, 18], [118, 40], [210, 22], [282, 70], [20, 110], [268, 118], [180, 48]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" opacity=".85"/>`).join('');
    const tropfen = [];
    for (let x = 66; x <= 236; x += 17) tropfen.push(`<circle cx="${x}" cy="152" r="6" fill="#fffaf2"/>`);
    const bonbons = [[110, 112, '#e0473f'], [150, 92, '#3f9a5e'], [190, 112, '#f2c94c'], [130, 128, '#3f7fc4'], [172, 130, '#e0473f'], [150, 118, '#f2c94c']]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/><circle cx="${x - 2}" cy="${y - 2}" r="1.8" fill="#fff" opacity=".6"/>`).join('');
    const zacken = [];
    for (let x = 70; x < 230; x += 10) zacken.push(`${x},236 ${x + 5},244`);
    const gummi = [[80, 252, '#e0473f'], [100, 254, '#f2c94c'], [200, 254, '#3f9a5e'], [220, 252, '#e0473f']]
      .map(([x, y, c]) => `<path d="M${x - 8} ${y} a8 8 0 0 1 16 0z" fill="${c}"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
<defs><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10283f"/><stop offset="1" stop-color="#2d5878"/></linearGradient>
<radialGradient id="f" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#fff2bf"/><stop offset="1" stop-color="#f0a43a"/></radialGradient></defs>
<rect width="300" height="300" fill="url(#h)"/>${sterne}
<circle cx="250" cy="44" r="18" fill="#f6ecc9"/><circle cx="258" cy="38" r="16" fill="#1a3a56"/>
<path d="M0 248 Q70 232 150 244 T300 238 V300 H0Z" fill="#f4f1ea"/>
<rect x="186" y="78" width="24" height="46" fill="#94552a"/><rect x="182" y="72" width="32" height="10" rx="4" fill="#fffaf2"/>
<rect x="70" y="142" width="160" height="104" rx="3" fill="#b8733c"/>
<rect x="70" y="142" width="160" height="104" rx="3" fill="none" stroke="#8d5226" stroke-width="2"/>
<path d="M52 152 L150 62 L248 152 Z" fill="#7a421f"/>
<path d="M52 152 L150 62 L248 152" fill="none" stroke="#fffaf2" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
${tropfen.join('')}${bonbons}
<circle cx="150" cy="62" r="7" fill="#e0473f"/>
<rect x="86" y="166" width="36" height="32" rx="3" fill="url(#f)" stroke="#fffaf2" stroke-width="4"/>
<path d="M104 166v32M86 182h36" stroke="#fffaf2" stroke-width="3"/>
<rect x="178" y="166" width="36" height="32" rx="3" fill="url(#f)" stroke="#fffaf2" stroke-width="4"/>
<path d="M196 166v32M178 182h36" stroke="#fffaf2" stroke-width="3"/>
<path d="M132 246 V206 a18 18 0 0 1 36 0 V246z" fill="#5e2f14" stroke="#fffaf2" stroke-width="4"/>
<circle cx="160" cy="228" r="2.6" fill="#f2c94c"/>
<path d="M139 204 c3-7 11-7 11 0 c0-7 8-7 11 0 c0 6-11 11-11 11 s-11-5-11-11z" fill="#e0473f"/>
<polyline points="${zacken.join(' ')}" fill="none" stroke="#fffaf2" stroke-width="3" stroke-linejoin="round"/>
<path d="M120 246 V214 a6 6 0 0 0 -12 0" fill="none" stroke="#fffaf2" stroke-width="5" stroke-linecap="round"/>
<path d="M120 246 V214 a6 6 0 0 0 -12 0" fill="none" stroke="#e0473f" stroke-width="5" stroke-dasharray="4 4" stroke-linecap="round"/>
<path d="M180 246 V214 a6 6 0 0 1 12 0" fill="none" stroke="#fffaf2" stroke-width="5" stroke-linecap="round"/>
<path d="M180 246 V214 a6 6 0 0 1 12 0" fill="none" stroke="#e0473f" stroke-width="5" stroke-dasharray="4 4" stroke-linecap="round"/>
${gummi}
<g fill="#fff" opacity=".9"><circle cx="40" cy="160" r="2"/><circle cx="262" cy="190" r="2.4"/><circle cx="30" cy="214" r="1.8"/><circle cx="276" cy="150" r="1.6"/><circle cx="54" cy="128" r="1.6"/></g>
</svg>`;
  };

  /* ---------- Schiebepuzzle Bild: Therme & Sauna ---------- */
  B.therme = function () {
    const bretter = [];
    for (let y = 0; y < 170; y += 17) bretter.push(`<path d="M0 ${y}H300" stroke="#a56a34" stroke-width="2"/>`);
    const wellen = [];
    for (let y = 205; y < 300; y += 22) {
      let d = `M0 ${y}`;
      for (let x = 0; x < 300; x += 30) d += ` q7.5 -6 15 0 t15 0`;
      wellen.push(`<path d="${d}" stroke="#d9f5f4" stroke-width="2.4" fill="none" opacity=".75"/>`);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
<defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d79a5c"/><stop offset="1" stop-color="#b97a3f"/></linearGradient>
<linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fb8b4"/><stop offset="1" stop-color="#1d6f86"/></linearGradient></defs>
<rect width="300" height="180" fill="url(#w)"/>${bretter.join('')}
<circle cx="62" cy="64" r="30" fill="#fbf4e6" stroke="#6b4126" stroke-width="6"/>
<path d="M62 64 L80 50" stroke="#c22f40" stroke-width="4" stroke-linecap="round"/><circle cx="62" cy="64" r="4" fill="#6b4126"/>
<g stroke="#6b4126" stroke-width="2"><path d="M62 38v5M88 64h-5M36 64h5M80 46l-3 3M44 46l3 3"/></g>
<rect x="150" y="132" width="150" height="16" fill="#8d5226"/><rect x="150" y="148" width="150" height="6" fill="#6b4126"/>
<path d="M196 92 h52 l-6 40 h-40z" fill="#a8652e" stroke="#6b4126" stroke-width="3"/>
<path d="M200 104h44M198 118h48" stroke="#d8b25a" stroke-width="4"/>
<path d="M244 98 L276 70" stroke="#6b4126" stroke-width="5" stroke-linecap="round"/><ellipse cx="279" cy="66" rx="9" ry="6" fill="#8d5226" transform="rotate(-40 279 66)"/>
<rect x="0" y="176" width="300" height="12" fill="#e8e1d3"/>
<rect x="0" y="188" width="300" height="112" fill="url(#p)"/>${wellen.join('')}
<g transform="translate(22 150)"><rect width="74" height="28" rx="14" fill="#fbf4e6"/><path d="M14 0v28M30 0v28M46 0v28M62 0v28" stroke="#c22f40" stroke-width="6"/><circle cx="74" cy="14" r="14" fill="#fbf4e6"/><circle cx="74" cy="14" r="7" fill="none" stroke="#c22f40" stroke-width="3"/></g>
<g transform="translate(206 222)"><ellipse cx="0" cy="12" rx="24" ry="13" fill="#f6c844"/><circle cx="14" cy="-6" r="12" fill="#f6c844"/><path d="M24 -6 l11 3 -11 4z" fill="#f08a2c"/><circle cx="17" cy="-9" r="2.2" fill="#2a2438"/><path d="M-20 6 q-8 -6 -2 -12" stroke="#f6c844" stroke-width="7" fill="none" stroke-linecap="round"/></g>
<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55">
<path d="M110 196 c-10-14 10-22 0-36 s10-22 0-36"/><path d="M150 196 c-10-14 10-22 0-36"/><path d="M128 120 c-8-10 8-16 0-26"/></g>
<g fill="#fff" opacity=".85"><circle cx="60" cy="236" r="4"/><circle cx="76" cy="256" r="2.6"/><circle cx="258" cy="268" r="3.4"/><circle cx="150" cy="280" r="2.4"/></g>
</svg>`;
  };

  window.Bilder = B;
})();

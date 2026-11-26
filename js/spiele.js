/* Alle Spiele und Rätsel. Jedes Spiel bekommt einen Platz auf der Seite,
   seine Einstellungen und eine kleine Verbindung (api) zur Türchen-Ansicht:
   api.fail()   -> ein Fehlversuch
   api.solved() -> geschafft
   api.say()    -> kurze Rückmeldung anzeigen */
(function () {
  /* ---------- Helfer ---------- */
  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      e.append(kid.nodeType ? kid : document.createTextNode(kid));
    }
    return e;
  }

  function shake(el) {
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function shuffle(arr, rnd = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function shuffleNotSame(arr) {
    if (arr.length < 2) return arr.slice();
    let s;
    let tries = 0;
    do {
      s = shuffle(arr);
      tries++;
    } while (s.join('|') === arr.join('|') && tries < 30);
    return s;
  }

  function seeded(seed) {
    let s = seed >>> 0 || 1;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  /* ---------- Tolerante Antwortprüfung ---------- */
  function norm(s) {
    let x = (s || '').toString().toLowerCase().trim();
    x = x.replace(/^(ein|eine|einen|einem|der|die|das|den|dem|zum|zur)\s+/, '');
    return x
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }
  // Umlaute auch ohne "e" erkennen (haekeln = hakeln)
  const ohneE = (s) => s.replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }

  function matches(input, answers) {
    const x = norm(input);
    if (!x) return false;
    return answers.some((a) => {
      const y = norm(a);
      if (!y) return false;
      if (x === y || ohneE(x) === ohneE(y)) return true;
      const tol = y.length >= 9 ? 2 : y.length >= 5 ? 1 : 0;
      if (lev(x, y) <= tol || lev(ohneE(x), ohneE(y)) <= tol) return true;
      if (y.length >= 3 && x.length <= y.length + 14 && x.includes(y)) return true;
      return false;
    });
  }

  const FALSCH = [
    'Knapp daneben, versuch es nochmal 😘',
    'Hmm, nicht ganz, Zucker.',
    'Fast! Oder auch nicht so ganz 🙈',
    'Nope. Aber du bist trotzdem süß.',
    'Leider nicht. Denk nochmal kurz nach 💭',
    'Nicht ganz. Du schaffst das!',
  ];
  const RICHTIG = ['Richtig! 🎉', 'Genau! ✨', 'Jawoll! 💚', 'Sehr gut, Herz!', 'Volltreffer! 🎯'];

  function answerBox({ placeholder = 'Deine Antwort', button = 'Prüfen', onSubmit }) {
    const input = h('input', {
      class: 'answer-input', type: 'text', placeholder, autocomplete: 'off',
      autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'done',
      'aria-label': placeholder,
    });
    const btn = h('button', { class: 'btn btn-primary', type: 'submit' }, button);
    const form = h('form', { class: 'answer-box' }, input, btn);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input.value.trim()) return input.focus();
      const ok = onSubmit(input.value);
      if (!ok) {
        shake(form);
        input.select();
      } else {
        input.blur();
      }
    });
    return { el: form, input };
  }

  const S = {};

  /* ---------- Emojirätsel ---------- */
  S.emoji = function (root, cfg, api) {
    let i = 0;
    const wrap = h('div', { class: 'g-emoji' });
    root.append(wrap);
    function render() {
      wrap.innerHTML = '';
      const r = cfg.rounds[i];
      if (cfg.rounds.length > 1) wrap.append(h('div', { class: 'g-step' }, `Rätsel ${i + 1} von ${cfg.rounds.length}`));
      wrap.append(h('div', { class: 'emoji-big pop-in' }, r.emoji));
      if (r.prompt) wrap.append(h('p', { class: 'g-prompt' }, r.prompt));
      const box = answerBox({
        onSubmit: (v) => {
          if (matches(v, r.answers)) {
            box.el.remove();
            api.say(`${pick(RICHTIG)} ${r.show || ''}`, 'good');
            i++;
            setTimeout(() => (i < cfg.rounds.length ? render() : api.solved()), 900);
            return true;
          }
          api.fail();
          api.say(pick(FALSCH), 'bad');
          return false;
        },
      });
      wrap.append(box.el);
    }
    render();
    return {
      solveNow() {
        i = cfg.rounds.length;
        wrap.innerHTML = '';
        cfg.rounds.forEach((r) => wrap.append(h('div', { class: 'emoji-solved' }, h('span', {}, r.emoji), h('b', {}, r.show))));
      },
    };
  };

  /* ---------- Galgenmännchen (Kugeln fallen vom Baum) ---------- */
  S.hangman = function (root, cfg, api) {
    const word = cfg.word.toUpperCase();
    const MAX = 7;
    const isLetter = (c) => /[A-ZÄÖÜ]/.test(c);
    let guessed, wrong, done;
    const wrap = h('div', { class: 'g-hangman' });
    root.append(wrap);
    const tree = h('div', { class: 'hm-tree', html: Bilder.baum() });
    const slots = h('div', { class: 'hm-word' });
    const lives = h('div', { class: 'hm-lives' });
    const kb = h('div', { class: 'hm-kb' });
    const again = h('button', { class: 'btn btn-ghost', type: 'button', onclick: reset }, 'Nochmal versuchen');
    wrap.append(tree, cfg.category ? h('p', { class: 'g-prompt' }, cfg.category) : null, slots, lives, kb);
    'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split('').forEach((L) =>
      kb.append(h('button', { class: 'key', type: 'button', 'data-l': L, onclick: () => guess(L) }, L))
    );
    function draw() {
      slots.innerHTML = '';
      for (const ch of word) {
        if (ch === ' ') { slots.append(h('span', { class: 'hm-gap' })); continue; }
        const shown = guessed.has(ch) || !isLetter(ch);
        slots.append(h('span', { class: 'hm-slot' + (shown ? ' on' : '') }, shown ? ch : ''));
      }
      const left = MAX - wrong;
      lives.textContent = left === 1 ? 'Nur noch 1 Kugel hängt am Baum 😬' : `${left} Kugeln hängen noch am Baum`;
    }
    function guess(L) {
      if (done || guessed.has(L)) return;
      guessed.add(L);
      const k = kb.querySelector(`[data-l="${L}"]`);
      k.disabled = true;
      if (word.includes(L)) k.classList.add('hit');
      else {
        k.classList.add('miss');
        wrong++;
        const b = tree.querySelector(`.kugel[data-i="${wrong}"]`);
        if (b) b.classList.add('fall');
      }
      draw();
      if ([...word].every((c) => !isLetter(c) || guessed.has(c))) {
        done = true;
        slots.classList.add('right');
        api.solved();
      } else if (wrong >= MAX) {
        done = true;
        api.fail(3);
        api.say('Oh nein, alle Kugeln sind runtergefallen. Nochmal?', 'bad');
        wrap.append(again);
      }
    }
    function reset() {
      guessed = new Set();
      wrong = 0;
      done = false;
      kb.querySelectorAll('.key').forEach((k) => { k.disabled = false; k.className = 'key'; });
      tree.querySelectorAll('.kugel').forEach((b) => b.classList.remove('fall'));
      again.remove();
      api.say('', '');
      draw();
    }
    function onKey(e) {
      if (!document.body.contains(wrap)) return document.removeEventListener('keydown', onKey);
      if (e.target.tagName === 'INPUT') return;
      const L = e.key.toUpperCase();
      if (/^[A-ZÄÖÜ]$/.test(L)) guess(L);
    }
    document.addEventListener('keydown', onKey);
    reset();
    return {
      solveNow() {
        done = true;
        [...word].forEach((c) => guessed.add(c));
        draw();
        slots.classList.add('right');
        again.remove();
      },
    };
  };

  /* ---------- Buchstabensalat ---------- */
  S.scramble = function (root, cfg, api) {
    let i = 0;
    const wrap = h('div', { class: 'g-scramble' });
    root.append(wrap);
    function render() {
      wrap.innerHTML = '';
      const r = cfg.rounds[i];
      const word = r.word.toUpperCase();
      const letters = shuffleNotSame(word.split(''));
      const placed = new Array(word.length).fill(null);
      let locked = false;
      if (cfg.rounds.length > 1) wrap.append(h('div', { class: 'g-step' }, `Wort ${i + 1} von ${cfg.rounds.length}`));
      if (r.clue) wrap.append(h('p', { class: 'g-prompt' }, r.clue));
      const slotsEl = h('div', { class: 'sc-slots' });
      const tilesEl = h('div', { class: 'sc-tiles' });
      const slots = word.split('').map((_, si) => {
        const s = h('button', { class: 'slot', type: 'button', 'aria-label': `Feld ${si + 1}`, onclick: () => unplace(si) });
        slotsEl.append(s);
        return s;
      });
      const tiles = letters.map((L, ti) => {
        const b = h('button', { class: 'tile', type: 'button', onclick: () => place(ti) }, L);
        tilesEl.append(b);
        return b;
      });
      function place(ti) {
        if (locked || tiles[ti].classList.contains('used')) return;
        const si = placed.indexOf(null);
        if (si < 0) return;
        placed[si] = ti;
        tiles[ti].classList.add('used');
        slots[si].textContent = letters[ti];
        slots[si].classList.add('filled');
        check();
      }
      function unplace(si) {
        if (locked || placed[si] == null) return;
        tiles[placed[si]].classList.remove('used');
        placed[si] = null;
        slots[si].textContent = '';
        slots[si].classList.remove('filled');
      }
      function check() {
        if (placed.includes(null)) return;
        const guess = placed.map((t) => letters[t]).join('');
        if (guess === word) {
          locked = true;
          slotsEl.classList.add('right');
          api.say(`${pick(RICHTIG)} ${r.show || ''}`, 'good');
          i++;
          setTimeout(() => (i < cfg.rounds.length ? render() : api.solved()), 1000);
        } else {
          slotsEl.classList.add('wrong');
          shake(slotsEl);
          api.fail();
          api.say(pick(FALSCH) + ' Tippe auf ein Feld, um den Buchstaben zurückzulegen.', 'bad');
          setTimeout(() => slotsEl.classList.remove('wrong'), 700);
        }
      }
      wrap.append(
        slotsEl,
        tilesEl,
        h('button', { class: 'btn btn-ghost btn-small', type: 'button', onclick: () => slots.forEach((_, s) => unplace(s)) }, 'Alle zurücklegen')
      );
    }
    render();
    return {
      solveNow() {
        i = cfg.rounds.length;
        wrap.innerHTML = '';
        cfg.rounds.forEach((r) =>
          wrap.append(h('div', { class: 'sc-slots right' }, ...r.word.toUpperCase().split('').map((L) => h('span', { class: 'slot filled' }, L))))
        );
      },
    };
  };

  /* ---------- Wortraten (wie Wordle) ---------- */
  S.wordle = function (root, cfg, api) {
    const word = cfg.word.toUpperCase();
    const N = word.length;
    const R = cfg.rows || 6;
    let row, cur, done;
    const wrap = h('div', { class: 'g-wordle' });
    root.append(wrap);
    wrap.append(h('p', { class: 'g-prompt' }, `Errate das Wort mit ${N} Buchstaben.`));
    wrap.append(
      h('div', { class: 'wd-legend' },
        h('span', {}, h('i', { class: 'correct' }), 'richtig'),
        h('span', {}, h('i', { class: 'present' }), 'kommt vor, andere Stelle'),
        h('span', {}, h('i', { class: 'absent' }), 'kommt nicht vor'))
    );
    const grid = h('div', { class: 'wd-grid', style: `--n:${N}` });
    const cells = [];
    for (let r = 0; r < R; r++) {
      const rowEl = h('div', { class: 'wd-row' });
      cells[r] = [];
      for (let c = 0; c < N; c++) {
        const cell = h('div', { class: 'wd-cell' });
        rowEl.append(cell);
        cells[r].push(cell);
      }
      grid.append(rowEl);
    }
    const kb = h('div', { class: 'wd-kb' });
    const keys = {};
    ['QWERTZUIOP', 'ASDFGHJKL', '↵YXCVBNM⌫'].forEach((line) => {
      const l = h('div', { class: 'wd-kbrow' });
      for (const k of line) {
        const special = k === '↵' || k === '⌫';
        const b = h('button', { class: 'key' + (special ? ' wide' : ''), type: 'button', 'aria-label': k === '↵' ? 'Bestätigen' : k === '⌫' ? 'Löschen' : k, onclick: () => press(k) }, k === '↵' ? 'OK' : k);
        if (!special) keys[k] = b;
        l.append(b);
      }
      kb.append(l);
    });
    const again = h('button', { class: 'btn btn-ghost', type: 'button', onclick: reset }, 'Nochmal von vorn');
    wrap.append(grid, kb);

    function paint() {
      for (let c = 0; c < N; c++) {
        cells[row][c].textContent = cur[c] || '';
        cells[row][c].classList.toggle('typed', !!cur[c]);
      }
    }
    function press(k) {
      if (done) return;
      if (k === '⌫') { cur = cur.slice(0, -1); return paint(); }
      if (k === '↵') return submit();
      if (cur.length < N) { cur += k; paint(); }
    }
    function score(g) {
      const res = Array(N).fill('absent');
      const rest = {};
      for (let i = 0; i < N; i++) {
        if (g[i] === word[i]) res[i] = 'correct';
        else rest[word[i]] = (rest[word[i]] || 0) + 1;
      }
      for (let i = 0; i < N; i++) {
        if (res[i] !== 'correct' && rest[g[i]]) { res[i] = 'present'; rest[g[i]]--; }
      }
      return res;
    }
    function submit() {
      if (cur.length < N) {
        shake(grid.children[row]);
        api.say(`Das Wort hat ${N} Buchstaben.`, 'bad');
        return;
      }
      const g = cur;
      const res = score(g);
      const rank = { absent: 0, present: 1, correct: 2 };
      const r0 = row;
      res.forEach((s, i) => {
        setTimeout(() => cells[r0][i].classList.add('flip', s), i * 130);
        const key = keys[g[i]];
        if (key && (!key.dataset.s || rank[s] > rank[key.dataset.s])) key.dataset.s = s;
      });
      row++;
      cur = '';
      done = true; // kurz sperren, bis die Animation fertig ist
      setTimeout(() => {
        Object.values(keys).forEach((k) => { if (k.dataset.s) k.className = 'key ' + k.dataset.s; });
        if (g === word) {
          api.solved();
          return;
        }
        api.fail();
        if (row >= R) {
          api.say('Alle Reihen sind voll. Nochmal von vorn?', 'bad');
          wrap.append(again);
        } else {
          done = false;
          api.say('', '');
        }
      }, N * 130 + 350);
    }
    function reset() {
      row = 0; cur = ''; done = false;
      cells.flat().forEach((c) => { c.className = 'wd-cell'; c.textContent = ''; });
      Object.values(keys).forEach((k) => { k.className = 'key'; delete k.dataset.s; });
      again.remove();
      api.say('', '');
    }
    function onKey(e) {
      if (!document.body.contains(wrap)) return document.removeEventListener('keydown', onKey);
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'Enter') press('↵');
      else if (e.key === 'Backspace') press('⌫');
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
    }
    document.addEventListener('keydown', onKey);
    reset();
    return {
      solveNow() {
        done = true;
        again.remove();
        const r = Math.min(row, R - 1);
        cells[r].forEach((c, i) => { c.textContent = word[i]; c.className = 'wd-cell flip correct'; });
      },
    };
  };

  /* ---------- Schiebepuzzle ---------- */
  S.slide = function (root, cfg, api) {
    const n = cfg.size || 3;
    const E = n * n - 1;
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(Bilder[cfg.image]());
    let state = [...Array(n * n).keys()];
    let done = false;
    let moves = 0;
    const solvedNow = () => state.every((t, p) => t === p);
    // gültig mischen, indem wir zufällige Züge machen
    (function mix() {
      let last = -1;
      for (let k = 0; k < 160 || solvedNow(); k++) {
        const e = state.indexOf(E);
        const opts = nbrs(e).filter((p) => p !== last);
        const p = pick(opts);
        [state[p], state[e]] = [state[e], state[p]];
        last = e;
      }
    })();
    function nbrs(p) {
      const r = Math.floor(p / n), c = p % n, out = [];
      if (r > 0) out.push(p - n);
      if (r < n - 1) out.push(p + n);
      if (c > 0) out.push(p - 1);
      if (c < n - 1) out.push(p + 1);
      return out;
    }
    const wrap = h('div', { class: 'g-slide' });
    root.append(wrap);
    wrap.append(h('p', { class: 'g-prompt' }, 'Tippe auf ein Teil neben der Lücke, um es zu verschieben.'));
    const board = h('div', { class: 'sl-board', style: `--n:${n}` });
    const full = h('div', { class: 'sl-full', style: `background-image:url("${url}")` });
    const tiles = [];
    for (let t = 0; t < E; t++) {
      const r = Math.floor(t / n), c = t % n;
      const el = h('button', {
        class: 'sl-tile', type: 'button', 'aria-label': `Teil ${t + 1}`,
        style: `background-image:url("${url}");background-position:${(c / (n - 1)) * 100}% ${(r / (n - 1)) * 100}%`,
        onclick: () => move(t),
      });
      tiles.push(el);
      board.append(el);
    }
    board.append(full);
    const counter = h('div', { class: 'sl-count' }, 'Züge: 0');
    wrap.append(board, counter);
    function layout() {
      state.forEach((t, pos) => {
        if (t === E) return;
        tiles[t].style.transform = `translate(${(pos % n) * 100}%, ${Math.floor(pos / n) * 100}%)`;
      });
    }
    function move(t) {
      if (done) return;
      const p = state.indexOf(t), e = state.indexOf(E);
      if (!nbrs(e).includes(p)) { shake(tiles[t]); return; }
      [state[p], state[e]] = [state[e], state[p]];
      moves++;
      counter.textContent = `Züge: ${moves}`;
      if (moves % 60 === 0) api.fail(); // nach vielen Zügen darf man irgendwann auflösen
      layout();
      if (solvedNow()) finish(true);
    }
    function finish(real) {
      done = true;
      board.classList.add('done');
      if (real) setTimeout(() => api.solved(), 700);
    }
    layout();
    return {
      solveNow() {
        state = [...Array(n * n).keys()];
        layout();
        finish(false);
      },
    };
  };

  /* ---------- Quiz ---------- */
  S.quiz = function (root, cfg, api) {
    let i = 0;
    const wrap = h('div', { class: 'g-quiz' });
    root.append(wrap);
    function render() {
      let lock = false;
      const q = cfg.questions[i];
      wrap.innerHTML = '';
      wrap.append(h('div', { class: 'g-step' }, `Frage ${i + 1} von ${cfg.questions.length}`));
      wrap.append(h('p', { class: 'qz-q pop-in' }, q.q));
      const opts = h('div', { class: 'qz-opts' });
      q.options.forEach((o, oi) => {
        const b = h('button', { class: 'qz-opt', type: 'button' }, o);
        b.onclick = () => {
          if (lock) return;
          const ok = q.correct === 'all' || oi === q.correct;
          if (ok) {
            lock = true;
            if (q.correct === 'all') opts.querySelectorAll('.qz-opt').forEach((x) => x.classList.add('right'));
            else b.classList.add('right');
            api.say(q.yay || pick(RICHTIG), 'good');
            setTimeout(() => {
              i++;
              api.say('', '');
              if (i < cfg.questions.length) render();
              else api.solved();
            }, 1300);
          } else {
            b.classList.add('wrong');
            b.disabled = true;
            shake(b);
            api.fail();
            api.say(q.nay || pick(FALSCH), 'bad');
          }
        };
        opts.append(b);
      });
      wrap.append(opts);
    }
    render();
    return {
      solveNow() {
        i = cfg.questions.length;
        wrap.innerHTML = '';
        const ul = h('ul', { class: 'qz-summary' });
        cfg.questions.forEach((q) =>
          ul.append(h('li', {}, h('span', {}, q.q), h('b', {}, q.correct === 'all' ? 'Alles richtig 😄' : q.options[q.correct])))
        );
        wrap.append(ul);
      },
    };
  };

  /* ---------- Memory ---------- */
  S.memory = function (root, cfg, api) {
    const pairs = cfg.pairs.map((p) => p.split('|'));
    const deck = shuffle([...pairs.keys(), ...pairs.keys()]);
    let open = [], matched = 0, busy = false, moves = 0;
    const wrap = h('div', { class: 'g-memory' });
    root.append(wrap);
    wrap.append(h('p', { class: 'g-prompt' }, 'Finde alle Pärchen. Tippe immer zwei Karten an.'));
    const grid = h('div', { class: 'mm-grid' });
    const counter = h('div', { class: 'sl-count' }, 'Züge: 0');
    const cards = deck.map((pi) => {
      const [emo, label] = pairs[pi];
      const c = h('button', { class: 'mm-card', type: 'button', 'aria-label': 'Karte' },
        h('span', { class: 'mm-inner' },
          h('span', { class: 'mm-back', html: Bilder.motive[0] }),
          h('span', { class: 'mm-front' }, h('span', { class: 'mm-emo' }, emo), label ? h('small', {}, label) : null)));
      c.dataset.p = pi;
      c.onclick = () => flip(c);
      grid.append(c);
      return c;
    });
    wrap.append(grid, counter);
    function flip(c) {
      if (busy || c.classList.contains('up') || c.classList.contains('match')) return;
      c.classList.add('up');
      open.push(c);
      if (open.length < 2) return;
      moves++;
      counter.textContent = `Züge: ${moves}`;
      const [a, b] = open;
      if (a.dataset.p === b.dataset.p) {
        a.classList.add('match');
        b.classList.add('match');
        open = [];
        matched++;
        if (matched === pairs.length) setTimeout(() => api.solved(), 700);
      } else {
        busy = true;
        setTimeout(() => {
          a.classList.remove('up');
          b.classList.remove('up');
          open = [];
          busy = false;
        }, 900);
      }
    }
    return {
      solveNow() {
        busy = true;
        cards.forEach((c) => c.classList.add('up', 'match'));
      },
    };
  };

  /* ---------- Herzschloss (Zahlencode) ---------- */
  S.lock = function (root, cfg, api) {
    const code = cfg.code;
    const vals = Array(code.length).fill(0);
    let done = false;
    const wrap = h('div', { class: 'g-lock' });
    root.append(wrap);
    const pic = h('div', { class: 'lk-pic', html: Bilder.schloss() });
    if (cfg.prompt) wrap.append(h('p', { class: 'g-prompt' }, cfg.prompt));
    const wheels = h('div', { class: 'lk-wheels' });
    const digits = vals.map((_, i) => {
      const d = h('span', { class: 'lk-digit' }, '0');
      const w = h('div', { class: 'lk-wheel' },
        h('button', { class: 'lk-btn', type: 'button', 'aria-label': 'höher', onclick: () => turn(i, 1) }, '▲'),
        d,
        h('button', { class: 'lk-btn', type: 'button', 'aria-label': 'niedriger', onclick: () => turn(i, -1) }, '▼'));
      wheels.append(w);
      if (cfg.trenner && cfg.trenner.includes(i + 1) && i < code.length - 1) wheels.append(h('span', { class: 'lk-sep' }, '.'));
      return d;
    });
    function turn(i, dir) {
      if (done) return;
      vals[i] = (vals[i] + dir + 10) % 10;
      digits[i].textContent = vals[i];
      digits[i].classList.remove('tick');
      void digits[i].offsetWidth;
      digits[i].classList.add('tick');
    }
    const btn = h('button', { class: 'btn btn-primary', type: 'button', onclick: tryOpen }, 'Aufschließen 🔑');
    wrap.append(pic, wheels, btn);
    function tryOpen() {
      if (done) return;
      if (vals.join('') === code) {
        done = true;
        pic.classList.add('open');
        btn.remove();
        api.say('Klick! Das Schloss ist offen 💛', 'good');
        setTimeout(() => api.solved(), 1100);
      } else {
        shake(pic);
        api.fail();
        api.say(pick(['Das Schloss bleibt zu. Versuch es nochmal.', 'Hmm, falsche Zahl, Herz.', 'Noch nicht. Denk an etwas ganz Besonderes.']), 'bad');
      }
    }
    return {
      solveNow() {
        done = true;
        code.split('').forEach((c, i) => { vals[i] = +c; digits[i].textContent = c; });
        pic.classList.add('open');
        btn.remove();
      },
    };
  };

  /* ---------- Wörter suchen ---------- */
  S.wordsearch = function (root, cfg, api) {
    const n = cfg.size || 9;
    const words = cfg.words.map((w) => w.toUpperCase());
    const ALPH = 'AABCDDEEEEFGHIIKLLMNNNOPRRSSTTUUWZ';
    let grid, places;
    for (let seed = cfg.seed || 7, ok = false; !ok; seed++) {
      const rnd = seeded(seed);
      grid = Array(n * n).fill(null);
      places = [];
      ok = true;
      const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
      for (const w of [...words].sort((a, b) => b.length - a.length)) {
        let placed = false;
        for (let t = 0; t < 400 && !placed; t++) {
          const [dx, dy] = dirs[Math.floor(rnd() * dirs.length)];
          const x0 = Math.floor(rnd() * n), y0 = Math.floor(rnd() * n);
          const cells = [];
          let fits = true;
          for (let k = 0; k < w.length; k++) {
            const x = x0 + dx * k, y = y0 + dy * k;
            if (x < 0 || y < 0 || x >= n || y >= n) { fits = false; break; }
            const idx = y * n + x;
            if (grid[idx] && grid[idx] !== w[k]) { fits = false; break; }
            cells.push(idx);
          }
          if (!fits) continue;
          cells.forEach((idx, k) => (grid[idx] = w[k]));
          places.push({ w, cells });
          placed = true;
        }
        if (!placed) { ok = false; break; }
      }
      if (ok) for (let i = 0; i < grid.length; i++) if (!grid[i]) grid[i] = ALPH[Math.floor(rnd() * ALPH.length)];
    }

    const found = new Set();
    const wrap = h('div', { class: 'g-ws' });
    root.append(wrap);
    wrap.append(h('p', { class: 'g-prompt' }, 'Wische über ein Wort oder tippe den ersten und dann den letzten Buchstaben an.'));
    const list = h('div', { class: 'ws-words' });
    const chips = {};
    words.forEach((w) => { chips[w] = h('span', { class: 'ws-chip' }, w); list.append(chips[w]); });
    const g = h('div', { class: 'ws-grid', style: `--n:${n}` });
    const cellEls = grid.map((L, i) => {
      const c = h('span', { class: 'ws-cell', 'data-i': i }, L);
      g.append(c);
      return c;
    });
    wrap.append(list, g);

    let start = null, hover = null, dragging = false, moved = false;
    const xy = (i) => [i % n, Math.floor(i / n)];
    function line(a, b) {
      const [ax, ay] = xy(a), [bx, by] = xy(b);
      const dx = bx - ax, dy = by - ay;
      if (!(dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) return null;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const sx = Math.sign(dx), sy = Math.sign(dy);
      const out = [];
      for (let k = 0; k <= steps; k++) out.push((ay + sy * k) * n + (ax + sx * k));
      return out;
    }
    function preview(a, b) {
      cellEls.forEach((c) => c.classList.remove('sel'));
      const l = b == null ? [a] : line(a, b) || [a];
      l.forEach((i) => cellEls[i].classList.add('sel'));
    }
    function clearSel() { cellEls.forEach((c) => c.classList.remove('sel')); }
    const cellAt = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const c = el && el.closest && el.closest('.ws-cell');
      return c && g.contains(c) ? +c.dataset.i : null;
    };
    function evaluate(a, b) {
      const l = line(a, b);
      clearSel();
      if (!l) return;
      const s = l.map((i) => grid[i]).join('');
      const r = [...s].reverse().join('');
      const hit = places.find((p) => !found.has(p.w) && (p.w === s || p.w === r));
      if (hit) mark(hit, true);
      else if (l.length > 1) {
        l.forEach((i) => cellEls[i].classList.add('nope'));
        setTimeout(() => l.forEach((i) => cellEls[i].classList.remove('nope')), 450);
      }
    }
    function mark(p, check) {
      found.add(p.w);
      const hue = found.size % 5;
      p.cells.forEach((i) => cellEls[i].classList.add('found', 'f' + hue));
      chips[p.w].classList.add('done');
      if (check) {
        api.say(`${pick(RICHTIG)} ${p.w} gefunden.`, 'good');
        if (found.size === words.length) setTimeout(() => api.solved(), 600);
      }
    }
    g.addEventListener('pointerdown', (e) => {
      const i = cellAt(e);
      if (i == null) return;
      e.preventDefault();
      if (start != null && !dragging && i !== start) { evaluate(start, i); start = null; return; }
      start = i; hover = i; dragging = true; moved = false;
      preview(start);
    });
    g.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const i = cellAt(e);
      if (i == null || i === hover) return;
      hover = i; moved = true;
      preview(start, i);
    });
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (moved && hover !== start) { evaluate(start, hover); start = null; }
      // sonst: Tipp-Modus, erster Buchstabe bleibt markiert
    };
    g.addEventListener('pointerup', up);
    g.addEventListener('pointercancel', up);
    g.addEventListener('pointerleave', up);
    return {
      solveNow() {
        places.forEach((p) => { if (!found.has(p.w)) mark(p, false); });
      },
    };
  };

  /* ---------- Kreuzworträtsel mit Lösungswort ---------- */
  S.crossword = function (root, cfg, api) {
    const rows = cfg.rows.map((r) => ({ ...r, word: r.word.toUpperCase(), ok: false }));
    const L = Math.max(...rows.map((r) => r.idx));
    const Rr = Math.max(...rows.map((r) => r.word.length - 1 - r.idx));
    const W = L + Rr + 1;
    let active = 0;
    const wrap = h('div', { class: 'g-cw' });
    root.append(wrap);
    wrap.append(h('p', { class: 'g-prompt' }, 'Tippe eine Reihe an und trag das Wort unten ein. Die goldenen Kästchen ergeben das Lösungswort.'));
    const gridEl = h('div', { class: 'cw-grid', style: `--w:${W}` });
    const rowEls = rows.map((r, ri) => {
      const el = h('button', { class: 'cw-row', type: 'button', onclick: () => select(ri) });
      el.append(h('span', { class: 'cw-num' }, ri + 1));
      for (let k = 0; k < L - r.idx; k++) el.append(h('span', { class: 'cw-cell empty' }));
      r.cells = r.word.split('').map((_, k) => {
        const c = h('span', { class: 'cw-cell' + (k === r.idx ? ' gold' : '') });
        el.append(c);
        return c;
      });
      gridEl.append(el);
      return el;
    });
    const clue = h('p', { class: 'cw-clue' });
    const box = answerBox({
      placeholder: 'Wort eintragen',
      button: 'Eintragen',
      onSubmit: (v) => {
        const r = rows[active];
        const x = norm(v).toUpperCase();
        if (x === r.word || ohneE(x) === ohneE(r.word)) {
          fill(active, true);
          api.say(pick(RICHTIG), 'good');
          box.input.value = '';
          const next = rows.findIndex((q) => !q.ok);
          if (next < 0) { box.el.remove(); clue.remove(); gridEl.classList.add('solved'); setTimeout(() => api.solved(), 700); }
          else select(next);
          return true;
        }
        shake(rowEls[active]);
        api.fail();
        api.say(pick(FALSCH), 'bad');
        return false;
      },
    });
    box.input.addEventListener('input', () => {
      const r = rows[active];
      if (r.ok) return;
      const x = box.input.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, '');
      r.cells.forEach((c, k) => (c.textContent = x[k] || ''));
    });
    const list = h('ol', { class: 'cw-list' });
    rows.forEach((r, ri) => list.append(h('li', { onclick: () => select(ri) }, r.clue, h('small', {}, ` (${r.word.length})`))));
    wrap.append(gridEl, clue, box.el, list);
    function fill(ri, ok) {
      const r = rows[ri];
      r.ok = ok;
      r.cells.forEach((c, k) => (c.textContent = r.word[k]));
      rowEls[ri].classList.add('ok');
      list.children[ri].classList.add('ok');
    }
    function select(ri) {
      if (rows[ri].ok) return;
      rows.forEach((r, k) => { if (!r.ok) r.cells.forEach((c) => (c.textContent = '')); rowEls[k].classList.toggle('active', k === ri); });
      active = ri;
      clue.innerHTML = '';
      clue.append(h('b', {}, `${ri + 1}. `), rows[ri].clue, h('small', {}, ` (${rows[ri].word.length} Buchstaben)`));
      box.input.value = '';
      box.input.maxLength = rows[ri].word.length + 4;
    }
    select(0);
    return {
      solveNow() {
        rows.forEach((_, ri) => fill(ri, true));
        rowEls.forEach((e) => e.classList.remove('active'));
        box.el.remove(); clue.remove(); gridEl.classList.add('solved');
      },
    };
  };

  /* ---------- Wer bin ich? ---------- */
  S.whoami = function (root, cfg, api) {
    let shown = 1;
    let done = false;
    const wrap = h('div', { class: 'g-who' });
    root.append(wrap);
    const ol = h('ol', { class: 'who-list' });
    const more = h('button', { class: 'btn btn-ghost btn-small', type: 'button', onclick: () => reveal() }, 'Noch ein Hinweis');
    function draw() {
      ol.innerHTML = '';
      cfg.clues.slice(0, shown).forEach((c, i) => ol.append(h('li', { class: i === shown - 1 ? 'pop-in' : '' }, c)));
      if (shown >= cfg.clues.length) more.remove();
    }
    function reveal() { if (shown < cfg.clues.length) { shown++; draw(); } }
    const box = answerBox({
      placeholder: 'Was bin ich?',
      onSubmit: (v) => {
        if (done) return true;
        if (matches(v, cfg.answers)) {
          done = true;
          box.el.remove();
          more.remove();
          api.say(shown === 1 ? 'Nach nur einem Hinweis! Wow 🤩' : `Erraten nach ${shown} Hinweisen ✨`, 'good');
          setTimeout(() => api.solved(), 900);
          return true;
        }
        api.fail();
        api.say(pick(FALSCH) + (shown < cfg.clues.length ? ' Hier kommt noch ein Hinweis.' : ''), 'bad');
        reveal();
        return false;
      },
    });
    wrap.append(h('p', { class: 'g-prompt' }, 'Je weniger Hinweise du brauchst, desto besser 😉'), ol, more, box.el);
    draw();
    return {
      solveNow() { done = true; shown = cfg.clues.length; draw(); box.el.remove(); more.remove(); },
    };
  };

  /* ---------- Reihenfolge (Rezept sortieren) ---------- */
  S.order = function (root, cfg, api) {
    const steps = cfg.steps;
    let next = 0;
    const wrap = h('div', { class: 'g-order' });
    root.append(wrap);
    if (cfg.prompt) wrap.append(h('p', { class: 'g-prompt' }, cfg.prompt));
    const done = h('ol', { class: 'od-done' });
    const pool = h('div', { class: 'od-pool' });
    const acro = h('div', { class: 'od-acro' });
    const btns = shuffleNotSame([...steps.keys()]).map((i) => {
      const b = h('button', { class: 'od-step', type: 'button', onclick: () => tap(i, b) }, steps[i]);
      pool.append(b);
      return b;
    });
    wrap.append(done, pool, acro);
    function addDone(i) {
      done.append(h('li', { class: 'pop-in' }, h('b', { class: 'od-first' }, steps[i][0]), steps[i].slice(1)));
    }
    function tap(i, b) {
      if (i === next) {
        b.remove();
        addDone(i);
        next++;
        if (next === steps.length) finish(true);
      } else {
        shake(b);
        api.fail();
        api.say(pick(['Hmm, das kommt erst später dran.', 'Nicht so schnell, Bäckermeister 🧑‍🍳', 'Ups, falsche Reihenfolge.']), 'bad');
      }
    }
    function finish(real) {
      const word = steps.map((s) => s[0]).join('');
      done.classList.add('complete');
      acro.innerHTML = '';
      acro.append('Die Anfangsbuchstaben verraten: ', h('b', {}, word));
      if (real) { api.say('Perfekt sortiert! 🍪', 'good'); setTimeout(() => api.solved(), 1300); }
    }
    return {
      solveNow() {
        btns.forEach((b) => b.remove());
        for (; next < steps.length; next++) addDone(next);
        finish(false);
      },
    };
  };

  /* ---------- Geheimschrift (Verschiebung im Alphabet) ---------- */
  S.cipher = function (root, cfg, api) {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shiftText = (t, k) => t.replace(/[A-Z]/g, (c) => A[(A.indexOf(c) + k + 26 * 10) % 26]);
    const enc = shiftText(cfg.text.toUpperCase(), cfg.shift);
    let dial = 0;
    let done = false;
    const wrap = h('div', { class: 'g-cipher' });
    root.append(wrap);
    wrap.append(h('p', { class: 'g-prompt' }, 'Dreh am Schlüssel, bis die Nachricht Sinn ergibt.'));
    const msg = h('div', { class: 'ci-msg' });
    const num = h('span', { class: 'ci-num' }, '0');
    const strip = h('div', { class: 'ci-strip' });
    const dialEl = h('div', { class: 'ci-dial' },
      h('button', { class: 'lk-btn', type: 'button', 'aria-label': 'zurück', onclick: () => turn(-1) }, '◀'),
      h('div', { class: 'ci-key' }, h('small', {}, 'Schlüssel'), num),
      h('button', { class: 'lk-btn', type: 'button', 'aria-label': 'weiter', onclick: () => turn(1) }, '▶'));
    function draw() {
      const plain = shiftText(enc, -dial);
      msg.innerHTML = '';
      plain.split(' ').forEach((w) => msg.append(h('span', { class: 'ci-word' }, w)));
      num.textContent = dial;
      strip.innerHTML = '';
      const top = h('div', {}), bot = h('div', {});
      for (const c of 'ABCDEFGHIJKLM') { top.append(h('span', {}, shiftText(c, dial))); bot.append(h('span', {}, c)); }
      strip.append(h('small', {}, 'Geheim'), top, h('small', {}, 'wird zu'), bot);
      msg.classList.toggle('clear', dial === cfg.shift);
    }
    function turn(d) {
      if (done) return;
      dial = (dial + d + 26) % 26;
      draw();
    }
    const box = answerBox({
      onSubmit: (v) => {
        if (matches(v, cfg.answers)) {
          done = true;
          dial = cfg.shift;
          draw();
          box.el.remove();
          api.say(pick(RICHTIG), 'good');
          setTimeout(() => api.solved(), 900);
          return true;
        }
        api.fail();
        api.say(pick(FALSCH), 'bad');
        return false;
      },
    });
    wrap.append(msg, dialEl, strip, h('p', { class: 'g-prompt small' }, cfg.prompt), box.el);
    draw();
    return {
      solveNow() { done = true; dial = cfg.shift; draw(); box.el.remove(); },
    };
  };

  /* ---------- Schatzsuche aus mehreren Stationen ---------- */
  S.multi = function (root, cfg, api) {
    let s = 0;
    let current = null;
    const got = [];
    const wrap = h('div', { class: 'g-multi' });
    root.append(wrap);
    const bag = h('div', { class: 'mu-bag' });
    const stage = h('div', {});
    wrap.append(bag, stage);
    function drawBag() {
      bag.innerHTML = '';
      bag.append(h('small', {}, 'Gesammelt:'));
      cfg.stations.forEach((st, i) => bag.append(h('span', { class: 'mu-chip' + (i < got.length ? ' got' : '') }, i < got.length ? got[i] : '?')));
    }
    function render() {
      stage.innerHTML = '';
      drawBag();
      const st = cfg.stations[s];
      stage.append(h('div', { class: 'g-station' }, `Station ${s + 1} von ${cfg.stations.length}`, h('b', {}, st.title)));
      const box = h('div', {});
      stage.append(box);
      let fertig = false;
      current = S[st.type](box, st.cfg, {
        ...api,
        solved: () => {
          if (fertig) return;
          fertig = true;
          got.push(st.collect);
          drawBag();
          s++;
          api.say(`Station geschafft! Du hast „${st.collect}“ gefunden.`, 'good');
          setTimeout(() => { api.say('', ''); s < cfg.stations.length ? render() : api.solved(); }, 1500);
        },
      });
    }
    render();
    return {
      solveNow() {
        if (current && current.solveNow) current.solveNow();
        got.length = 0;
        cfg.stations.forEach((st) => got.push(st.collect));
        s = cfg.stations.length;
        drawBag();
      },
    };
  };

  window.Spiele = S;
  window.SpielHelfer = { h, shake, pick, matches, answerBox, FALSCH, RICHTIG };
})();

/* Guided rosary: shows one prayer at a time and highlights the matching bead. */
(function () {
  var R = window.ROSARY;
  var $ = function (id) { return document.getElementById(id); };

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem('er.' + key);
      localStorage.setItem('er.' + key, value);
    } catch (e) { /* storage can be unavailable; the guide still works */ }
    return null;
  }

  function br(text) { return text.replace(/\n/g, '<br>'); }

  var today = R.todaySet();
  var params = new URLSearchParams(location.search);
  var fromLink = R.sets[params.get('set')] ? params.get('set') : null;
  var setKey = fromLink || (R.sets[store('set')] ? store('set') : today);
  var steps = R.buildSteps(setKey);

  var lang = store('lang') === 'la' ? 'la' : 'en';
  var showEnglish = store('en') === '1';

  var SIZES = [0.85, 1, 1.2, 1.45, 1.75];
  var sizeIdx = parseInt(store('size'), 10);
  if (!(sizeIdx >= 0 && sizeIdx < SIZES.length)) sizeIdx = 1;
  var wordsOnly = store('words') === '1';
  var keepAwake = store('awake') !== '0';
  var wakeLock = null;

  var idx = 0;
  var saved = parseInt(store('idx'), 10);
  if (!fromLink && saved > 0 && saved < steps.length - 1) idx = saved;

  var svg = window.buildRosary($('beads'), { label: 'Rosary beads. The highlighted bead shows where you are in the prayers.' });
  var beads = Array.prototype.slice.call(svg.querySelectorAll('[data-bead]'));
  var chips = [];
  var langChips = [];

  function buildPicker() {
    var box = $('set-picker');
    Object.keys(R.sets).forEach(function (key) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = R.sets[key].name;
      if (key === today) {
        var tag = document.createElement('small');
        tag.textContent = 'today';
        b.appendChild(tag);
      }
      b.addEventListener('click', function () {
        setKey = key;
        store('set', key);
        steps = R.buildSteps(key);
        updatePicker();
        render();
      });
      b.dataset.key = key;
      box.appendChild(b);
      chips.push(b);
    });
    updatePicker();
  }

  function updatePicker() {
    chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.key === setKey)); });
  }

  function buildLangPicker() {
    var box = $('lang-picker');
    [['en', 'English'], ['la', 'Latin']].forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = l[1];
      b.dataset.lang = l[0];
      b.addEventListener('click', function () {
        lang = l[0];
        store('lang', lang);
        updateLangPicker();
        render();
      });
      box.appendChild(b);
      langChips.push(b);
    });
    updateLangPicker();
  }

  function updateLangPicker() {
    langChips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }

  function cardHTML(s) {
    if (s.kind === 'done') {
      return '<p class="section">Complete</p>' +
        '<h2 class="prayer-title">Amen.</h2>' +
        '<p class="note">You have finished the rosary.</p>' +
        '<button type="button" class="btn" id="again">Pray again</button>';
    }
    if (s.kind === 'mystery') {
      return '<p class="section">' + s.section + '</p>' +
        '<p class="ordinal">' + s.ordinal + ' ' + s.setName + ' Mystery</p>' +
        '<h2 class="prayer-title">' + s.mystery.title + '</h2>' +
        '<p class="scripture">' + s.mystery.scripture + '</p>' +
        '<p class="note">Fruit of this mystery: ' + s.mystery.fruit.toLowerCase() + '.</p>' +
        '<p class="note">Announce the mystery, take a moment to reflect, then pray the Our Father.</p>';
    }

    var english = R.prayers[s.prayer];
    var latin = lang === 'la';
    var shown = latin ? R.latin[s.prayer] : english;
    var note = latin && s.noteLa ? s.noteLa : s.note;
    var la = latin ? ' lang="la"' : '';

    return '<p class="section">' + s.section + '</p>' +
      '<h2 class="prayer-title"' + la + '>' + shown.title + '</h2>' +
      (latin ? '<p class="alt">' + english.title + '</p>' : '') +
      (s.count ? '<p class="count">' + s.count + '</p>' : '') +
      (s.mystery ? '<p class="context">' + s.mystery.title + ', ' + s.mystery.scripture + '</p>' : '') +
      '<p class="prayer-text"' + la + '>' + br(shown.text) + '</p>' +
      (note ? '<p class="note"' + la + '>' + note + '</p>' : '') +
      (latin
        ? '<details class="translation"' + (showEnglish ? ' open' : '') + '>' +
            '<summary>English translation</summary>' +
            '<p class="translation-text">' + br(english.text) + '</p>' +
            (s.noteLa ? '<p class="translation-text">' + s.note + '</p>' : '') +
          '</details>'
        : '');
  }

  function render() {
    var s = steps[idx];
    var last = idx === steps.length - 1;
    $('card').innerHTML = cardHTML(s);

    var pct = Math.round(idx / (steps.length - 1) * 100);
    $('bar-fill').style.width = pct + '%';
    $('bar').setAttribute('aria-valuenow', pct);
    $('step-count').textContent = last ? 'Finished' : 'Step ' + (idx + 1) + ' of ' + (steps.length - 1);

    $('back').disabled = idx === 0;
    $('next').hidden = last;

    var seen = {};
    for (var i = 0; i < idx; i++) seen[steps[i].bead] = true;
    beads.forEach(function (n) {
      var id = n.getAttribute('data-bead');
      n.classList.toggle('current', id === s.bead);
      n.classList.toggle('done', !!seen[id] && id !== s.bead);
    });

    store('idx', String(idx));

    if (last) releaseWake(); else requestWake();
  }

  function go(delta) {
    var next = idx + delta;
    if (next < 0 || next > steps.length - 1) return;
    idx = next;
    render();
  }

  $('next').addEventListener('click', function () { go(1); });
  $('back').addEventListener('click', function () { go(-1); });
  $('card').addEventListener('click', function (e) {
    if (e.target.id === 'again') { idx = 0; render(); }
  });
  // Remember whether the English translation was left open. "toggle" does not bubble, so listen in the capture phase.
  $('card').addEventListener('toggle', function (e) {
    if (e.target.classList && e.target.classList.contains('translation')) {
      showEnglish = e.target.open;
      store('en', showEnglish ? '1' : '0');
    }
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  function applyView() {
    document.documentElement.style.setProperty('--text-scale', SIZES[sizeIdx]);
    $('main').classList.toggle('words-only', wordsOnly);
    $('words-only').setAttribute('aria-pressed', String(wordsOnly));
    $('text-smaller').disabled = sizeIdx === 0;
    $('text-larger').disabled = sizeIdx === SIZES.length - 1;
    $('awake').setAttribute('aria-pressed', String(keepAwake));
  }

  // Keep the screen on while praying (where the browser supports it).
  function requestWake() {
    if (!('wakeLock' in navigator) || !keepAwake || wakeLock || document.visibilityState !== 'visible') return;
    navigator.wakeLock.request('screen').then(function (lock) {
      wakeLock = lock;
      lock.addEventListener('release', function () { if (wakeLock === lock) wakeLock = null; });
    }).catch(function () { /* denied or unsupported; the guide still works */ });
  }

  function releaseWake() {
    if (!wakeLock) return;
    var lock = wakeLock;
    wakeLock = null;
    lock.release().catch(function () {});
  }

  $('text-smaller').addEventListener('click', function () {
    sizeIdx = Math.max(0, sizeIdx - 1);
    store('size', String(sizeIdx));
    applyView();
  });
  $('text-larger').addEventListener('click', function () {
    sizeIdx = Math.min(SIZES.length - 1, sizeIdx + 1);
    store('size', String(sizeIdx));
    applyView();
  });
  $('words-only').addEventListener('click', function () {
    wordsOnly = !wordsOnly;
    store('words', wordsOnly ? '1' : '0');
    applyView();
  });
  if ('wakeLock' in navigator) {
    $('awake').addEventListener('click', function () {
      keepAwake = !keepAwake;
      store('awake', keepAwake ? '1' : '0');
      applyView();
      if (keepAwake) requestWake(); else releaseWake();
    });
    // The browser drops the lock when the tab is hidden, so ask again when it returns.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && idx < steps.length - 1) requestWake();
    });
  } else {
    $('awake').hidden = true;
  }

  buildLangPicker();
  buildPicker();
  applyView();
  render();
})();
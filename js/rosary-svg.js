/* Draws the rosary as an SVG: a loop of 5 decades, a medal, and a tail with a crucifix.
   Every bead carries a data-bead id so the guide can highlight it. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  window.buildRosary = function (container, opts) {
    opts = opts || {};
    var cx = 200, cy = 190, r = 140;
    var svg = el('svg', { viewBox: '0 0 400 530', 'class': 'rosary', focusable: 'false' });
    if (opts.label) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', opts.label);
    }

    el('circle', { cx: cx, cy: cy, r: r, 'class': 'string' }, svg);
    el('line', { x1: 200, y1: 330, x2: 200, y2: 470, 'class': 'string' }, svg);

    // The loop starts at the medal (bottom) and runs clockwise: ten small beads, then a
    // large bead, four times, then a last ten small beads that end beside the medal.
    // That is 4 large and 50 small beads (54 in all, ids l-0 to l-53).
    // Spacing is set from the bead sizes, then scaled so the loop closes exactly.
    var COUNT = 54;
    var MEDAL_R = 12, SMALL_R = 5.5, LARGE_R = 9, PAD = 2.5;
    function isLarge(i) { return (i + 1) % 11 === 0; }
    function radius(i) { return isLarge(i) ? LARGE_R : SMALL_R; }

    var gaps = [], total = 0, i;
    for (i = 0; i < COUNT; i++) {
      var prevR = i === 0 ? MEDAL_R : radius(i - 1);
      gaps.push(prevR + radius(i) + PAD);
      total += gaps[i];
    }
    total += MEDAL_R + radius(COUNT - 1) + PAD; // last bead back to the medal
    var scale = 2 * Math.PI * r / total;

    var arc = 0;
    for (i = 0; i < COUNT; i++) {
      arc += gaps[i] * scale;
      var a = Math.PI / 2 + arc / r;
      el('circle', {
        cx: (cx + r * Math.cos(a)).toFixed(1),
        cy: (cy + r * Math.sin(a)).toFixed(1),
        r: radius(i),
        'class': 'bead' + (isLarge(i) ? ' large' : ''),
        'data-bead': 'l-' + i
      }, svg);
    }

    // Tail, listed from the medal down to the crucifix.
    [['t-glory', 356, 6.5, 'bead mid'], ['t-s3', 378, 5, 'bead'], ['t-s2', 394, 5, 'bead'],
     ['t-s1', 410, 5, 'bead'], ['t-large', 432, 9, 'bead large']].forEach(function (b) {
      el('circle', { cx: 200, cy: b[1], r: b[2], 'class': b[3], 'data-bead': b[0] }, svg);
    });

    el('circle', { cx: 200, cy: 330, r: 12, 'class': 'medal', 'data-bead': 'medal' }, svg);
    el('path', { d: 'M200 324v12M194 330h12', 'class': 'medal-mark' }, svg);

    var cross = el('g', { 'class': 'cross', 'data-bead': 'cross' }, svg);
    el('rect', { x: 195, y: 458, width: 10, height: 58, rx: 2 }, cross);
    el('rect', { x: 180, y: 472, width: 40, height: 10, rx: 2 }, cross);

    container.innerHTML = '';
    container.appendChild(svg);
    return svg;
  };
})();
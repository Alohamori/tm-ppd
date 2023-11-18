const make_score = (n, p) => {
  const port = $E('div', {className: 'port'});
  const [y, x] = divmod(n, 5);
  port.style.backgroundPosition = `${25 * x}% ${100/15 * y}%`;
  return $E('div', {className: 'score'}, [port, $D(p)]);
};

const reorder = (a, i, j) => {
  a.splice(0, 0, ...a.splice(i, 1));
  a.splice(1, 0, ...a.splice(j + (i > j), 1));
};

const show_tip = (e, n, ep, ti, task, points, i, j) => {
  const es = getComputedStyle(e);
  tip.style.backgroundColor = es.backgroundColor;
  tip.style.color = es.color;
  const head = `<u>Series ${n}, Episode ${ep}, Task ${ti}</u><h2>${task}</h2>`;
  const cs = [...Array(5).keys()].map(c => c + n * 5 - 5);
  const pt = points.slice();
  reorder(cs, i, j);
  reorder(pt, i, j);
  const scores = $E('div', {id: 'scores'}, cs.map((c, ci) => make_score(c, pt[ci])));
  tip.replaceChildren($E('div'), scores);
  scores.children[2].before($E('br'));
  tip.children[0].innerHTML = head;

  const er = e.getBoundingClientRect();
  const tr = tip.getBoundingClientRect();
  let t = er.bottom + 10;
  if (t + tr.height > innerHeight) t = er.top - tr.height - 10;
  let l = er.right + 10;
  if (l + tr.width > document.body.clientWidth) l = er.left - tr.width - 10;
  tip.style.top = `${t + scrollY}px`;
  tip.style.left = `${l}px`;
};

const load = n => {
  const c = [0, 1, 2, 3, 4];
  const contestants = names.slice(n * 5 - 5, n * 5);
  const tasks = Object.entries(series[n]);
  const diffs = c.map(_ => [[],[],[],[],[]]);

  for (const [task, points] of tasks)
    for (let i = 0; i < 5; ++i)
      for (let j = 0; j < 5; ++j)
        if (i != j) diffs[i][j].push(points[i] - points[j]);

  const build_ep = (i, j, k = 0) => $E('td', {}, episodes[n].map((s, ep) => {
      const ds = diffs[i][j].splice(0, s);
      return $E('div', {className: `episode${ds[0] && ds.every(d => d > 0) ? ' sweep' : ''}`}, ds.map((d, ti) => {
        const e = $E('div', {className: `task d${clamp(d, 0, 5)}`});
        const [t, p] = tasks[k++];
        e.onpointerenter = ev => { show_tip(ev.target, n, ep + 1, ti + 1, t, p, i, j); }
        e.onpointerleave = () => { tip.style.top = tip.style.left = '-999px'; }
        return e;
      }));
    }));

  const labels = $E('th', {className: 'split'}, [$D('versus (B)'), $D('contestant (A)')]);
  const versus = c.map(i => $E('th', {className: 'label', innerText: `${contestants[i].split(' ')[0]}`}));
  const head = $E('thead', {}, [$E('tr', {}, [labels, ...versus])]);
  const rows = c.map(i => $E('tr', {}, [$E('td', {className: 'label', innerText: contestants[i]}), ...c.map(j => build_ep(i, j))]));
  const body = $E('tbody', {}, rows);
  const table = $E('table', {id: `series${n}`, className: 'series'}, [head, body]);

  sn.innerText = n;
  hold.replaceChildren(table);
};


document.addEventListener('DOMContentLoaded', () => {
  ['<1', 1, 2, 3, 4, '5+'].forEach((d, i) => {
    legend.appendChild($E('div', {className: `mark d${i}`, innerText: d}));
  });
  for (let i = 1; i <= 16; ++i) {
    const s = $E('div', {className: 'bubble tap'}, [$E('span', {innerText: i})]);
    s.style.backgroundImage = `url(ui/casts/UK${i}.jpg)`;
    s.onclick = () => load(i);
    bubbles.appendChild(s);
  }
});

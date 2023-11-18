const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

const $E = (tag, props = {}, kids = []) =>
  kids.reduce((e, c) => (e.appendChild(c), e),
              Object.assign(document.createElement(tag), props));
const $D = t => $E('div', {innerHTML: t});

const clamp = (v, l, h) => Math.min(Math.max(v, l), h);
const divmod = (x, y) => [~~(x / y), x % y];

// SCORING
const COLORS = { HIGH: '#FF3B3B', MEDIUM: '#FFE135', LOW: '#00C97A' };

function calcScore(elev, dist, dens, drain, extra, type) {
  const e = Math.round(30 * (1 - Math.min(elev / 200, 1)));
  const d = Math.round(30 * Math.max(0, 1 - dist / 20));
  const p = Math.round(20 * Math.min(dens / 10000, 1));
  const dr = { poor: 10, moderate: 5, good: 0 }[drain];
  const x = type === 'urban' ? Math.round(10 * (extra / 100)) : Math.round(10 * (1 - extra / 100));
  const total = e + d + p + dr + x;
  return { total: total, risk: total >= 60 ? 'HIGH' : total >= 35 ? 'MEDIUM' : 'LOW', e, d, p, dr, x };
}

// HERO ZONE CARDS
const ZONES = [
  { name: 'Riverside District', elev: 6, dist: 0.4, dens: 8200, drain: 'poor', extra: 78, type: 'urban' },
  { name: 'Hillcrest Zone', elev: 145, dist: 22, dens: 800, drain: 'good', extra: 25, type: 'rural' },
  { name: 'Lakefront East', elev: 11, dist: 1.2, dens: 5400, drain: 'moderate', extra: 65, type: 'urban' },
  { name: 'Northfields Rural', elev: 60, dist: 8, dens: 300, drain: 'moderate', extra: 40, type: 'rural' },
  { name: 'Central District', elev: 22, dist: 3.5, dens: 9100, drain: 'poor', extra: 85, type: 'urban' },
];

function renderZones() {
  document.getElementById('zone-cards').innerHTML = ZONES.map((z, i) => {
    const r = calcScore(z.elev, z.dist, z.dens, z.drain, z.extra, z.type);
    const bc = r.risk === 'HIGH' ? 'badge-high' : r.risk === 'MEDIUM' ? 'badge-med' : 'badge-low';
    const cc = r.risk === 'HIGH' ? 'zc-high' : r.risk === 'MEDIUM' ? 'zc-med' : 'zc-low';
    return `<div class="zone-card ${cc}" onclick="loadZone(${i})">
      <div class="zc-top"><span class="zc-name">${z.name}</span><span class="zc-badge ${bc}">${r.risk}</span></div>
      <div class="zc-bar-bg"><div class="zc-bar" style="width:${r.total}%;background:${COLORS[r.risk]}"></div></div>
      <div class="zc-meta"><span>Score: ${r.total}/100</span><span>${z.type === 'urban' ? 'Urban' : 'Rural'}</span><span>${z.elev}m elev.</span></div>
      <div class="zc-hint">Click to load into demo ↓</div>
    </div>`;
  }).join('');
}
renderZones();

function loadZone(i) {
  const z = ZONES[i];
  document.getElementById('elev').value = z.elev;
  document.getElementById('dist').value = z.dist;
  document.getElementById('dens').value = z.dens;
  document.getElementById('drain').value = z.drain;
  document.getElementById('extra').value = z.extra;
  syncLbl('elev', z.elev + 'm');
  syncLbl('dist', parseFloat(z.dist).toFixed(1) + 'km');
  syncLbl('dens', Number(z.dens).toLocaleString());
  syncLbl('extra', z.extra + '%');
  setType(z.type);
  document.getElementById('how').scrollIntoView({ behavior: 'smooth' });
}

// Animate hero counter
let c = 0;
const tgt = 2847;
const ci = setInterval(() => {
  c += Math.ceil((tgt - c) / 8);
  if (c >= tgt) { c = tgt; clearInterval(ci); }
  document.getElementById('hero-count').textContent = c.toLocaleString();
}, 60);

// FEATURES
let openFd = -1;

function toggleFeature(i) {
  const cards = document.querySelectorAll('.feature-card');
  const details = document.querySelectorAll('.feature-detail');
  const same = openFd === i;
  cards.forEach((c, j) => c.classList.toggle('fc-active', !same && j === i));
  details.forEach((d, j) => d.classList.toggle('fd-open', !same && j === i));
  openFd = same ? -1 : i;
  if (!same && i === 1) renderFd1();
}

function updateFd0() {
  const v = +document.getElementById('fd0-score').value;
  document.getElementById('fd0-val').textContent = v;
  const risk = v >= 60 ? 'HIGH' : v >= 35 ? 'MEDIUM' : 'LOW';
  const descs = { HIGH: 'Immediate action required.', MEDIUM: 'Moderate vulnerability — upgrades recommended.', LOW: 'Lower risk — standard monitoring sufficient.' };
  const el = document.getElementById('fd0-result');
  el.textContent = risk + ' RISK';
  el.style.color = COLORS[risk];
  document.getElementById('fd0-desc').textContent = descs[risk];
  document.getElementById('fd0-bar').style.width = v + '%';
  document.getElementById('fd0-bar').style.background = COLORS[risk];
}

function renderFd1() {
  const factors = [
    { name: 'Elevation', max: 30, w: 90, note: 'Strongest physical predictor' },
    { name: 'Water proximity', max: 30, w: 82, note: 'Distance to river / lake / coast' },
    { name: 'Population density', max: 20, w: 58, note: 'Human impact amplifier' },
    { name: 'Drainage quality', max: 10, w: 38, note: 'Infrastructure mitigation' },
    { name: 'Region-specific factor', max: 10, w: 32, note: 'Urban surface / rural soil' },
  ];
  document.getElementById('fd1-bars').innerHTML = factors.map(f => `
    <div style="margin-bottom:13px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <span style="font-size:13px;color:rgba(255,255,255,0.65)">${f.name}</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.3)">max ${f.max} pts</span>
      </div>
      <div style="height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
        <div style="height:100%;border-radius:3px;background:var(--blue);width:${f.w}%;transition:width 0.8s ease"></div>
      </div>
      <div style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:3px">${f.note}</div>
    </div>`).join('');
}

let fd2mode = 'urban';

function setFd2(m) {
  fd2mode = m;
  document.getElementById('fd2-btn-urban').style.background = m === 'urban' ? '#0057FF' : 'transparent';
  document.getElementById('fd2-btn-urban').style.color = m === 'urban' ? 'white' : 'rgba(255,255,255,0.4)';
  document.getElementById('fd2-btn-rural').style.background = m === 'rural' ? '#0057FF' : 'transparent';
  document.getElementById('fd2-btn-rural').style.color = m === 'rural' ? 'white' : 'rgba(255,255,255,0.4)';
  document.getElementById('fd2-factor-label').textContent = m === 'urban' ? 'Impervious surface coverage' : 'Soil permeability index';
  document.getElementById('fd2-lo').textContent = m === 'urban' ? 'Low coverage → safer' : 'Low permeability → riskier';
  document.getElementById('fd2-hi').textContent = m === 'urban' ? 'High coverage → riskier' : 'High permeability → safer';
  document.getElementById('fd2-slider').value = 65;
  updateFd2();
}

function updateFd2() {
  const v = +document.getElementById('fd2-slider').value;
  const s = fd2mode === 'urban' ? Math.round(10 * (v / 100)) : Math.round(10 * (1 - v / 100));
  document.getElementById('fd2-score').textContent = s;
}

// LIVE DEMO
let regionType = 'urban';
let assessed = 0;

function setType(t) {
  regionType = t;
  document.getElementById('btn-urban').classList.toggle('active', t === 'urban');
  document.getElementById('btn-rural').classList.toggle('active', t === 'rural');
  document.getElementById('extra-lbl').textContent = t === 'urban' ? 'Impervious surface (%)' : 'Soil permeability (%)';
  liveAssess();
}

function syncLbl(id, val) { document.getElementById('lbl-' + id).textContent = val; }

function liveAssess() {
  const elev = +document.getElementById('elev').value;
  const dist = +document.getElementById('dist').value;
  const dens = +document.getElementById('dens').value;
  const drain = document.getElementById('drain').value;
  const extra = +document.getElementById('extra').value;
  const r = calcScore(elev, dist, dens, drain, extra, regionType);
  const notes = {
    HIGH: 'Immediate action required. Recommend flood barriers, early-warning systems, and evacuation planning.',
    MEDIUM: 'Moderate vulnerability. Consider drainage upgrades and community flood preparedness programs.',
    LOW: 'Lower risk profile. Maintain current infrastructure and monitor seasonal water levels.'
  };
  document.getElementById('out-ph').style.display = 'none';
  document.getElementById('out-res').style.display = 'block';
  const lvl = document.getElementById('out-level');
  lvl.textContent = r.risk + ' RISK';
  lvl.style.color = COLORS[r.risk];
  document.getElementById('out-type').textContent = (regionType === 'urban' ? 'Urban' : 'Rural') + ' Region';
  document.getElementById('out-sv').textContent = r.total + ' / 100';
  const bar = document.getElementById('out-bar');
  bar.style.width = r.total + '%';
  bar.style.background = COLORS[r.risk];
  const fname = regionType === 'urban' ? 'Impervious surface' : 'Permeability';
  const factors = [
    { name: 'Elevation', score: r.e, max: 30 },
    { name: 'Water proximity', score: r.d, max: 30 },
    { name: 'Pop. density', score: r.p, max: 20 },
    { name: 'Drainage', score: r.dr, max: 10 },
    { name: fname, score: r.x, max: 10 },
  ];
  document.getElementById('out-factors').innerHTML = factors.map(f => `
    <div class="out-factor">
      <span class="of-name">${f.name}</span>
      <div class="of-bar-wrap"><div class="of-bar" style="width:${Math.round(f.score / f.max * 100)}%;background:${COLORS[r.risk]}"></div></div>
      <span class="of-score">${f.score}/${f.max}</span>
    </div>`).join('');
  document.getElementById('out-note').textContent = notes[r.risk];
  assessed++;
  document.getElementById('hero-count').textContent = (2847 + assessed).toLocaleString();
}

// USE CASES
let openUC = -1;

function toggleUC(i) {
  const cards = document.querySelectorAll('.uc-card');
  const scens = document.querySelectorAll('.uc-scenario');
  const same = openUC === i;
  cards.forEach((c, j) => c.classList.toggle('uc-active', !same && j === i));
  scens.forEach((s, j) => s.classList.toggle('ucs-open', !same && j === i));
  openUC = same ? -1 : i;
}

// CTA
function submitCta() {
  const email = document.getElementById('cta-email').value.trim();
  const fb = document.getElementById('cta-fb');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fb.textContent = 'Please enter a valid email address.';
    fb.className = 'cta-feedback err';
    return;
  }
  fb.textContent = "You're on the list! We'll be in touch soon. 🎉";
  fb.className = 'cta-feedback ok';
  document.getElementById('cta-email').value = '';
}

// REVEAL ON SCROLL
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
}), { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Initialize
setTimeout(liveAssess, 400);
/* ============================================================
   JALAN KEABADIAN - Idle Cultivation RPG
   Game logic + save/load + main loop
   ============================================================ */

// ============================================================
// DATA: REALMS (9 major realms × 9 stages each)
// ============================================================
const REALMS = [
  { name: "Fana",                     icon: "☯",  baseQi: 100,    trib: 1.00, powerMult: 1 },
  { name: "Pemurnian Qi",             icon: "✦",  baseQi: 500,    trib: 0.95, powerMult: 2 },
  { name: "Pembentukan Fondasi",      icon: "◈",  baseQi: 3000,   trib: 0.88, powerMult: 4 },
  { name: "Inti Emas",                icon: "⚜",  baseQi: 18000,  trib: 0.80, powerMult: 8 },
  { name: "Bayi Nurani",              icon: "❋",  baseQi: 90000,  trib: 0.72, powerMult: 16 },
  { name: "Transformasi Jiwa",        icon: "☸",  baseQi: 500000, trib: 0.63, powerMult: 32 },
  { name: "Kaisar Langit",            icon: "♛",  baseQi: 3000000,trib: 0.54, powerMult: 64 },
  { name: "Dewa Sejati",              icon: "✺",  baseQi: 2e7,    trib: 0.44, powerMult: 128 },
  { name: "Abadi",                    icon: "∞",  baseQi: 1.5e8,  trib: 0.30, powerMult: 256 },
];
const STAGES_PER_REALM = 9;
const STAGE_MULT = 1.6;  // Qi needed multiplier per stage

// ============================================================
// DATA: TECHNIQUES (permanent upgrades)
// ============================================================
const TECHNIQUES = [
  { id: "t1", name: "Nafas Angin Pagi",       desc: "Teknik pernapasan dasar.",          baseCost: 50,     rateBonus: 1,    maxLvl: 50 },
  { id: "t2", name: "Mata Langit",            desc: "Penglihatan membentuk konsentrasi.",baseCost: 300,    rateBonus: 5,    maxLvl: 50, unlockRealm: 1 },
  { id: "t3", name: "Hati Gunung Tenang",     desc: "Meditasi tingkat tinggi.",          baseCost: 2000,   rateBonus: 25,   maxLvl: 50, unlockRealm: 2 },
  { id: "t4", name: "Inti Api Merah",         desc: "Membakar qi menjadi esensi murni.", baseCost: 15000,  rateBonus: 120,  maxLvl: 50, unlockRealm: 3 },
  { id: "t5", name: "Sembilan Naga Langit",   desc: "Warisan para dewa kuno.",           baseCost: 100000, rateBonus: 600,  maxLvl: 50, unlockRealm: 4 },
  { id: "t6", name: "Jiwa Kekosongan",        desc: "Melampaui bentuk, memahami kosong.",baseCost: 800000, rateBonus: 3200, maxLvl: 50, unlockRealm: 5 },
  { id: "t7", name: "Dharma Abadi",           desc: "Hukum langit tertulis di jiwa.",    baseCost: 6e6,    rateBonus: 18000,maxLvl: 50, unlockRealm: 6 },
];

// ============================================================
// DATA: PILLS (instant effects, consumable, buy & use)
// ============================================================
const PILLS = [
  { id: "p1", name: "Pil Qi Ringan",        desc: "+200 Qi instan.",               cost: 20,    effect: "qi", value: 200 },
  { id: "p2", name: "Pil Akar Bunga Roh",   desc: "+2000 Qi instan.",              cost: 150,   effect: "qi", value: 2000 },
  { id: "p3", name: "Pil Jantung Phoenix",  desc: "+20000 Qi instan.",             cost: 800,   effect: "qi", value: 20000 },
  { id: "p4", name: "Pil Naga Langit",      desc: "+200000 Qi instan.",            cost: 5000,  effect: "qi", value: 200000 },
  { id: "p5", name: "Pil Peruntungan",      desc: "Tingkatkan peluang terobosan berikutnya +15%.", cost: 500, effect: "luck", value: 0.15 },
  { id: "p6", name: "Pil Takdir Agung",     desc: "Tingkatkan peluang terobosan berikutnya +35%.", cost: 3500, effect: "luck", value: 0.35 },
];

// ============================================================
// DATA: ARTIFACTS (permanent equipped passives, one-time buy)
// ============================================================
const ARTIFACTS = [
  { id: "a1", name: "Pedang Kayu Peach",       desc: "Pusaka murid awal.",          cost: 500,     bonus: { atk: 10, def: 5 },   unlockRealm: 1 },
  { id: "a2", name: "Jubah Awan Ungu",         desc: "Tenun sutra laba-laba roh.",  cost: 5000,    bonus: { def: 30, hp: 100 },  unlockRealm: 2 },
  { id: "a3", name: "Gong Matahari",           desc: "Dentuman membuka sumbatan Qi.",cost: 25000,  bonus: { qiRateMult: 0.25 },  unlockRealm: 3 },
  { id: "a4", name: "Cincin Penelan Langit",   desc: "Menyimpan Qi semesta.",        cost: 200000,  bonus: { qiRateMult: 0.5, atk: 100 }, unlockRealm: 4 },
  { id: "a5", name: "Tombak Bayangan Qilin",   desc: "Darah Qilin mengalir di dalamnya.", cost: 2e6, bonus: { atk: 1000, def: 500 }, unlockRealm: 5 },
  { id: "a6", name: "Pagoda Sembilan Lantai",  desc: "Menara pusaka sekte kuno.",    cost: 2e7,     bonus: { qiRateMult: 1.0, hp: 10000 }, unlockRealm: 6 },
];

// ============================================================
// DATA: MONSTERS (scaled by player power level)
// ============================================================
const MONSTER_TYPES = [
  "Serigala Roh", "Siluman Rubah", "Beruang Batu", "Kelelawar Darah",
  "Ular Berkepala Tujuh", "Harimau Petir", "Naga Hitam", "Siluman Laba-laba",
  "Burung Api", "Kura-kura Langit", "Kera Emas", "Iblis Mayat",
  "Panglima Iblis", "Jenderal Neraka", "Raja Siluman", "Kaisar Iblis"
];

// ============================================================
// GAME STATE
// ============================================================
const defaultState = () => ({
  qi: 0,
  stones: 0,
  realm: 0,            // index into REALMS
  stage: 0,            // 0..8 within realm
  techniques: {},      // id -> level
  artifacts: [],       // array of owned ids
  totalBreakthroughs: 0,
  totalMonstersKilled: 0,
  luckBuff: 0,         // next-breakthrough bonus
  monster: null,
  monsterHp: 0,
  lastSave: Date.now(),
  lastTick: Date.now(),
});

let state = defaultState();
const SAVE_KEY = "cultivation_idle_save_v1";

// ============================================================
// SAVE / LOAD
// ============================================================
function save() {
  state.lastSave = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const loaded = JSON.parse(raw);
    state = Object.assign(defaultState(), loaded);
    // Offline progress
    const now = Date.now();
    const elapsed = Math.min((now - (state.lastTick || now)) / 1000, 3 * 3600); // cap 3h
    if (elapsed > 10) {
      const gain = Math.floor(elapsed * qiRate());
      state.qi += gain;
      log(`💤 Kembali dari retret! +${fmt(gain)} Qi terkumpul selama ${Math.floor(elapsed/60)} menit.`, "gold");
    }
    state.lastTick = now;
    return true;
  } catch (e) {
    console.warn("Load failed:", e);
    return false;
  }
}
function reset() {
  if (!confirm("Hapus semua progres? Tindakan ini tidak bisa dibatalkan!")) return;
  localStorage.removeItem(SAVE_KEY);
  state = defaultState();
  renderAll();
  log("⟲ Perjalanan dimulai dari awal.", "danger");
}

// ============================================================
// CORE FORMULAS
// ============================================================
function qiNeeded() {
  const r = REALMS[state.realm];
  return Math.floor(r.baseQi * Math.pow(STAGE_MULT, state.stage));
}
function qiRate() {
  // Base rate scales with realm
  let base = 1 + state.realm * 2;
  // Technique bonuses
  for (const t of TECHNIQUES) {
    const lvl = state.techniques[t.id] || 0;
    base += lvl * t.rateBonus;
  }
  // Artifact multiplier
  let mult = 1;
  for (const aid of state.artifacts) {
    const a = ARTIFACTS.find(x => x.id === aid);
    if (a && a.bonus.qiRateMult) mult += a.bonus.qiRateMult;
  }
  return Math.floor(base * mult);
}
function playerPower() {
  const r = REALMS[state.realm];
  let atk = 5 + state.realm * 10 + state.stage * 3;
  let def = 3 + state.realm * 7 + state.stage * 2;
  let hp  = 50 + state.realm * 100 + state.stage * 20;
  atk *= r.powerMult;
  def *= r.powerMult;
  hp  *= r.powerMult;
  for (const aid of state.artifacts) {
    const a = ARTIFACTS.find(x => x.id === aid);
    if (a) {
      atk += a.bonus.atk || 0;
      def += a.bonus.def || 0;
      hp  += a.bonus.hp  || 0;
    }
  }
  return { atk: Math.floor(atk), def: Math.floor(def), hp: Math.floor(hp) };
}
function breakthroughChance() {
  const r = REALMS[state.realm];
  // Only final stage triggers tribulation; other stages = 100% safe
  if (state.stage < STAGES_PER_REALM - 1) return 1.0;
  return Math.min(0.99, r.trib + state.luckBuff);
}
function monsterPowerForLevel() {
  const pl = playerPower();
  const diff = 0.85 + Math.random() * 0.35; // 85% - 120% of player
  return {
    hp:  Math.max(20, Math.floor(pl.hp  * diff * 0.6)),
    atk: Math.max(3,  Math.floor(pl.atk * diff * 0.5)),
    def: Math.max(1,  Math.floor(pl.def * diff * 0.4)),
  };
}

// ============================================================
// ACTIONS
// ============================================================
function meditate() {
  const bonus = Math.max(1, Math.floor(qiRate() * 2));
  state.qi += bonus;
  log(`☯ Meditasi: +${fmt(bonus)} Qi`);
  renderQi();
  renderStats();
}

function tryBreakthrough() {
  const need = qiNeeded();
  if (state.qi < need) {
    log("Qi tidak cukup untuk terobosan.", "danger");
    return;
  }
  // Minor stage = instant, Major stage (last) = tribulation modal
  if (state.stage < STAGES_PER_REALM - 1) {
    doBreakthrough(true);
  } else {
    openTribulation();
  }
}

function openTribulation() {
  const chance = breakthroughChance();
  document.getElementById("trib-chance").textContent = Math.round(chance * 100) + "%";
  const nextRealm = REALMS[state.realm + 1];
  const txt = nextRealm
    ? `Kamu hendak menyeberang ke <b>${nextRealm.name}</b>. Bencana petir akan menguji jiwamu!`
    : "Kamu sudah mencapai puncak — Terobosan Abadi terakhir!";
  document.getElementById("trib-text").innerHTML = txt;
  document.getElementById("modal-tribulation").classList.remove("hidden");
}

function doBreakthrough(guaranteed) {
  const need = qiNeeded();
  const chance = guaranteed ? 1.0 : breakthroughChance();
  const roll = Math.random();

  if (roll > chance) {
    // FAILURE: lose 30% qi, reset luck, keep stage
    const lost = Math.floor(state.qi * 0.3);
    state.qi -= lost;
    state.luckBuff = 0;
    log(`⚡ GAGAL! Jiwamu terluka. Qi hilang ${fmt(lost)}.`, "danger");
    showResult("💥 Terobosan Gagal", `Bencana petir terlalu kuat! Kamu kehilangan ${fmt(lost)} Qi tetapi tidak mati. Coba lagi setelah memulihkan Qi.`);
    renderAll();
    return;
  }

  // SUCCESS
  state.qi -= need;
  state.totalBreakthroughs++;
  state.luckBuff = 0;

  if (state.stage < STAGES_PER_REALM - 1) {
    state.stage++;
    log(`✦ Terobosan berhasil! ${REALMS[state.realm].name} Tingkat ${state.stage + 1}`, "gold");
  } else {
    // major realm advance
    if (state.realm < REALMS.length - 1) {
      state.realm++;
      state.stage = 0;
      const r = REALMS[state.realm];
      log(`🌩 Melampaui bencana! Kini memasuki alam ${r.name}!`, "gold");
      showResult(`⚡ Memasuki ${r.name}!`, `Jiwamu ditempa oleh petir langit. Kamu kini seorang kultivator ${r.name}. Kekuatanmu melonjak dahsyat!`);
    } else {
      // max realm reached
      log(`∞ TELAH MENCAPAI KEABADIAN SEJATI! Kisahmu akan dikenang selamanya.`, "gold");
      showResult("∞ KEABADIAN!", "Kamu telah mencapai puncak tertinggi kultivasi. Jiwamu menjadi satu dengan langit. Kisahmu akan dikenang hingga akhir zaman.");
    }
  }
  renderAll();
}

function buyTechnique(id) {
  const t = TECHNIQUES.find(x => x.id === id);
  if (!t) return;
  const lvl = state.techniques[id] || 0;
  if (lvl >= t.maxLvl) return;
  const cost = Math.floor(t.baseCost * Math.pow(1.35, lvl));
  if (state.stones < cost) {
    log(`Batu Roh tidak cukup (${fmt(cost)} dibutuhkan).`, "danger");
    return;
  }
  state.stones -= cost;
  state.techniques[id] = lvl + 1;
  log(`🌀 ${t.name} naik ke tingkat ${lvl + 1}! (+${t.rateBonus} Qi/dtk)`, "green");
  renderAll();
}

function buyPill(id) {
  const p = PILLS.find(x => x.id === id);
  if (!p) return;
  if (state.stones < p.cost) {
    log(`Batu Roh tidak cukup (${fmt(p.cost)} dibutuhkan).`, "danger");
    return;
  }
  state.stones -= p.cost;
  if (p.effect === "qi") {
    state.qi += p.value;
    log(`💊 Konsumsi ${p.name}: +${fmt(p.value)} Qi`, "green");
  } else if (p.effect === "luck") {
    state.luckBuff = Math.max(state.luckBuff, p.value);
    log(`🌟 ${p.name}: Peluang terobosan +${Math.round(p.value * 100)}% (sekali pakai)`, "green");
  }
  renderAll();
}

function buyArtifact(id) {
  const a = ARTIFACTS.find(x => x.id === id);
  if (!a) return;
  if (state.artifacts.includes(id)) return;
  if (state.realm < (a.unlockRealm || 0)) return;
  if (state.stones < a.cost) {
    log(`Batu Roh tidak cukup (${fmt(a.cost)} dibutuhkan).`, "danger");
    return;
  }
  state.stones -= a.cost;
  state.artifacts.push(id);
  log(`🗡 Memperoleh ${a.name}!`, "gold");
  renderAll();
}

// ============================================================
// COMBAT
// ============================================================
function spawnMonster() {
  const pl = playerPower();
  const m = monsterPowerForLevel();
  const nameIdx = Math.min(
    MONSTER_TYPES.length - 1,
    state.realm * 2 + Math.floor(Math.random() * 2)
  );
  const reward = Math.max(
    5,
    Math.floor((5 + state.realm * 25 + state.stage * 3) * (0.8 + Math.random() * 0.5))
  );
  state.monster = {
    name: MONSTER_TYPES[nameIdx] || "Iblis Asing",
    hp: m.hp,
    hpMax: m.hp,
    atk: m.atk,
    def: m.def,
    reward,
  };
  state.monsterHp = m.hp;
  renderMonster();
  document.getElementById("btn-fight").disabled = false;
  document.getElementById("btn-fight").textContent = "⚔ Serang";
  document.getElementById("btn-next-monster").style.display = "none";
  clearBattleLog();
  battleLog(`Musuh muncul: ${state.monster.name}`, "enemy");
}

function fight() {
  if (!state.monster) { spawnMonster(); return; }
  const pl = playerPower();
  const m = state.monster;

  // Player attacks
  const dmg = Math.max(1, pl.atk - Math.floor(m.def * 0.5) + Math.floor(Math.random() * pl.atk * 0.2));
  m.hp -= dmg;
  battleLog(`⚔ Kamu menyerang ${m.name} -${fmt(dmg)} HP`, "you");

  if (m.hp <= 0) {
    battleLog(`🎉 ${m.name} dikalahkan! +${fmt(m.reward)} Batu Roh`, "win");
    state.stones += m.reward;
    state.totalMonstersKilled++;
    state.monster = null;
    renderStats();
    renderShops();
    document.getElementById("btn-fight").disabled = true;
    document.getElementById("btn-next-monster").style.display = "block";
    save();
    return;
  }

  // Monster counter attack
  const mdmg = Math.max(1, m.atk - Math.floor(pl.def * 0.5) + Math.floor(Math.random() * m.atk * 0.2));
  // Represent player HP as % taken from qi (no death — just qi drain scaling)
  const qiLost = Math.min(state.qi, Math.floor(mdmg * 50));
  state.qi = Math.max(0, state.qi - qiLost);
  battleLog(`🩸 ${m.name} balas menyerang -${fmt(mdmg)} (-${fmt(qiLost)} Qi)`, "enemy");

  renderMonster();
  renderQi();
  renderStats();
}

function nextMonster() { spawnMonster(); }

// ============================================================
// RENDERING
// ============================================================
function fmt(n) {
  if (n < 1000) return Math.floor(n).toString();
  const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
  let u = 0;
  while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
  return n.toFixed(n < 10 ? 2 : 1) + units[u];
}

function renderAll() {
  renderQi();
  renderStats();
  renderShops();
  renderMonster();
}

function renderQi() {
  const need = qiNeeded();
  const pct = Math.min(100, (state.qi / need) * 100);
  document.getElementById("qi-fill").style.width = pct + "%";
  document.getElementById("qi-current").textContent = fmt(state.qi);
  document.getElementById("qi-needed").textContent = fmt(need);
  document.getElementById("stat-qi").textContent = fmt(state.qi);
  document.getElementById("stat-stones").textContent = fmt(state.stones);
  document.getElementById("stat-qiRate").textContent = fmt(qiRate());

  const btn = document.getElementById("btn-breakthrough");
  btn.disabled = state.qi < need;
  if (state.stage === STAGES_PER_REALM - 1) {
    btn.textContent = `⚡ Bencana Petir (${Math.round(breakthroughChance() * 100)}%)`;
  } else {
    btn.textContent = `✦ Terobosan Tingkat ${state.stage + 2}`;
  }
}

function renderStats() {
  const pl = playerPower();
  const r = REALMS[state.realm];
  document.getElementById("realm-name").textContent = `${r.icon} ${r.name}`;
  document.getElementById("realm-stage").textContent = `Tingkat ${state.stage + 1} / ${STAGES_PER_REALM}`;
  document.getElementById("avatar").textContent = r.icon;
  document.getElementById("stat-atk").textContent = fmt(pl.atk);
  document.getElementById("stat-def").textContent = fmt(pl.def);
  document.getElementById("stat-hp").textContent = fmt(pl.hp);
  document.getElementById("stat-power").textContent = fmt(pl.atk + pl.def + Math.floor(pl.hp / 10));
}

function renderShops() {
  // Techniques
  const tl = document.getElementById("techniques-list");
  tl.innerHTML = "";
  for (const t of TECHNIQUES) {
    const locked = (t.unlockRealm || 0) > state.realm;
    const lvl = state.techniques[t.id] || 0;
    const maxed = lvl >= t.maxLvl;
    const cost = maxed ? 0 : Math.floor(t.baseCost * Math.pow(1.35, lvl));
    const affordable = state.stones >= cost;
    const card = document.createElement("div");
    card.className = "card" + (locked ? " locked" : "") + (lvl > 0 ? " owned" : "");
    card.innerHTML = `
      <div class="card-head">
        <span class="card-name">🌀 ${t.name}</span>
        ${lvl > 0 ? `<span class="card-level">Lv.${lvl}/${t.maxLvl}</span>` : ""}
      </div>
      <div class="card-desc">${t.desc}</div>
      <div class="card-effect">+${t.rateBonus} Qi/dtk per level</div>
      ${locked
        ? `<div class="card-cost too-expensive">🔒 Butuh alam ${REALMS[t.unlockRealm].name}</div>`
        : maxed
          ? `<div class="card-cost" style="color:var(--accent-green)">✓ MAKSIMAL</div>`
          : `<div class="card-cost ${affordable ? "" : "too-expensive"}">Biaya: ◈ ${fmt(cost)} Batu Roh</div>
             <button class="btn btn-primary" ${!affordable ? "disabled" : ""} onclick="buyTechnique('${t.id}')">Pelajari</button>`
      }
    `;
    tl.appendChild(card);
  }

  // Pills
  const pl = document.getElementById("pills-list");
  pl.innerHTML = "";
  for (const p of PILLS) {
    const affordable = state.stones >= p.cost;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-head"><span class="card-name">💊 ${p.name}</span></div>
      <div class="card-desc">${p.desc}</div>
      <div class="card-cost ${affordable ? "" : "too-expensive"}">Biaya: ◈ ${fmt(p.cost)} Batu Roh</div>
      <button class="btn btn-primary" ${!affordable ? "disabled" : ""} onclick="buyPill('${p.id}')">Konsumsi</button>
    `;
    pl.appendChild(card);
  }

  // Artifacts
  const al = document.getElementById("artifacts-list");
  al.innerHTML = "";
  for (const a of ARTIFACTS) {
    const owned = state.artifacts.includes(a.id);
    const locked = state.realm < (a.unlockRealm || 0);
    const affordable = state.stones >= a.cost;
    const bonusTxt = Object.entries(a.bonus).map(([k, v]) => {
      if (k === "qiRateMult") return `+${Math.round(v * 100)}% Qi/dtk`;
      if (k === "atk") return `+${fmt(v)} ATK`;
      if (k === "def") return `+${fmt(v)} DEF`;
      if (k === "hp")  return `+${fmt(v)} HP`;
      return `${k}:${v}`;
    }).join(", ");

    const card = document.createElement("div");
    card.className = "card" + (locked ? " locked" : "") + (owned ? " owned" : "");
    card.innerHTML = `
      <div class="card-head">
        <span class="card-name">🗡 ${a.name}</span>
        ${owned ? `<span class="card-level">✓ Dimiliki</span>` : ""}
      </div>
      <div class="card-desc">${a.desc}</div>
      <div class="card-effect">${bonusTxt}</div>
      ${owned
        ? `<div class="card-cost" style="color:var(--accent-green)">✓ Terpasang permanen</div>`
        : locked
          ? `<div class="card-cost too-expensive">🔒 Butuh alam ${REALMS[a.unlockRealm].name}</div>`
          : `<div class="card-cost ${affordable ? "" : "too-expensive"}">Biaya: ◈ ${fmt(a.cost)} Batu Roh</div>
             <button class="btn btn-gold" ${!affordable ? "disabled" : ""} onclick="buyArtifact('${a.id}')">Beli</button>`
      }
    `;
    al.appendChild(card);
  }
}

function renderMonster() {
  if (!state.monster) {
    spawnMonster();
    return;
  }
  const m = state.monster;
  document.getElementById("m-name").textContent = m.name;
  document.getElementById("m-hp").textContent = fmt(Math.max(0, m.hp));
  document.getElementById("m-hpmax").textContent = fmt(m.hpMax);
  document.getElementById("m-atk").textContent = fmt(m.atk);
  document.getElementById("m-reward").textContent = fmt(m.reward);
  const pct = Math.max(0, (m.hp / m.hpMax) * 100);
  document.getElementById("m-hpfill").style.width = pct + "%";
}

// ============================================================
// LOGGING
// ============================================================
function log(text, cls) {
  const ul = document.getElementById("log");
  const li = document.createElement("li");
  if (cls) li.className = cls;
  li.textContent = text;
  ul.prepend(li);
  while (ul.children.length > 30) ul.removeChild(ul.lastChild);
}
function battleLog(text, cls) {
  const box = document.getElementById("battle-log");
  const p = document.createElement("p");
  if (cls) p.className = cls;
  p.textContent = text;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}
function clearBattleLog() {
  document.getElementById("battle-log").innerHTML = "";
}

function showResult(title, text) {
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-text").innerHTML = text;
  document.getElementById("modal-result").classList.remove("hidden");
}

// ============================================================
// GAME LOOP
// ============================================================
function tick() {
  const now = Date.now();
  const dt = (now - state.lastTick) / 1000;
  state.lastTick = now;
  state.qi += qiRate() * dt;
  renderQi();
}

setInterval(tick, 1000);
setInterval(save, 15000);

// ============================================================
// EVENT BINDINGS
// ============================================================
document.getElementById("btn-meditate").addEventListener("click", meditate);
document.getElementById("btn-breakthrough").addEventListener("click", tryBreakthrough);
document.getElementById("btn-fight").addEventListener("click", fight);
document.getElementById("btn-next-monster").addEventListener("click", nextMonster);

document.getElementById("btn-trib-accept").addEventListener("click", () => {
  document.getElementById("modal-tribulation").classList.add("hidden");
  doBreakthrough(false);
});
document.getElementById("btn-trib-cancel").addEventListener("click", () => {
  document.getElementById("modal-tribulation").classList.add("hidden");
});
document.getElementById("btn-result-close").addEventListener("click", () => {
  document.getElementById("modal-result").classList.add("hidden");
});

document.getElementById("btn-save").addEventListener("click", () => {
  save();
  log("💾 Permainan tersimpan.", "green");
});
document.getElementById("btn-reset").addEventListener("click", reset);

// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
  });
});

// ============================================================
// INIT
// ============================================================
if (load()) {
  log("☯ Kultivasi dilanjutkan dari catatan lama.", "green");
} else {
  log("☯ Selamat datang, sang pencari keabadian.", "gold");
  log("Tekan 'Bermeditasi' untuk mempercepat pengumpulan Qi.");
}
spawnMonster();
renderAll();

// Save on close
window.addEventListener("beforeunload", save);

/* ============================================================
   JALAN KEABADIAN - Idle Cultivation RPG (v2 with full combat)
   ============================================================ */

// ============================================================
// DATA: REALMS
// ============================================================
const REALMS = [
  { name: "Fana",                 icon: "☯",  baseQi: 100,    trib: 1.00, powerMult: 1 },
  { name: "Pemurnian Qi",         icon: "✦",  baseQi: 500,    trib: 0.95, powerMult: 2 },
  { name: "Pembentukan Fondasi",  icon: "◈",  baseQi: 3000,   trib: 0.88, powerMult: 4 },
  { name: "Inti Emas",            icon: "⚜",  baseQi: 18000,  trib: 0.80, powerMult: 8 },
  { name: "Bayi Nurani",          icon: "❋",  baseQi: 90000,  trib: 0.72, powerMult: 16 },
  { name: "Transformasi Jiwa",    icon: "☸",  baseQi: 500000, trib: 0.63, powerMult: 32 },
  { name: "Kaisar Langit",        icon: "♛",  baseQi: 3000000,trib: 0.54, powerMult: 64 },
  { name: "Dewa Sejati",          icon: "✺",  baseQi: 2e7,    trib: 0.44, powerMult: 128 },
  { name: "Abadi",                icon: "∞",  baseQi: 1.5e8,  trib: 0.30, powerMult: 256 },
];
const STAGES_PER_REALM = 9;
const STAGE_MULT = 1.6;

// ============================================================
// DATA: CLASSES
// ============================================================
const CLASSES = {
  sword: {
    id: "sword",
    name: "Pedang Ksatria",
    icon: "🗡",
    sprite: "🥷",
    desc: "Serangan cepat dan akurat. Spesialis damage fisik.",
    stats: { atkMult: 1.3, defMult: 1.0, hpMult: 1.0, critMult: 1.5, critChance: 0.2 },
    skills: ["slash", "whirlwind", "dragon_strike", "sword_rain"],
  },
  fist: {
    id: "fist",
    name: "Tinju Naga",
    icon: "👊",
    sprite: "🧑‍🎤",
    desc: "Tahan banting, serangan berat. Spesialis HP & DEF.",
    stats: { atkMult: 1.1, defMult: 1.4, hpMult: 1.5, critMult: 1.3, critChance: 0.1 },
    skills: ["power_punch", "iron_body", "dragon_fist", "earth_quake"],
  },
  mage: {
    id: "mage",
    name: "Penyihir Mantra",
    icon: "🔮",
    sprite: "🧙",
    desc: "Damage elemental besar. Area effect & crowd control.",
    stats: { atkMult: 1.5, defMult: 0.8, hpMult: 0.9, critMult: 2.0, critChance: 0.15 },
    skills: ["fireball", "ice_shard", "lightning_bolt", "meteor"],
  },
  healer: {
    id: "healer",
    name: "Tabib Roh",
    icon: "🌿",
    sprite: "🧑‍⚕️",
    desc: "Penyembuh dengan sustain tinggi. Tahan di battle lama.",
    stats: { atkMult: 0.9, defMult: 1.2, hpMult: 1.3, critMult: 1.4, critChance: 0.12 },
    skills: ["heal", "shield", "holy_light", "life_drain"],
  },
};

// ============================================================
// DATA: SKILLS
// ============================================================
const SKILLS = {
  // ===== SWORD =====
  slash:        { name: "Tebasan Kilat",  icon: "⚔",  dmg: 1.6,  cd: 3,  unlock: 0, fx: "fx-slash",     log: "menebas dengan kilat" },
  whirlwind:    { name: "Pusaran Pedang", icon: "🌀", dmg: 2.0,  cd: 8,  unlock: 1, fx: "fx-slash",     log: "melancarkan Pusaran Pedang" },
  dragon_strike:{ name: "Sabetan Naga",   icon: "🐉", dmg: 3.2,  cd: 15, unlock: 3, fx: "fx-dragon",    log: "memanggil Naga Pedang" },
  sword_rain:   { name: "Hujan Pedang",   icon: "☄",  dmg: 4.5,  cd: 25, unlock: 5, fx: "fx-meteor",    log: "menurunkan Hujan Pedang" },

  // ===== FIST =====
  power_punch:  { name: "Tinju Kuat",     icon: "👊", dmg: 1.8,  cd: 3,  unlock: 0, fx: "fx-impact",    log: "memukul dengan Tinju Kuat", impactText: "BAM!" },
  iron_body:    { name: "Tubuh Besi",     icon: "🛡", dmg: 0,    cd: 10, unlock: 1, fx: "fx-shield",    heal: 0.3, log: "mengaktifkan Tubuh Besi" },
  dragon_fist:  { name: "Tinju Naga",     icon: "🐲", dmg: 3.5,  cd: 15, unlock: 3, fx: "fx-impact",    log: "meledakkan Tinju Naga", impactText: "BOOM!" },
  earth_quake:  { name: "Guncangan Bumi", icon: "💥", dmg: 5.0,  cd: 25, unlock: 5, fx: "fx-explosion", log: "mengguncang bumi" },

  // ===== MAGE =====
  fireball:     { name: "Bola Api",       icon: "🔥", dmg: 2.0,  cd: 4,  unlock: 0, fx: "fx-fireball",  log: "melemparkan Bola Api" },
  ice_shard:    { name: "Pecahan Es",     icon: "❄",  dmg: 2.5,  cd: 7,  unlock: 1, fx: "fx-ice",       log: "memanggil Pecahan Es" },
  lightning_bolt:{ name: "Petir Halilintar",icon: "⚡",dmg: 3.5, cd: 12, unlock: 3, fx: "fx-lightning", log: "menurunkan Petir Halilintar" },
  meteor:       { name: "Meteor",         icon: "☄",  dmg: 5.5,  cd: 22, unlock: 5, fx: "fx-meteor",    log: "menjatuhkan Meteor" },

  // ===== HEALER =====
  heal:         { name: "Penyembuhan",    icon: "💚", dmg: 0,    cd: 5,  unlock: 0, fx: "fx-heal",      heal: 0.4, log: "menyembuhkan diri" },
  shield:       { name: "Tameng Roh",     icon: "🛡", dmg: 1.0,  cd: 8,  unlock: 1, fx: "fx-shield",    heal: 0.2, log: "mengaktifkan Tameng Roh" },
  holy_light:   { name: "Cahaya Suci",    icon: "✨", dmg: 2.8,  cd: 14, unlock: 3, fx: "fx-heal",      heal: 0.25, log: "menurunkan Cahaya Suci" },
  life_drain:   { name: "Penyerap Jiwa",  icon: "🌑", dmg: 3.5,  cd: 20, unlock: 5, fx: "fx-void",      heal: 0.5, log: "menyerap jiwa musuh" },
};

// ============================================================
// DATA: REGIONS (maps) & STAGES
// ============================================================
const REGIONS = [
  {
    id: "bamboo", name: "Hutan Bambu Roh", icon: "🎋", bgClass: "bamboo",
    desc: "Hutan damai tempat kultivator pemula berlatih melawan makhluk spiritual.",
    unlockRealm: 0, stages: 10,
    enemies: [
      { name: "Kelinci Roh",    sprite: "🐰", hpMult: 0.8, atkMult: 0.7 },
      { name: "Serigala Bambu", sprite: "🐺", hpMult: 1.0, atkMult: 1.0 },
      { name: "Panda Pukulan",  sprite: "🐼", hpMult: 1.4, atkMult: 1.2 },
      { name: "Monyet Emas",    sprite: "🐒", hpMult: 1.1, atkMult: 1.1 },
    ],
    boss: { name: "Raja Bambu Ribuan Tahun", sprite: "🐉", hpMult: 6.0, atkMult: 2.5 },
    rewardMult: 1.0,
  },
  {
    id: "desert", name: "Padang Pasir Iblis", icon: "🏜", bgClass: "desert",
    desc: "Gurun terik dipenuhi iblis haus darah dan siluman pasir.",
    unlockRealm: 1, stages: 10,
    enemies: [
      { name: "Kalajengking Pasir", sprite: "🦂", hpMult: 1.0, atkMult: 1.2 },
      { name: "Ular Berbisa",       sprite: "🐍", hpMult: 1.2, atkMult: 1.3 },
      { name: "Siluman Pasir",      sprite: "👹", hpMult: 1.5, atkMult: 1.4 },
      { name: "Mumia Kuno",         sprite: "🧟", hpMult: 1.8, atkMult: 1.3 },
    ],
    boss: { name: "Firaun Iblis Abadi", sprite: "👺", hpMult: 8.0, atkMult: 3.0 },
    rewardMult: 1.8,
  },
  {
    id: "ice", name: "Puncak Es Kekal", icon: "🏔", bgClass: "ice",
    desc: "Gunung membeku abadi, rumah naga es dan siluman salju.",
    unlockRealm: 2, stages: 10,
    enemies: [
      { name: "Yeti Salju",        sprite: "🦍", hpMult: 1.4, atkMult: 1.3 },
      { name: "Serigala Beku",     sprite: "🐺", hpMult: 1.5, atkMult: 1.5 },
      { name: "Elang Badai Salju", sprite: "🦅", hpMult: 1.3, atkMult: 1.8 },
      { name: "Siluman Es",        sprite: "❄",  hpMult: 1.8, atkMult: 1.4 },
    ],
    boss: { name: "Naga Es Sembilan Kepala", sprite: "🐲", hpMult: 10.0, atkMult: 3.5 },
    rewardMult: 3.0,
  },
  {
    id: "volcano", name: "Gunung Api Leluhur", icon: "🌋", bgClass: "volcano",
    desc: "Kawah lava tempat naga api dan phoenix bersemayam.",
    unlockRealm: 3, stages: 10,
    enemies: [
      { name: "Siluman Api",        sprite: "🔥", hpMult: 1.8, atkMult: 1.8 },
      { name: "Kadal Lava",         sprite: "🦎", hpMult: 2.0, atkMult: 1.7 },
      { name: "Phoenix Kecil",      sprite: "🦩", hpMult: 1.7, atkMult: 2.2 },
      { name: "Iblis Api Neraka",   sprite: "😈", hpMult: 2.2, atkMult: 2.0 },
    ],
    boss: { name: "Kaisar Phoenix Agung", sprite: "🦚", hpMult: 12.0, atkMult: 4.0 },
    rewardMult: 5.0,
  },
  {
    id: "heaven", name: "Lorong Surgawi", icon: "☁", bgClass: "heaven",
    desc: "Jalan menuju langit, dijaga dewa-dewa dan pengawal kahyangan.",
    unlockRealm: 4, stages: 10,
    enemies: [
      { name: "Bidadari Perang",   sprite: "👼", hpMult: 2.5, atkMult: 2.3 },
      { name: "Qilin Langit",      sprite: "🦄", hpMult: 3.0, atkMult: 2.5 },
      { name: "Dewa Perang Muda",  sprite: "⚔",  hpMult: 2.8, atkMult: 2.8 },
      { name: "Naga Putih Surgawi",sprite: "🐉", hpMult: 3.2, atkMult: 2.6 },
    ],
    boss: { name: "Dewa Perang Xing Tian", sprite: "👹", hpMult: 15.0, atkMult: 4.5 },
    rewardMult: 8.0,
  },
  {
    id: "underworld", name: "Neraka Sembilan Lapis", icon: "💀", bgClass: "underworld",
    desc: "Jurang kegelapan tempat iblis kuno bersemayam.",
    unlockRealm: 5, stages: 10,
    enemies: [
      { name: "Roh Jahat",         sprite: "👻", hpMult: 3.5, atkMult: 3.2 },
      { name: "Iblis Berduri",     sprite: "😈", hpMult: 4.0, atkMult: 3.5 },
      { name: "Jenderal Neraka",   sprite: "🤖", hpMult: 4.5, atkMult: 3.6 },
      { name: "Iblis Berkabut",    sprite: "💀", hpMult: 4.2, atkMult: 4.0 },
    ],
    boss: { name: "Raja Yama - Pengadil Jiwa", sprite: "👿", hpMult: 20.0, atkMult: 5.5 },
    rewardMult: 14.0,
  },
  {
    id: "void", name: "Kekosongan Abadi", icon: "🌌", bgClass: "void",
    desc: "Dimensi tak terjamah, tempat kultivator paling kuat berdiam.",
    unlockRealm: 7, stages: 10,
    enemies: [
      { name: "Kultivator Tersesat", sprite: "🧙", hpMult: 5.0, atkMult: 5.0 },
      { name: "Bayangan Dewa",       sprite: "🥷", hpMult: 6.0, atkMult: 5.5 },
      { name: "Entitas Kosong",      sprite: "👁",  hpMult: 6.5, atkMult: 6.0 },
      { name: "Pemakan Bintang",     sprite: "🌟", hpMult: 7.0, atkMult: 6.2 },
    ],
    boss: { name: "Penguasa Kehampaan", sprite: "🕳", hpMult: 30.0, atkMult: 8.0 },
    rewardMult: 25.0,
  },
];

// ============================================================
// DATA: TECHNIQUES
// ============================================================
const TECHNIQUES = [
  { id: "t1", name: "Nafas Angin Pagi",     desc: "Teknik pernapasan dasar.",         baseCost: 50,     rateBonus: 1,    maxLvl: 50 },
  { id: "t2", name: "Mata Langit",          desc: "Penglihatan konsentrasi.",         baseCost: 300,    rateBonus: 5,    maxLvl: 50, unlockRealm: 1 },
  { id: "t3", name: "Hati Gunung Tenang",   desc: "Meditasi tingkat tinggi.",         baseCost: 2000,   rateBonus: 25,   maxLvl: 50, unlockRealm: 2 },
  { id: "t4", name: "Inti Api Merah",       desc: "Esensi qi murni.",                 baseCost: 15000,  rateBonus: 120,  maxLvl: 50, unlockRealm: 3 },
  { id: "t5", name: "Sembilan Naga Langit", desc: "Warisan dewa kuno.",               baseCost: 100000, rateBonus: 600,  maxLvl: 50, unlockRealm: 4 },
  { id: "t6", name: "Jiwa Kekosongan",      desc: "Memahami kosong.",                 baseCost: 800000, rateBonus: 3200, maxLvl: 50, unlockRealm: 5 },
  { id: "t7", name: "Dharma Abadi",         desc: "Hukum langit di jiwa.",            baseCost: 6e6,    rateBonus: 18000,maxLvl: 50, unlockRealm: 6 },
];

// ============================================================
// DATA: PILLS
// ============================================================
const PILLS = [
  { id: "p1", name: "Pil Qi Ringan",       desc: "+200 Qi instan.",          cost: 20,    effect: "qi",   value: 200 },
  { id: "p2", name: "Pil Akar Bunga Roh",  desc: "+2000 Qi instan.",         cost: 150,   effect: "qi",   value: 2000 },
  { id: "p3", name: "Pil Jantung Phoenix", desc: "+20000 Qi instan.",        cost: 800,   effect: "qi",   value: 20000 },
  { id: "p4", name: "Pil Naga Langit",     desc: "+200000 Qi instan.",       cost: 5000,  effect: "qi",   value: 200000 },
  { id: "p5", name: "Pil Peruntungan",     desc: "Peluang terobosan +15%.",  cost: 500,   effect: "luck", value: 0.15 },
  { id: "p6", name: "Pil Takdir Agung",    desc: "Peluang terobosan +35%.",  cost: 3500,  effect: "luck", value: 0.35 },
];

// ============================================================
// DATA: ARTIFACTS
// ============================================================
const ARTIFACTS = [
  { id: "a1", name: "Pedang Kayu Peach",     desc: "Pusaka murid awal.",       cost: 500,    bonus: { atk: 10, def: 5 },       unlockRealm: 1 },
  { id: "a2", name: "Jubah Awan Ungu",       desc: "Tenun sutra roh.",          cost: 5000,   bonus: { def: 30, hp: 100 },      unlockRealm: 2 },
  { id: "a3", name: "Gong Matahari",         desc: "Membuka sumbatan Qi.",      cost: 25000,  bonus: { qiRateMult: 0.25 },      unlockRealm: 3 },
  { id: "a4", name: "Cincin Penelan Langit", desc: "Menyimpan Qi semesta.",     cost: 200000, bonus: { qiRateMult: 0.5, atk: 100 }, unlockRealm: 4 },
  { id: "a5", name: "Tombak Bayangan Qilin", desc: "Darah Qilin mengalir.",     cost: 2e6,    bonus: { atk: 1000, def: 500 },   unlockRealm: 5 },
  { id: "a6", name: "Pagoda Sembilan Lantai",desc: "Menara pusaka sekte kuno.", cost: 2e7,    bonus: { qiRateMult: 1.0, hp: 10000 }, unlockRealm: 6 },
];

// ============================================================
// STATE
// ============================================================
const defaultState = () => ({
  qi: 0,
  stones: 0,
  realm: 0,
  stage: 0,
  techniques: {},
  artifacts: [],
  totalBreakthroughs: 0,
  totalKills: 0,
  luckBuff: 0,
  lastSave: Date.now(),
  lastTick: Date.now(),

  // Class + combat
  classId: null,                 // "sword" | "fist" | "mage" | "healer" | null
  regionId: "bamboo",
  regionStage: 0,                // 0..9 (10 = cleared)
  enemiesKilled: 0,              // within current stage
  enemiesPerStage: 5,

  playerHp: 0,
  enemy: null,                   // current enemy {name, sprite, hp, hpMax, atk, def, isBoss, reward}
  autoBattle: false,
  skillCd: {},                   // id -> ms remaining
  clearedStages: {},             // regionId -> highest cleared stage (0..10)
});

let state = defaultState();
const SAVE_KEY = "cultivation_idle_save_v2";
let autoTimer = null;

// ============================================================
// SAVE / LOAD / RESET
// ============================================================
function save() {
  state.lastSave = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function load() {
  // Try v2 first, then migrate from v1
  let raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    const v1 = localStorage.getItem("cultivation_idle_save_v1");
    if (v1) { raw = v1; log("🔄 Save lama dimigrasikan ke versi baru.", "green"); }
  }
  if (!raw) return false;
  try {
    const loaded = JSON.parse(raw);
    state = Object.assign(defaultState(), loaded);
    if (!state.clearedStages) state.clearedStages = {};
    if (!state.skillCd) state.skillCd = {};
    if (!state.regionId) state.regionId = "bamboo";

    // Offline progress (Qi only)
    const now = Date.now();
    const elapsed = Math.min((now - (state.lastTick || now)) / 1000, 3 * 3600);
    if (elapsed > 10) {
      const gain = Math.floor(elapsed * qiRate());
      state.qi += gain;
      log(`💤 Retret: +${fmt(gain)} Qi selama ${Math.floor(elapsed/60)} menit.`, "gold");
    }
    state.lastTick = now;
    return true;
  } catch (e) { console.warn("Load failed:", e); return false; }
}
function reset() {
  if (!confirm("Hapus SEMUA progres? Tidak bisa dibatalkan!")) return;
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem("cultivation_idle_save_v1");
  state = defaultState();
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  renderAll();
  log("⟲ Perjalanan dimulai dari awal.", "danger");
}

// ============================================================
// FORMULAS
// ============================================================
function qiNeeded() {
  const r = REALMS[state.realm];
  return Math.floor(r.baseQi * Math.pow(STAGE_MULT, state.stage));
}
function qiRate() {
  let base = 1 + state.realm * 2;
  for (const t of TECHNIQUES) {
    const lvl = state.techniques[t.id] || 0;
    base += lvl * t.rateBonus;
  }
  let mult = 1;
  for (const aid of state.artifacts) {
    const a = ARTIFACTS.find(x => x.id === aid);
    if (a && a.bonus.qiRateMult) mult += a.bonus.qiRateMult;
  }
  return Math.floor(base * mult);
}
function playerPower() {
  const r = REALMS[state.realm];
  const cls = CLASSES[state.classId] || null;
  let atk = 5 + state.realm * 10 + state.stage * 3;
  let def = 3 + state.realm * 7 + state.stage * 2;
  let hp  = 50 + state.realm * 100 + state.stage * 20;
  atk *= r.powerMult;
  def *= r.powerMult;
  hp  *= r.powerMult;
  if (cls) {
    atk *= cls.stats.atkMult;
    def *= cls.stats.defMult;
    hp  *= cls.stats.hpMult;
  }
  for (const aid of state.artifacts) {
    const a = ARTIFACTS.find(x => x.id === aid);
    if (a) {
      atk += a.bonus.atk || 0;
      def += a.bonus.def || 0;
      hp  += a.bonus.hp  || 0;
    }
  }
  return { atk: Math.floor(atk), def: Math.floor(def), hp: Math.floor(hp),
           critChance: cls ? cls.stats.critChance : 0.1,
           critMult:   cls ? cls.stats.critMult   : 1.5 };
}
function breakthroughChance() {
  const r = REALMS[state.realm];
  if (state.stage < STAGES_PER_REALM - 1) return 1.0;
  return Math.min(0.99, r.trib + state.luckBuff);
}

// ============================================================
// FORMAT
// ============================================================
function fmt(n) {
  if (n < 1000) return Math.floor(n).toString();
  const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
  let u = 0;
  while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
  return n.toFixed(n < 10 ? 2 : 1) + units[u];
}

// ============================================================
// CORE ACTIONS: meditate + breakthrough
// ============================================================
function meditate() {
  const bonus = Math.max(1, Math.floor(qiRate() * 2));
  state.qi += bonus;
  log(`☯ Meditasi: +${fmt(bonus)} Qi`);
  renderQi(); renderStats();
}
function tryBreakthrough() {
  const need = qiNeeded();
  if (state.qi < need) { log("Qi tidak cukup.", "danger"); return; }
  if (state.stage < STAGES_PER_REALM - 1) doBreakthrough(true);
  else openTribulation();
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
    const lost = Math.floor(state.qi * 0.3);
    state.qi -= lost; state.luckBuff = 0;
    log(`⚡ GAGAL! Qi hilang ${fmt(lost)}.`, "danger");
    showResult("💥 Terobosan Gagal", `Bencana petir terlalu kuat! Kamu kehilangan ${fmt(lost)} Qi. Coba lagi setelah memulihkan.`);
    renderAll(); return;
  }
  state.qi -= need; state.totalBreakthroughs++; state.luckBuff = 0;
  if (state.stage < STAGES_PER_REALM - 1) {
    state.stage++;
    log(`✦ Terobosan berhasil! ${REALMS[state.realm].name} Tingkat ${state.stage + 1}`, "gold");
  } else {
    if (state.realm < REALMS.length - 1) {
      state.realm++; state.stage = 0;
      const r = REALMS[state.realm];
      log(`🌩 Melampaui bencana! Kini ${r.name}!`, "gold");
      showResult(`⚡ Memasuki ${r.name}!`, `Jiwamu ditempa petir. Kamu kini kultivator ${r.name}.`);
    } else {
      log(`∞ TELAH MENCAPAI KEABADIAN SEJATI!`, "gold");
      showResult("∞ KEABADIAN!", "Kamu mencapai puncak tertinggi kultivasi!");
    }
  }
  // Restore HP on breakthrough
  const pl = playerPower();
  state.playerHp = pl.hp;
  renderAll();
}

// ============================================================
// CLASS
// ============================================================
function selectClass(id) {
  state.classId = id;
  state.skillCd = {};
  const pl = playerPower();
  state.playerHp = pl.hp;
  log(`🎭 Kamu memilih kelas ${CLASSES[id].name}!`, "gold");
  renderAll();
  // switch to adventure tab
  switchTab("adventure");
}

// ============================================================
// SHOPS: techniques, pills, artifacts
// ============================================================
function buyTechnique(id) {
  const t = TECHNIQUES.find(x => x.id === id); if (!t) return;
  const lvl = state.techniques[id] || 0;
  if (lvl >= t.maxLvl) return;
  const cost = Math.floor(t.baseCost * Math.pow(1.35, lvl));
  if (state.stones < cost) { log(`Batu Roh kurang (${fmt(cost)}).`, "danger"); return; }
  state.stones -= cost; state.techniques[id] = lvl + 1;
  log(`🌀 ${t.name} → Lv.${lvl + 1}`, "green");
  renderAll();
}
function buyPill(id) {
  const p = PILLS.find(x => x.id === id); if (!p) return;
  if (state.stones < p.cost) { log(`Batu Roh kurang (${fmt(p.cost)}).`, "danger"); return; }
  state.stones -= p.cost;
  if (p.effect === "qi") { state.qi += p.value; log(`💊 ${p.name}: +${fmt(p.value)} Qi`, "green"); }
  else if (p.effect === "luck") { state.luckBuff = Math.max(state.luckBuff, p.value); log(`🌟 ${p.name}: +${Math.round(p.value * 100)}% peluang`, "green"); }
  renderAll();
}
function buyArtifact(id) {
  const a = ARTIFACTS.find(x => x.id === id); if (!a) return;
  if (state.artifacts.includes(id)) return;
  if (state.realm < (a.unlockRealm || 0)) return;
  if (state.stones < a.cost) { log(`Batu Roh kurang (${fmt(a.cost)}).`, "danger"); return; }
  state.stones -= a.cost; state.artifacts.push(id);
  log(`🗡 Memperoleh ${a.name}!`, "gold");
  renderAll();
}

// ============================================================
// COMBAT SYSTEM
// ============================================================
function getRegion() { return REGIONS.find(r => r.id === state.regionId) || REGIONS[0]; }
function isRegionUnlocked(region) { return state.realm >= region.unlockRealm; }

function selectRegion(id) {
  const r = REGIONS.find(x => x.id === id); if (!r || !isRegionUnlocked(r)) return;
  state.regionId = id;
  state.regionStage = state.clearedStages[id] || 0;
  state.enemiesKilled = 0;
  spawnEnemy();
  renderAll();
}

function spawnEnemy() {
  const region = getRegion();
  const pl = playerPower();
  const stage = state.regionStage;
  const isBoss = state.enemiesKilled >= state.enemiesPerStage;
  const tmpl = isBoss
    ? region.boss
    : region.enemies[Math.floor(Math.random() * region.enemies.length)];

  const stageMult = 1 + stage * 0.25;
  const hp  = Math.floor(pl.hp  * 0.5 * tmpl.hpMult  * stageMult);
  const atk = Math.floor(pl.atk * 0.4 * tmpl.atkMult * stageMult);
  const def = Math.floor(pl.def * 0.3 * tmpl.hpMult  * stageMult);
  const reward = Math.floor((5 + state.realm * 20 + stage * 8) * region.rewardMult * (isBoss ? 10 : 1));

  state.enemy = {
    name: tmpl.name, sprite: tmpl.sprite,
    hp, hpMax: hp, atk, def,
    isBoss, reward,
  };
  renderBattle();
  clearBattleLog();
  if (isBoss) battleLog(`👑 BOSS muncul: ${tmpl.name}!`, "lose");
  else        battleLog(`Musuh muncul: ${tmpl.name}`, "enemy");
}

function playerAttack(skillId) {
  if (!state.classId) { log("Pilih kelas dulu di tab 🎭 Kelas!", "danger"); switchTab("class"); return; }
  if (!state.enemy || state.enemy.hp <= 0) { spawnEnemy(); return; }

  const pl = playerPower();
  const e = state.enemy;
  const pf = document.getElementById("player-fighter");
  const ef = document.getElementById("enemy-fighter");

  // Apply skill or basic
  let dmg = 0;
  let isCrit = false;
  let healAmt = 0;
  let skillName = null;
  let skillLog = null;

  if (skillId) {
    const sk = SKILLS[skillId]; if (!sk) return;
    const cd = state.skillCd[skillId] || 0;
    if (cd > 0) { log(`${sk.name} masih cooldown.`, "danger"); return; }
    state.skillCd[skillId] = sk.cd * 1000;
    playFx(sk.fx, sk.impactText);
    skillName = sk.name;
    skillLog = sk.log;
    if (sk.dmg > 0) {
      dmg = Math.floor(pl.atk * sk.dmg);
      isCrit = Math.random() < pl.critChance;
      if (isCrit) dmg = Math.floor(dmg * pl.critMult);
    }
    if (sk.heal) {
      healAmt = Math.floor(pl.hp * sk.heal);
      state.playerHp = Math.min(pl.hp, state.playerHp + healAmt);
    }
    battleLog(`✨ Kamu ${sk.log}!`, "skill");
  } else {
    // basic attack
    dmg = Math.max(1, pl.atk - Math.floor(e.def * 0.5) + Math.floor(Math.random() * pl.atk * 0.2));
    isCrit = Math.random() < pl.critChance;
    if (isCrit) dmg = Math.floor(dmg * pl.critMult);
  }

  // Animate
  pf.classList.add("attack-anim");
  setTimeout(() => pf.classList.remove("attack-anim"), 400);

  if (dmg > 0) {
    dmg = Math.max(1, dmg - Math.floor(e.def * 0.3));
    e.hp -= dmg;
    setTimeout(() => {
      ef.classList.add("hurt-anim");
      setTimeout(() => ef.classList.remove("hurt-anim"), 300);
      showDamage(ef, dmg, "enemy", isCrit);
      if (isCrit) shakeArena();
    }, 200);
    battleLog(`⚔ Kamu ${skillName ? "(" + skillName + ")" : "menyerang"} -${fmt(dmg)} HP${isCrit ? " ⭐ CRIT!" : ""}`, "you");
  }
  if (healAmt > 0) {
    showDamage(pf, healAmt, "heal", false);
    battleLog(`💚 Memulihkan ${fmt(healAmt)} HP`, "skill");
  }

  // Check kill
  if (e.hp <= 0) {
    ef.classList.add("dead");
    battleLog(`🎉 ${e.name} dikalahkan! +${fmt(e.reward)} Batu Roh`, "win");
    state.stones += e.reward;
    state.totalKills++;
    state.enemiesKilled++;
    renderStats(); renderShops();

    const region = getRegion();
    const wasBoss = e.isBoss;
    state.enemy = null;
    save();

    if (wasBoss) {
      // Stage cleared
      const prev = state.clearedStages[state.regionId] || 0;
      if (state.regionStage + 1 > prev) state.clearedStages[state.regionId] = state.regionStage + 1;
      log(`🏆 Stage ${state.regionStage + 1} di ${region.name} BERHASIL DITAKLUKKAN!`, "gold");
      battleLog(`🏆 STAGE CLEAR! Hadiah bonus diterima.`, "win");
      state.stones += e.reward * 2; // boss bonus
      if (state.regionStage < region.stages - 1) {
        state.regionStage++;
      } else {
        showResult(`🏆 ${region.name} BERES!`, `Semua stage dan boss di ${region.name} telah kamu taklukkan!`);
      }
      state.enemiesKilled = 0;
    } else if (state.enemiesKilled === state.enemiesPerStage) {
      battleLog(`👑 Boss akan segera muncul!`, "lose");
    }

    setTimeout(() => {
      ef.classList.remove("dead");
      if (state.autoBattle) spawnEnemy();
      else renderAdventureUI(false); // show next enemy button via spawn
      spawnEnemy();
    }, 900);
    return;
  }

  // Enemy counter-attack
  setTimeout(enemyAttack, 500);
}

function enemyAttack() {
  const pl = playerPower();
  const e = state.enemy;
  if (!e || e.hp <= 0) return;
  const ef = document.getElementById("enemy-fighter");
  const pf = document.getElementById("player-fighter");
  ef.classList.add("attack-anim");
  setTimeout(() => ef.classList.remove("attack-anim"), 400);

  const hit = Math.random() > 0.08; // 8% dodge
  if (!hit) {
    showDamage(pf, 0, "miss", false);
    battleLog(`💨 Kamu menghindar!`, "you");
    return;
  }

  let dmg = Math.max(1, e.atk - Math.floor(pl.def * 0.6) + Math.floor(Math.random() * e.atk * 0.2));
  state.playerHp -= dmg;

  setTimeout(() => {
    pf.classList.add("hurt-anim");
    setTimeout(() => pf.classList.remove("hurt-anim"), 300);
    showDamage(pf, dmg, "player", false);
  }, 150);
  battleLog(`🩸 ${e.name} menyerang -${fmt(dmg)} HP`, "enemy");

  if (state.playerHp <= 0) {
    state.playerHp = Math.floor(pl.hp * 0.5); // revive at 50% hp
    battleLog(`💀 Kamu kalah! Kultivasimu melindungimu dari kematian (HP 50%).`, "lose");
    log(`💀 Pertempuran kalah. Kembali ke stage awal region.`, "danger");
    state.enemiesKilled = 0;
    if (state.autoBattle) toggleAuto();
    state.enemy = null;
    setTimeout(spawnEnemy, 1000);
  }
  renderBattle();
}

function basicAttack() { playerAttack(null); }
function fleeBattle() {
  state.enemy = null;
  const pl = playerPower();
  state.playerHp = pl.hp;
  log("🏃 Kabur dari pertempuran.", "danger");
  spawnEnemy();
}
function toggleAuto() {
  state.autoBattle = !state.autoBattle;
  document.getElementById("btn-auto").textContent = state.autoBattle ? "⚙ Auto: ON" : "⚙ Auto: Off";
  if (state.autoBattle) {
    autoTimer = setInterval(() => {
      if (!state.enemy || state.enemy.hp <= 0) { spawnEnemy(); return; }
      // Try skills first
      if (state.classId) {
        const cls = CLASSES[state.classId];
        const available = cls.skills.filter(sid => {
          const sk = SKILLS[sid];
          return state.realm >= sk.unlock && (state.skillCd[sid] || 0) <= 0;
        });
        if (available.length) {
          playerAttack(available[Math.floor(Math.random() * available.length)]);
          return;
        }
      }
      basicAttack();
    }, 1200);
  } else if (autoTimer) {
    clearInterval(autoTimer); autoTimer = null;
  }
}

// ============================================================
// VISUAL EFFECTS
// ============================================================
function showDamage(fighterEl, amount, type, isCrit) {
  const rect = fighterEl.getBoundingClientRect();
  const arena = document.getElementById("battle-arena");
  const arenaRect = arena.getBoundingClientRect();
  const d = document.createElement("div");
  d.className = "damage-number " + type + (isCrit ? " crit" : "");
  if (type === "miss") d.textContent = "MISS";
  else if (type === "heal") d.textContent = "+" + fmt(amount);
  else d.textContent = "-" + fmt(amount);
  const x = rect.left - arenaRect.left + rect.width / 2 + (Math.random() * 30 - 15);
  const y = rect.top - arenaRect.top + 20;
  d.style.left = x + "px";
  d.style.top = y + "px";
  arena.appendChild(d);
  setTimeout(() => d.remove(), 1200);
}

function playFx(className, impactText) {
  const layer = document.getElementById("effect-layer");
  const fx = document.createElement("div");
  fx.className = "fx " + className;
  if (className === "fx-impact" && impactText) fx.textContent = impactText;
  if (className === "fx-dragon") fx.textContent = "🐉";
  layer.appendChild(fx);
  setTimeout(() => fx.remove(), 1200);
}
function shakeArena() {
  const a = document.getElementById("battle-arena");
  a.classList.add("shake");
  setTimeout(() => a.classList.remove("shake"), 300);
}

// ============================================================
// RENDER
// ============================================================
function renderAll() {
  renderQi(); renderStats(); renderShops(); renderClasses();
  renderSkills(); renderMap(); renderStageInfo();
  renderBattle(); renderSkillBar();
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
  if (state.stage === STAGES_PER_REALM - 1) btn.textContent = `⚡ Bencana Petir (${Math.round(breakthroughChance() * 100)}%)`;
  else btn.textContent = `✦ Terobosan Tingkat ${state.stage + 2}`;
}
function renderStats() {
  const pl = playerPower();
  const r = REALMS[state.realm];
  const cls = CLASSES[state.classId];
  document.getElementById("realm-name").textContent = `${r.icon} ${r.name}`;
  document.getElementById("realm-stage").textContent = `Tingkat ${state.stage + 1} / ${STAGES_PER_REALM}`;
  document.getElementById("class-label").textContent = cls ? `${cls.icon} ${cls.name}` : "Pilih kelas dulu!";
  document.getElementById("avatar").textContent = cls ? cls.sprite : r.icon;
  document.getElementById("stat-atk").textContent = fmt(pl.atk);
  document.getElementById("stat-def").textContent = fmt(pl.def);
  document.getElementById("stat-hp").textContent = fmt(pl.hp);
  document.getElementById("stat-power").textContent = fmt(pl.atk + pl.def + Math.floor(pl.hp / 10));
}

function renderClasses() {
  const grid = document.getElementById("class-grid");
  grid.innerHTML = "";
  for (const id in CLASSES) {
    const c = CLASSES[id];
    const sel = state.classId === id;
    const card = document.createElement("div");
    card.className = "class-card" + (sel ? " selected" : "");
    card.onclick = () => selectClass(id);
    card.innerHTML = `
      <span class="class-icon">${c.sprite}</span>
      <h4>${c.icon} ${c.name}</h4>
      <p>${c.desc}</p>
      <div class="class-stats">
        ATK ×${c.stats.atkMult} / DEF ×${c.stats.defMult} / HP ×${c.stats.hpMult}<br/>
        Crit: ${Math.round(c.stats.critChance * 100)}% × ${c.stats.critMult}
      </div>
      ${sel ? '<div style="margin-top:10px;color:var(--accent-green);font-weight:700">✓ Terpilih</div>' : ''}
    `;
    grid.appendChild(card);
  }
}

function renderSkills() {
  const list = document.getElementById("skills-list");
  list.innerHTML = "";
  if (!state.classId) {
    list.innerHTML = `<p style="color:var(--text-dim)">Pilih kelas dulu di tab 🎭 Kelas.</p>`;
    return;
  }
  const cls = CLASSES[state.classId];
  for (const sid of cls.skills) {
    const sk = SKILLS[sid];
    const locked = state.realm < sk.unlock;
    const card = document.createElement("div");
    card.className = "card" + (locked ? " locked" : " owned");
    card.innerHTML = `
      <div class="card-head">
        <span class="card-name">${sk.icon} ${sk.name}</span>
        ${locked ? `<span class="card-level" style="color:var(--accent-danger);background:rgba(255,93,122,0.1)">🔒 ${REALMS[sk.unlock].name}</span>` : `<span class="card-level">✓ Terbuka</span>`}
      </div>
      <div class="card-desc">${sk.log ? "Skill: " + sk.log : ""}</div>
      <div class="card-effect">
        ${sk.dmg > 0 ? `⚔ Damage ×${sk.dmg}` : ""}
        ${sk.heal ? ` 💚 Heal ${Math.round(sk.heal * 100)}%` : ""}
        <br/>⏱ Cooldown ${sk.cd}s
      </div>
    `;
    list.appendChild(card);
  }
}

function renderMap() {
  const container = document.getElementById("map-container");
  container.innerHTML = "";
  for (const r of REGIONS) {
    const unlocked = isRegionUnlocked(r);
    const cleared = state.clearedStages[r.id] || 0;
    const active = state.regionId === r.id;
    const card = document.createElement("div");
    card.className = "region-card" + (unlocked ? "" : " locked") + (active ? " active" : "");
    card.onclick = () => unlocked && selectRegion(r.id);
    card.innerHTML = `
      <span class="region-icon">${r.icon}</span>
      <div class="region-name">${r.name}</div>
      <div class="region-progress">
        ${unlocked ? `Stage ${cleared}/${r.stages}` : `🔒 Butuh ${REALMS[r.unlockRealm].name}`}
      </div>
    `;
    container.appendChild(card);
  }
}

function renderStageInfo() {
  const region = getRegion();
  document.getElementById("region-title").textContent = `${region.icon} ${region.name}`;
  document.getElementById("region-desc").textContent = region.desc;
  document.getElementById("stage-title").textContent = `Stage ${state.regionStage + 1} / ${region.stages}`;

  const onBoss = state.enemiesKilled >= state.enemiesPerStage;
  document.getElementById("stage-progress").innerHTML = onBoss
    ? `<span class="stage-boss">👑 BOSS FIGHT!</span>`
    : `Musuh ${state.enemiesKilled} / ${state.enemiesPerStage}`;

  document.getElementById("stage-reward").textContent = state.enemy ? `◈ ${fmt(state.enemy.reward)}` : "-";

  // Stage dots (progress within stage: 5 mobs + 1 boss)
  const dots = document.getElementById("stage-dots");
  dots.innerHTML = "";
  for (let i = 0; i < state.enemiesPerStage; i++) {
    const d = document.createElement("div");
    d.className = "stage-dot" + (i < state.enemiesKilled ? " done" : (i === state.enemiesKilled && !onBoss ? " active" : ""));
    d.textContent = i + 1;
    dots.appendChild(d);
  }
  const boss = document.createElement("div");
  boss.className = "stage-dot boss" + (onBoss ? " active" : "");
  boss.textContent = "👑";
  dots.appendChild(boss);

  // Arena bg
  const bg = document.getElementById("arena-bg");
  bg.className = "arena-bg " + region.bgClass;
}

function renderBattle() {
  const pl = playerPower();
  const cls = CLASSES[state.classId];
  const pSpr = document.getElementById("player-sprite");
  pSpr.textContent = cls ? cls.sprite : "🧘";
  document.getElementById("player-name").textContent = cls ? cls.name : "Kultivator";
  const pHpMax = pl.hp;
  if (state.playerHp <= 0 || state.playerHp > pHpMax) state.playerHp = pHpMax;
  document.getElementById("player-hp").textContent = fmt(state.playerHp);
  document.getElementById("player-hpmax").textContent = fmt(pHpMax);
  document.getElementById("player-hpfill").style.width = Math.max(0, (state.playerHp / pHpMax) * 100) + "%";

  if (state.enemy) {
    document.getElementById("enemy-sprite").textContent = state.enemy.sprite;
    const label = state.enemy.isBoss ? `${state.enemy.name}` : state.enemy.name;
    document.getElementById("enemy-name").innerHTML = state.enemy.isBoss
      ? `${label} <span class="boss-indicator">BOSS</span>`
      : label;
    document.getElementById("enemy-hp").textContent = fmt(Math.max(0, state.enemy.hp));
    document.getElementById("enemy-hpmax").textContent = fmt(state.enemy.hpMax);
    document.getElementById("enemy-hpfill").style.width = Math.max(0, (state.enemy.hp / state.enemy.hpMax) * 100) + "%";
  }
}

function renderSkillBar() {
  const bar = document.getElementById("skill-bar");
  bar.innerHTML = "";
  if (!state.classId) {
    bar.innerHTML = '<div style="color:var(--text-dim);font-size:12px">Pilih kelas dulu untuk unlock skill!</div>';
    return;
  }
  const cls = CLASSES[state.classId];
  cls.skills.forEach((sid, idx) => {
    const sk = SKILLS[sid];
    const locked = state.realm < sk.unlock;
    const cd = Math.ceil((state.skillCd[sid] || 0) / 1000);
    const btn = document.createElement("button");
    btn.className = "skill-btn" + (cd > 0 ? " on-cd" : "");
    btn.disabled = locked || cd > 0;
    btn.title = `${sk.name} (CD ${sk.cd}s)` + (locked ? ` - Butuh ${REALMS[sk.unlock].name}` : "");
    btn.innerHTML = `
      <span class="skill-key">${idx + 1}</span>
      <span class="skill-icon">${locked ? "🔒" : sk.icon}</span>
      <span class="skill-name">${locked ? "Locked" : sk.name}</span>
      ${cd > 0 ? `<span class="skill-cd">${cd}</span>` : ""}
    `;
    btn.onclick = () => playerAttack(sid);
    bar.appendChild(btn);
  });
}

function renderShops() {
  // Techniques
  const tl = document.getElementById("techniques-list"); tl.innerHTML = "";
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
      ${locked ? `<div class="card-cost too-expensive">🔒 Butuh ${REALMS[t.unlockRealm].name}</div>`
        : maxed ? `<div class="card-cost" style="color:var(--accent-green)">✓ MAKSIMAL</div>`
        : `<div class="card-cost ${affordable ? "" : "too-expensive"}">Biaya: ◈ ${fmt(cost)}</div>
           <button class="btn btn-primary" ${!affordable ? "disabled" : ""} onclick="buyTechnique('${t.id}')">Pelajari</button>`}
    `;
    tl.appendChild(card);
  }
  // Pills
  const pl = document.getElementById("pills-list"); pl.innerHTML = "";
  for (const p of PILLS) {
    const affordable = state.stones >= p.cost;
    const card = document.createElement("div"); card.className = "card";
    card.innerHTML = `
      <div class="card-head"><span class="card-name">💊 ${p.name}</span></div>
      <div class="card-desc">${p.desc}</div>
      <div class="card-cost ${affordable ? "" : "too-expensive"}">Biaya: ◈ ${fmt(p.cost)}</div>
      <button class="btn btn-primary" ${!affordable ? "disabled" : ""} onclick="buyPill('${p.id}')">Konsumsi</button>
    `;
    pl.appendChild(card);
  }
  // Artifacts
  const al = document.getElementById("artifacts-list"); al.innerHTML = "";
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
      ${owned ? `<div class="card-cost" style="color:var(--accent-green)">✓ Terpasang</div>`
        : locked ? `<div class="card-cost too-expensive">🔒 Butuh ${REALMS[a.unlockRealm].name}</div>`
        : `<div class="card-cost ${affordable ? "" : "too-expensive"}">Biaya: ◈ ${fmt(a.cost)}</div>
           <button class="btn btn-gold" ${!affordable ? "disabled" : ""} onclick="buyArtifact('${a.id}')">Beli</button>`}
    `;
    al.appendChild(card);
  }
}

function renderAdventureUI() {
  renderMap(); renderStageInfo(); renderBattle(); renderSkillBar();
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
  while (box.children.length > 20) box.removeChild(box.firstChild);
}
function clearBattleLog() { document.getElementById("battle-log").innerHTML = ""; }
function showResult(title, text) {
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-text").innerHTML = text;
  document.getElementById("modal-result").classList.remove("hidden");
}

// ============================================================
// TAB SWITCHING
// ============================================================
function switchTab(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.toggle("active", c.id === "tab-" + name));
}

// ============================================================
// GAME LOOPS
// ============================================================
function tick() {
  const now = Date.now();
  const dt = (now - state.lastTick) / 1000;
  state.lastTick = now;
  state.qi += qiRate() * dt;

  // Cooldown countdown
  for (const k in state.skillCd) {
    if (state.skillCd[k] > 0) state.skillCd[k] = Math.max(0, state.skillCd[k] - 1000);
  }
  // HP regen out of combat (slow)
  const pl = playerPower();
  if (state.playerHp < pl.hp) {
    state.playerHp = Math.min(pl.hp, state.playerHp + pl.hp * 0.01);
  }
  renderQi();
  renderBattle();
  renderSkillBar();
}

setInterval(tick, 1000);
setInterval(save, 15000);

// ============================================================
// EVENT BINDINGS
// ============================================================
document.getElementById("btn-meditate").addEventListener("click", meditate);
document.getElementById("btn-breakthrough").addEventListener("click", tryBreakthrough);
document.getElementById("btn-attack").addEventListener("click", basicAttack);
document.getElementById("btn-auto").addEventListener("click", toggleAuto);
document.getElementById("btn-flee").addEventListener("click", fleeBattle);

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
document.getElementById("btn-save").addEventListener("click", () => { save(); log("💾 Disimpan.", "green"); });
document.getElementById("btn-reset").addEventListener("click", reset);

// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (e.code === "Space") { e.preventDefault(); basicAttack(); }
  else if (e.key >= "1" && e.key <= "4") {
    const idx = parseInt(e.key) - 1;
    if (state.classId) {
      const cls = CLASSES[state.classId];
      const sid = cls.skills[idx];
      if (sid) playerAttack(sid);
    }
  }
});

// ============================================================
// INIT
// ============================================================
if (load()) log("☯ Kultivasi dilanjutkan.", "green");
else { log("☯ Selamat datang, pencari keabadian.", "gold"); log("Pilih kelas di tab 🎭 untuk mulai bertarung."); }

// Initial spawn (if classId exists)
if (!state.enemy) spawnEnemy();
renderAll();

window.addEventListener("beforeunload", save);

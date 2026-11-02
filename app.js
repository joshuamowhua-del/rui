'use strict';
(() => {
  // ---------- constants ----------
  const STORE_KEY = 'rui-v1';
  const SLOTS = { morning: '早上', noon: '中午', evening: '晚上', bedtime: '睡前' };
  const SLOT_ORDER = ['morning', 'noon', 'evening', 'bedtime'];
  const SLOT_ICON = { morning: '🌅', noon: '☀️', evening: '🌆', bedtime: '🌙' };
  // Categorical palette (fixed order). Each habit keeps its own color index.
  const COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'];
  const ON_COLOR = ['#fff', '#fff', '#111', '#111', '#111', '#fff', '#fff', '#fff'];
  const HABIT_RING = COLORS[4];
  const MED_RING = COLORS[6];
  const PERIOD = '#e34948';
  const ICONS = ['💧', '🧘', '🏃', '🚶', '📚', '🎵', '✍️', '🌙', '🍎', '🥗', '💅', '🧴', '🦷', '🍵', '🎨', '😴'];
  const TYPES = {
    minutes: { label: '按时间', desc: '记录做了多少分钟，比如运动', icon: '⏱️' },
    count: { label: '按次数', desc: '比如今天喝了几杯水', icon: '🔢' },
    check: { label: '每天做一次', desc: '做到了就打个勾', icon: '✅' },
  };
  const KINDS = {
    medicine: { label: '药品', icon: '💊' },
    supplement: { label: '保健品', icon: '🐟' },
  };
  const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LEVELS = [
    { at: 0, icon: '🐟', name: '摸鱼新手' },
    { at: 10, icon: '🧋', name: '奶茶自由' },
    { at: 50, icon: '💅', name: '精致打工人' },
    { at: 150, icon: '🌟', name: '人间清醒' },
    { at: 365, icon: '👑', name: '宇宙最强老婆' },
  ];
  // {n} is replaced with one of her nicknames.
  const WORK = [
    '上班是为了下班，下班才是为了生活 ✨', '工作是老板的，命是自己的，{n}别太拼', '允许一切发生，包括领导犯蠢 🙃',
    '不内耗，有气直接外耗别人 😤', '钱没给够，干嘛那么拼命？', '摸鱼不叫摸鱼，叫带薪思考 🐟',
    '情绪稳定，是因为工资不配我发疯', '今天的班就上到这儿吧，剩下的交给明天的{n}', '打工人的命也是命，先喝口奶茶 🧋',
    '宁做咸鱼，不当冤种', '班味太重了，下班记得把它洗掉 🫧', '你只是来上班的，不是来渡劫的',
  ];
  const ROAST = [
    '领导画的饼，睿睿已经帮{n}拿去喂狗了 🐶', '那个同事又甩锅？他的锅多到能开火锅店了 🍲',
    '开会两小时，有用的话两分钟，剩下全是领导的脱口秀', '领导说"辛苦了"，翻译一下就是"还得辛苦" 🙄',
    '抢功劳的同事，祝他电脑天天蓝屏 💻', '不是{n}不行，是他们太能装', '领导的脑回路，导航都找不到 🗺️',
    '{n}一个人干三个人的活，他一个人说三个人的话', '让他说，他说他的，我们拿我们的工资 💰',
    '那位"收到"同事，收到了个寂寞', '领导的"我简单说两句"，睿睿已经睡了三觉 😴', '谁惹{n}生气，睿睿今晚就去他梦里加班',
  ];
  const SOUP = [
    '{n}已经很棒了，别对自己太苛刻 🌷', '累了就停一停，世界不会塌的', '你值得被温柔对待，包括被你自己 💗',
    '今天的{n}也闪闪发光 ✨', '慢慢来，比较快', '不开心的事，睡一觉就交给昨天吧 🌙', '你不需要讨好所有人，做自己就很好',
  ];
  // Coworker lines; the names themselves live only in her settings, never in this file.
  const BAD_LINES = [
    '{bad}又在那儿装？别理，{n}的时间很贵的 💅', '{bad}今天又甩锅了吗？睿睿已经记在小本本上了 📓',
    '{bad}的话听听就好，跟领导画的饼一个味儿 🫓', '祝{bad}今天电脑卡、外卖撒、会议开到九点 😈',
    '{bad}说啥都"对对对"，然后继续干自己的 🙃', '{bad}这种人，工位自带降智光环',
    '{n}别气，{bad}这种人，生活已经在惩罚了', '{bad}要是再惹{n}，睿睿今晚就去梦里让{bad}改 PPT 到天亮',
    '{bad}的锅自己背，{n}不接 🙅', '跟{bad}置气不值得，留着力气下班吃好吃的 🍜',
  ];
  const MIXED_LINES = [
    '{mixed}今天是好{mixed}还是坏{mixed}？先观察一下再说 👀', '{mixed}时好时坏，跟公司 Wi-Fi 一样 📶',
    '{mixed}今天要是靠谱，睿睿就勉强夸一句', '{mixed}嘛，看心情给好脸色就行 😏',
  ];
  const GOOD_LINES = [
    '还好有{good}在，上班也没那么难熬 ☺️', '{good}是好人！今天约{good}一起吃饭吧 🍱',
    '{good}这种同事要好好珍惜，比奶茶还甜 🧋', '被{bad}气到了就去找{good}聊聊天 💬',
  ];
  const PRAISE = ['记下啦！{n}真自觉 👍', '收到收到，睿睿给{n}盖个章 ✅', '乖～继续保持 😎', '好耶，{n}今天也很靠谱 💪'];
  const LOVE_LINES = [
    '哎哟～😳 睿睿捂住眼睛了，已记录！', '咳咳，睿睿什么都没看见 🙈', '本月第 {c} 次 💕 感情真好呀～',
    '记下了记下了，睿睿脸红了 ☺️', '嘻嘻，{n}今天心情应该不错吧 😏',
  ];

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  const pad = n => String(n).padStart(2, '0');
  const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return dkey(d); };
  const todayKey = () => dkey(new Date());
  const fmtDate = k => { const d = parseKey(k); return `${d.getMonth() + 1}月${d.getDate()}日`; };
  const weekdayOf = k => WEEK[parseKey(k).getDay()];
  const fmtTime = ts => { const d = new Date(ts); return `${d.getHours()}:${pad(d.getMinutes())}`; };
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const pct = x => Math.round(clamp01(x) * 100);
  const fmtDur = ms => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return h ? `${h}:${pad(m)}:${pad(r)}` : `${pad(m)}:${pad(r)}`;
  };
  const unitOf = h => h.type === 'minutes' ? '分钟' : (h.unit || '次');
  const colorOf = h => COLORS[h.color % COLORS.length];
  const onColorOf = h => ON_COLOR[h.color % COLORS.length];

  // ---------- state ----------
  const DEFAULT_SETTINGS = { nicknames: ['老婆'], font: 'large', cycle: 28, plen: 5, hideLove: true, onboarded: false, people: { bad: [], mixed: [], good: [] } };

  // 睿睿小窝 pet: needs 0–100, last update time, bed/awake, 亲密度, outfit, where he stands.
  const PET0 = { t: 0, food: 80, clean: 80, mood: 80, energy: 80, asleep: false, love: 0, outfit: 'blue', x: 45, pats: {} };

  function seed() {
    const t = todayKey();
    return {
      v: 1,
      settings: Object.assign({}, DEFAULT_SETTINGS, { nicknames: ['老婆'] }),
      habits: [{ id: uid(), name: '喝水', icon: '💧', type: 'count', goal: 8, unit: '杯', color: 0, created: t }],
      meds: [
        { id: uid(), name: '鱼油', kind: 'supplement', dose: '1粒', slots: ['noon'], note: '随餐吃', created: t },
        { id: uid(), name: '避孕药', kind: 'medicine', dose: '1片', slots: ['bedtime'], note: '每天同一时间', created: t },
      ],
      periods: [],
      log: {},
      timers: {},
      beat: { total: 0, ti: 0, mute: false },
      pet: Object.assign({}, PET0, { t: Date.now() }),
      nextColor: 1,
    };
  }

  function normalize(s) {
    s.settings = Object.assign({}, DEFAULT_SETTINGS, s.settings || {});
    if (!Array.isArray(s.settings.nicknames) || !s.settings.nicknames.length) s.settings.nicknames = ['老婆'];
    s.settings.people = Object.assign({ bad: [], mixed: [], good: [] }, s.settings.people || {});
    s.habits = Array.isArray(s.habits) ? s.habits : [];
    s.meds = Array.isArray(s.meds) ? s.meds : [];
    s.periods = Array.isArray(s.periods) ? s.periods : [];
    s.log = s.log || {};
    s.timers = s.timers || {};
    s.beat = Object.assign({ total: 0, ti: 0, mute: false }, s.beat || {});
    delete s.beat.tally;
    s.pet = Object.assign({}, PET0, s.pet || {});
    if (typeof s.nextColor !== 'number') s.nextColor = s.habits.length % COLORS.length;
    return s;
  }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.v === 1) return normalize(s);
    } catch (e) { /* fall through to a fresh start */ }
    return null;
  }

  // Preview mode (#demo): fills in a few weeks of sample history, never saved.
  const DEMO = location.hash.includes('demo');
  let S = DEMO ? demoState() : (load() || seed());

  function save() {
    if (DEMO) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
    catch (e) { toast('保存失败：手机存储空间可能不够了'); }
  }

  function demoState() {
    const s = seed();
    const t = todayKey();
    const start = addDays(t, -70);
    s.habits.forEach(h => { h.created = start; });
    s.meds.forEach(m => { m.created = start; });
    s.settings.onboarded = true;
    s.settings.nicknames = ['老婆', '宝宝', '小仙女'];
    s.settings.people = { bad: ['坏同事A'], mixed: ['同事B'], good: ['好同事C'] };
    let r = 11;
    const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
    for (let i = 70; i >= 1; i--) {
      const d = addDays(t, -i), l = { h: {}, m: {} };
      s.habits.forEach(h => { l.h[h.id] = Math.round(3 + rnd() * 6); });
      s.meds.forEach(m => {
        l.m[m.id] = {};
        m.slots.forEach(sl => { if (rnd() > 0.08) l.m[m.id][sl] = parseKey(d).getTime() + 13 * 3600e3; });
      });
      if (rnd() > 0.82) l.love = 1;
      s.log[d] = l;
    }
    [-62, -34, -6].forEach(o => s.periods.push({ start: addDays(t, o), end: addDays(t, o + 4) }));
    const tl = { h: {}, m: {} };
    tl.h[s.habits[0].id] = 3;
    tl.m[s.meds[0].id] = { noon: Date.now() - 2 * 3600e3 };
    s.log[t] = tl;
    return s;
  }

  // ---------- queries ----------
  const isActive = (it, day) => it.created <= day && (!it.archived || it.archived > day);
  const activeHabits = day => S.habits.filter(h => isActive(h, day));
  const activeMeds = day => S.meds.filter(m => isActive(m, day));
  const hv = (day, id) => (S.log[day] && S.log[day].h && S.log[day].h[id]) || 0;
  const mt = (day, id, slot) => (S.log[day] && S.log[day].m && S.log[day].m[id] && S.log[day].m[id][slot]) || 0;
  const sortedSlots = slots => SLOT_ORDER.filter(s => slots.includes(s));
  const getHabit = id => S.habits.find(h => h.id === id);
  const getMed = id => S.meds.find(m => m.id === id);

  function dayLog(day) {
    const l = S.log[day] || (S.log[day] = { h: {}, m: {} });
    l.h = l.h || {};
    l.m = l.m || {};
    return l;
  }

  function stats(day) {
    const hs = activeHabits(day), ms = activeMeds(day);
    let hSum = 0, hDone = 0, exp = 0, tak = 0;
    hs.forEach(h => {
      const v = hv(day, h.id);
      hSum += clamp01(v / h.goal);
      if (v >= h.goal) hDone++;
    });
    ms.forEach(m => m.slots.forEach(s => { exp++; if (mt(day, m.id, s)) tak++; }));
    const hp = hs.length ? hSum / hs.length : null;
    const mp = exp ? tak / exp : null;
    const parts = [hp, mp].filter(x => x !== null);
    const overall = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
    return { hs, ms, hp, mp, overall, hDone, exp, tak, empty: !parts.length };
  }

  function medStreak() {
    const full = k => { const st = stats(k); return st.exp > 0 && st.tak === st.exp; };
    let d = todayKey(), n = 0;
    if (!full(d)) d = addDays(d, -1);
    while (n < 3650 && full(d)) { n++; d = addDays(d, -1); }
    return n;
  }

  // One heart per habit that hits its goal and per medicine fully taken that day.
  function heartsOn(day) {
    const st = stats(day);
    return st.hDone + st.ms.filter(m => m.slots.every(s => mt(day, m.id, s))).length;
  }

  function totalHearts() {
    const t = todayKey();
    return Object.keys(S.log).filter(d => d <= t).reduce((a, d) => a + heartsOn(d), 0);
  }

  function levelOf(n) {
    let i = 0;
    LEVELS.forEach((l, k) => { if (n >= l.at) i = k; });
    return Object.assign({ i, next: LEVELS[i + 1] || null }, LEVELS[i]);
  }

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const who = () => pick(S.settings.nicknames);
  const people = key => (S.settings.people && S.settings.people[key]) || [];
  // One name per line so "{bad}...{bad}" talks about the same person.
  const fill = (line, extra = {}) => {
    const names = {};
    for (const k of ['bad', 'mixed', 'good']) { const l = people(k); if (l.length) names[k] = pick(l); }
    return line.replace(/\{n\}/g, () => who()).replace(/\{c\}/g, extra.c ?? '')
      .replace(/\{(bad|mixed|good)\}/g, (m, k) => names[k] || '那个同事');
  };
  const usable = line => (line.match(/\{(bad|mixed|good)\}/g) || []).every(m => people(m.slice(1, -1)).length);
  function roastLine() {
    const pool = [...BAD_LINES, ...BAD_LINES, ...MIXED_LINES].filter(usable);
    return fill(pick(pool.length && Math.random() < 0.65 ? pool : ROAST));
  }
  function soupLine() {
    const pool = GOOD_LINES.filter(usable);
    return fill(pick(pool.length && Math.random() < 0.4 ? pool : SOUP));
  }

  // ---------- period ----------
  const daysBetween = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 864e5);
  const loveOn = day => (S.log[day] && S.log[day].love) || 0;
  const loveInMonth = ym => Object.keys(S.log).filter(d => d.startsWith(ym)).reduce((a, d) => a + loveOn(d), 0);

  // An unfinished period is treated as over once it runs well past the usual length.
  function periodEnd(p, plen) {
    if (p.end) return p.end;
    const t = todayKey(), guess = addDays(p.start, plen - 1);
    return daysBetween(p.start, t) < Math.max(plen + 4, 9) ? (t > guess ? t : guess) : guess;
  }

  function cycleInfo() {
    const ps = S.periods.slice().sort((a, b) => (a.start < b.start ? -1 : 1));
    const gaps = [];
    for (let i = 1; i < ps.length; i++) gaps.push(daysBetween(ps[i - 1].start, ps[i].start));
    const okGaps = gaps.filter(g => g >= 15 && g <= 60).slice(-6);
    const cycle = okGaps.length ? Math.round(okGaps.reduce((a, b) => a + b, 0) / okGaps.length) : S.settings.cycle;
    const lens = ps.filter(p => p.end).map(p => daysBetween(p.start, p.end) + 1).filter(l => l >= 1 && l <= 14).slice(-6);
    const plen = lens.length ? Math.round(lens.reduce((a, b) => a + b, 0) / lens.length) : S.settings.plen;
    const t = todayKey(), last = ps[ps.length - 1] || null;
    const current = last && last.start <= t && periodEnd(last, plen) >= t && (last.end || daysBetween(last.start, t) < Math.max(plen + 4, 9)) ? last : null;
    const nextStart = last ? addDays(last.start, cycle) : null;
    return {
      ps, cycle, plen, last, current, nextStart,
      dayOf: current ? daysBetween(current.start, t) + 1 : null,
      untilNext: nextStart ? daysBetween(t, nextStart) : null,
      cycleDay: last ? daysBetween(last.start, t) + 1 : null,
    };
  }

  function periodDayType(k, ci) {
    if (ci.ps.some(p => k >= p.start && k <= periodEnd(p, ci.plen))) return 'period';
    if (!ci.nextStart || k <= todayKey()) return '';
    for (let n = 0; n < 4; n++) {
      const st = addDays(ci.nextStart, n * ci.cycle);
      if (k >= st && k <= addDays(st, ci.plen - 1)) return 'predicted';
    }
    return '';
  }

  // ---------- ui state ----------
  const ui = {
    view: 'today', day: todayKey(), trend: 'week', month: todayKey().slice(0, 7), enter: true, pop: null,
    ruiText: '', ruiFresh: true, ruiTap: 0, loveOpen: false,
  };
  const lastP = {};
  const lastCount = {};
  let animIndex = 0;
  const A = () => `anim" style="--i:${animIndex++}`; // appended inside class="…"

  const hashView = location.hash.replace('#', '').split(/[&,]/);
  if (hashView.includes('trends') || hashView.includes('month')) ui.view = 'trends';
  if (hashView.includes('month')) ui.trend = 'month';
  if (hashView.includes('settings')) ui.view = 'settings';

  // ---------- rings ----------
  function ring(key, p, color, cx, r, sw, track) {
    const c = 2 * Math.PI * r, from = lastP[key] ?? 0;
    return `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"/>` +
      `<circle class="ring-p" data-ring="${key}" data-p="${clamp01(p)}" data-c="${c}" cx="${cx}" cy="${cx}" r="${r}" fill="none" ` +
      `stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" ` +
      `style="stroke-dashoffset:${c * (1 - from)};opacity:${from > 0 ? 1 : 0}" transform="rotate(-90 ${cx} ${cx})"/>`;
  }

  function doubleRing(keyBase, st, size, sw) {
    const cx = size / 2, r1 = cx - sw / 2, r2 = r1 - sw - Math.max(3, sw * 0.25);
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="习惯完成${pct(st.hp ?? 0)}%，吃药完成${pct(st.mp ?? 0)}%">` +
      ring(keyBase + '-h', st.hp ?? 0, HABIT_RING, cx, r1, sw, '#fbe2d6') +
      ring(keyBase + '-m', st.mp ?? 0, MED_RING, cx, r2, sw, '#dce9f9') +
      `</svg>`;
  }

  // ---------- 睿睿小窝: 睿睿 as a little virtual pet ----------
  // He lives in his room: she feeds him, bathes him, plays with him and puts him to bed. His four needs
  // drop slowly in real time (also while the app is closed). Tap him while he sleeps and he wakes up
  // asking who upset her (打手). Villain names come only from her own lists in settings.
  const NOBODY_LINES = ['那就好～有事随时叫醒我哦，我再睡会儿…… 😴', '没人欺负{n}就好，睿睿接着睡啦，梦里见～ 💤', '好嘞，{n}开开心心的，睿睿继续做梦了 🌙'];
  const FIGHT_LINES = ['敢欺负{n}？吃我一棍！', '就是你欺负{n}的？站住别跑！', '谁给你的胆子欺负{n}的？！', '今天让你知道{n}是有人罩着的！'];
  const RAGE_LINES = ['打呀打呀打呀！🔥', '还敢欺负{n}？！统统打跑！🔥', '睿睿生气了，后果很严重！🔥', '一个都别想跑！🔥', '还有同伙？一起打！🔥'];
  const ASK_LINES = ['打跑了！还有人欺负你吗？', '哼，跑得真快！还有谁？', '呼……还有人欺负{n}吗？'];
  const CALM_LINES = ['出气了吧？以后谁欺负你，就叫醒我 💪', '坏人都打跑啦，{n}笑一个～', '有睿睿在，谁也别想欺负{n}！'];
  const OUCH = ['哎哟！', '别打了！', '我错了！', '嗷～', '饶命！', '不敢了！'];
  const POW = ['啪！', '砰！', '咚！', '💥', '啪啪！'];
  const PAT_LINES = ['嘿嘿～再摸摸 ☺️', '被{n}摸头，今天也是幸福的一天', '头发要被摸乱啦～', '喜欢{n} 💗', '羊毛卷是不是很好摸？😌'];
  const TICKLE_LINES = ['哈哈哈好痒！', '别挠了哈哈哈哈', '投降投降！😆', '那里不行哈哈哈'];
  const DIZZY_LINES = ['别戳啦～头晕了 😵‍💫', '眼冒金星……{n}手下留情', '我是谁？我在哪？'];
  const HELD_LINES = ['放我下来！😳', '哇——好高！', '{n}力气好大！', '要掉下去啦！'];
  const NEED_LINES = {
    food: ['肚子咕咕叫了…想吃火锅 🍲', '饿饿…饭饭…', '{n}，我想喝奶茶 🧋'],
    clean: ['身上黏黏的，想洗澡 🛁', '有点臭臭的…不要嫌弃我', '头发都打结了…'],
    mood: ['好无聊，陪我玩嘛 🥺', '{n}理理我～', '想{n}了…'],
    energy: ['好困…想睡觉 😪', '眼皮在打架…', '电量不足，需要充电 🔋'],
  };
  const NEED_INFO = { food: ['🍚', '饱饱'], clean: ['🫧', '干净'], mood: ['💗', '心情'], energy: ['⚡', '精力'] };
  const FOODS = [
    { id: 'tea', icon: '🧋', name: '奶茶', food: 15, mood: 12, line: '奶茶续命！{n}也来一口？' },
    { id: 'ramen', icon: '🍜', name: '拉面', food: 35, mood: 5, line: '嘶溜嘶溜～面好筋道！' },
    { id: 'hotpot', icon: '🍲', name: '火锅', food: 45, mood: 10, clean: -12, line: '火锅！吃得满身火锅味 😋' },
    { id: 'cake', icon: '🍰', name: '小蛋糕', food: 15, mood: 15, line: '甜甜的，像{n}一样 🥰' },
    { id: 'melon', icon: '🍉', name: '西瓜', food: 12, mood: 8, line: '冰冰甜甜，好爽～' },
    { id: 'salad', icon: '🥗', name: '沙拉', food: 20, mood: -3, line: '健康是健康……下次想吃肉 🥲' },
  ];
  const OUTFITS = [['blue', '蓝毛衣', 0], ['pink', '粉毛衣', 1], ['suit', '小西装', 2], ['chef', '小厨师', 3], ['prince', '小王子', 4]];
  const BOND = [[0, '刚认识'], [30, '熟起来了'], [100, '好朋友'], [250, '贴心小棉袄'], [500, '灵魂伴侣'], [1000, '一辈子的睿睿']];
  const RPS = { rock: ['✊', '石头'], scissors: ['✌️', '剪刀'], paper: ['🖐', '布'] };
  const BEATS = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
  const FLOOR = 14, BED = { x: 6, y: 52 };
  const R = { stage: 'idle', busy: false, round: 0, foes: [], fromSleep: false, loop: null, idle: null, timers: [], taps: [], held: null };
  const fightTitle = () => S.settings.nicknames[(S.beat.ti || 0) % S.settings.nicknames.length];
  const later = (fn, ms) => R.timers.push(setTimeout(fn, ms));
  const shuffle = a => a.slice().sort(() => Math.random() - 0.5);

  function bondOf(love) {
    let i = 0;
    BOND.forEach(([at], k) => { if (love >= at) i = k; });
    return { i, name: BOND[i][1], at: BOND[i][0], next: BOND[i + 1] };
  }

  // Needs drop per hour while awake; sleeping refills energy. Capped so a long trip away isn't punished forever.
  function petTick() {
    const P = S.pet, now = Date.now();
    if (!P.t) { P.t = now; return; }
    const h = Math.min(48, Math.max(0, (now - P.t) / 36e5));
    P.t = now;
    const add = (k, v) => { P[k] = Math.max(0, Math.min(100, P[k] + v)); };
    add('food', -5 * h * (P.asleep ? 0.5 : 1));
    add('clean', -2 * h);
    add('mood', -(3 + (P.food < 25 || P.clean < 25 ? 2 : 0)) * h * (P.asleep ? 0.3 : 1));
    add('energy', P.asleep ? 14 * h : -3 * h);
  }

  function petAdd(d) {
    const P = S.pet;
    Object.entries(d).forEach(([k, v]) => {
      if (k === 'love') P.love = Math.max(0, P.love + v);
      else P[k] = Math.max(0, Math.min(100, P[k] + v));
    });
    save();
    updateNeeds();
  }

  // Her own self-care makes him happy too (called when she logs a pill or a glass of water).
  function petCare(mood) {
    petTick();
    const lv0 = bondOf(S.pet.love).i;
    petAdd({ mood, love: 1 });
    if (bondOf(S.pet.love).i > lv0) toast(`💞 和睿睿的亲密度升级啦：${bondOf(S.pet.love).name}`);
  }

  const lowest = () => Object.keys(NEED_INFO).sort((a, b) => S.pet[a] - S.pet[b])[0];
  const restMood = () => {
    const P = S.pet;
    return P.asleep ? 'sleep' : (P.food < 20 || P.mood < 25 || P.clean < 15) ? 'sad' : P.energy < 15 ? 'wake' : '';
  };

  function needsHTML() {
    return Object.entries(NEED_INFO).map(([k, [ic, nm]]) => {
      const v = Math.round(S.pet[k]);
      return `<div class="need ${v < 30 ? 'low' : ''}" data-need="${k}"><span class="n-ic">${ic}</span><span class="n-nm">${nm}</span>
        <span class="n-bar"><i style="width:${v}%"></i></span><span class="n-v">${v}</span></div>`;
    }).join('');
  }
  function updateNeeds() {
    Object.keys(NEED_INFO).forEach(k => {
      const el = $(`.need[data-need="${k}"]`);
      if (!el) return;
      const v = Math.round(S.pet[k]);
      el.classList.toggle('low', v < 30);
      el.querySelector('i').style.width = v + '%';
      el.querySelector('.n-v').textContent = v;
    });
    const b = $('#bond-box');
    if (b) b.innerHTML = bondHTML();
  }

  // ----- drawing helpers -----
  function pose(mood) { const el = $('#pet-body'); if (el) el.innerHTML = ruiSVG('', mood, S.pet.outfit); }
  function petSay(text) {
    const b = $('#pet-say');
    if (!b) return;
    b.textContent = fill(text);
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  }
  function think(text, ms = 3200) {
    const el = $('#think');
    if (!el) return;
    el.textContent = fill(text);
    el.classList.add('show');
    clearTimeout(think.t);
    think.t = setTimeout(() => el.classList.remove('show'), ms);
  }
  function setStage(stage) {
    R.stage = stage;
    const room = $('#room');
    if (!room) return;
    room.dataset.stage = stage;
    room.classList.toggle('rage', R.round >= 2 && (stage === 'fight' || stage === 'ask'));
  }
  function place(x, y = FLOOR, ms = 0) {
    const pet = $('#pet');
    if (!pet) return;
    const from = parseFloat(pet.style.left) || 0;
    pet.style.transition = ms ? `left ${ms}ms linear, bottom ${Math.min(ms, 500)}ms ease-out` : 'none';
    if (Math.abs(x - from) > 0.5) pet.classList.toggle('flip', x < from);
    pet.style.left = x + '%';
    pet.style.bottom = y + 'px';
    if (ms > 300) { pet.classList.add('walking'); later(() => pet.classList.remove('walking'), ms); }
    if (y === FLOOR) S.pet.x = x;
  }
  function fx(text, cls, x, y) {
    const room = $('#room');
    if (!room) return;
    const el = document.createElement('span');
    el.className = 'fx ' + cls; el.textContent = text;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    room.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }
  function petBox() {
    const pet = $('#pet'), room = $('#room');
    if (!pet || !room) return null;
    const a = pet.getBoundingClientRect(), r = room.getBoundingClientRect();
    return { x: a.left - r.left, y: a.top - r.top, w: a.width, h: a.height, room: r };
  }
  function burst(text, cls = 'heart', n = 3) {
    const b = petBox();
    if (!b) return;
    for (let i = 0; i < n; i++) later(() => fx(text, cls, b.x + b.w * (0.2 + Math.random() * 0.6), b.y + b.h * (0.05 + Math.random() * 0.2)), i * 140);
  }

  // ----- buttons under the room -----
  const btn = (label, cmd, cls = 'btn-soft', arg = '') => `<button class="btn ${cls}" data-action="pet" data-do="${cmd}" data-arg="${arg}">${label}</button>`;
  function petButtons(mode) {
    const el = $('#pet-btns');
    if (!el) return;
    const P = S.pet, lv = bondOf(P.love).i;
    const html = {
      main: `<div class="pb-grid">${btn('🍱<small>喂饭</small>', 'menu-food')}${btn('🛁<small>洗澡</small>', 'bath')}${btn('🎾<small>陪玩</small>', 'menu-play')}${btn('😴<small>睡觉</small>', 'sleep')}</div>
        <div class="pb-row">${btn(`🥊 ${esc(fightTitle())}打手`, 'fight', 'btn-primary')}${btn('👕 换装', 'menu-wear')}</div>`,
      sleep: `<div class="pb-hint">💤 点点睿睿，会把他叫醒问你哦</div><div class="pb-row">${btn('☀️ 起床啦', 'getup')}${btn('🥊 有人欺负我', 'fight', 'btn-primary')}</div>`,
      food: `<div class="pb-grid food">${FOODS.map(f => btn(`${f.icon}<small>${f.name}</small>`, 'eat', 'btn-soft', f.id)).join('')}</div><div class="pb-row">${btn('‹ 返回', 'back')}</div>`,
      play: `<div class="pb-hint">和睿睿石头剪刀布，或者看他跳舞</div>
        <div class="pb-grid">${Object.entries(RPS).map(([k, [ic, nm]]) => btn(`${ic}<small>${nm}</small>`, 'rps', 'btn-soft', k)).join('')}${btn('💃<small>跳舞</small>', 'dance')}</div>
        <div class="pb-row">${btn('‹ 返回', 'back')}</div>`,
      wear: `<div class="pb-grid wear">${OUTFITS.map(([id, nm, need]) => need > lv
          ? `<button class="btn btn-soft locked" data-action="pet" data-do="locked" data-arg="${need}">🔒<small>${nm}</small></button>`
          : btn(`${id === P.outfit ? '✓' : '👕'}<small>${nm}</small>`, 'wear', id === P.outfit ? 'btn-primary' : 'btn-soft', id)).join('')}</div>
        <div class="pb-row">${btn('‹ 返回', 'back')}</div>`,
      ask: `<div class="pb-row">${btn('😌 没人欺负我', 'no')}${btn('😤 有人欺负我', 'yes', 'btn-primary')}</div>`,
      more: `<div class="pb-row">${btn('😌 没了，出气了', 'done')}${btn('😤 还有！', 'yes', 'btn-primary')}</div>`,
      bath: `<div class="pb-hint">🫧 用手指在睿睿身上搓一搓</div><div class="pb-row">${btn('✨ 洗好了', 'bath-done', 'btn-primary')}</div>`,
      fight: '<div class="pb-hint big">👆 点小人，睿睿打得更狠！</div>',
      none: '<div class="pb-hint">　</div>',
    }[mode];
    el.innerHTML = html;
    el.dataset.mode = mode;
  }

  // ----- daily life -----
  function goIdle(line) {
    R.busy = false;
    setStage('idle');
    pose(restMood());
    petButtons('main');
    if (line) petSay(line);
  }

  function idleTick() {
    if (R.stage !== 'idle' || R.busy || R.held) return;
    petTick(); updateNeeds();
    const r = Math.random(), low = lowest();
    if (r < 0.45) {
      const x = 24 + Math.random() * 36, from = S.pet.x;
      place(x, FLOOR, Math.max(600, Math.abs(x - from) * 70));
    } else if (r < 0.7) {
      if (S.pet[low] < 40) think(pick(NEED_LINES[low]));
      else think(Math.random() < 0.5 ? pick(WORK) : Math.random() < 0.5 ? roastLine() : soupLine(), 4200);
    } else if (r < 0.85) {
      const svg = $('#pet-body .rui');
      if (svg) { svg.classList.remove('wave', 'jump'); void svg.getBoundingClientRect(); svg.classList.add(Math.random() < 0.5 ? 'wave' : 'jump'); }
    }
  }

  function eat(id) {
    const f = FOODS.find(x => x.id === id), P = S.pet;
    if (!f || R.busy) return;
    if (P.food >= 95) { pose('happy'); petSay('吃不下啦～肚子已经圆滚滚了 😋'); later(() => pose(restMood()), 1500); return; }
    R.busy = true;
    const b = petBox(), room = $('#room');
    const el = document.createElement('span');
    el.className = 'fly-food'; el.textContent = f.icon;
    el.style.left = (b.room.width / 2 - 20) + 'px'; el.style.top = (b.room.height - 40) + 'px';
    room.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.left = (b.x + b.w * (S.pet.x > 50 ? 0.4 : 0.5) - 20) + 'px';
      el.style.top = (b.y + b.h * 0.42) + 'px';
      el.style.transform = 'scale(.7)';
    }));
    later(() => { el.remove(); pose('eat'); petSay('嗷呜～'); }, 650);
    later(() => {
      petAdd({ food: f.food, mood: f.mood, clean: f.clean || 0, love: 2 });
      pose('happy'); petSay(f.line); burst('💗');
      R.busy = false;
    }, 2000);
    later(() => { if (R.stage === 'idle' && !R.busy) pose(restMood()); }, 3600);
  }

  let bathLast = 0;
  function bath() {
    if (R.busy) return;
    R.busy = true;
    setStage('bath');
    place(32, 26, 0);
    pose('happy');
    petSay('洗澡澡咯～水温刚刚好 🛁');
    petButtons('bath');
    R.bathAuto = setInterval(() => { bathBubble(); if (S.pet.clean >= 100) bathDone(); }, 450);
    R.timers.push(R.bathAuto);
  }
  function bathBubble(cx, cy) {
    const b = petBox();
    if (!b) return;
    const x = cx ?? b.x + b.w * (0.15 + Math.random() * 0.7), y = cy ?? b.y + b.h * (0.1 + Math.random() * 0.75);
    fx('', 'bub', x, y);
    S.pet.clean = Math.min(100, S.pet.clean + 1.4);
    updateNeeds();
  }
  function bathDone() {
    if (R.stage !== 'bath') return;
    clearInterval(R.bathAuto);
    petAdd({ clean: 12, mood: 8, love: 3 });
    burst('✨', 'spark', 5);
    petSay('洗香香啦！✨ 闻闻，是不是很香？');
    later(() => { place(40, FLOOR, 400); goIdle(); }, 1200);
  }

  function rps(hers) {
    if (R.busy) return;
    R.busy = true;
    const mine = pick(Object.keys(RPS));
    petSay('石头……剪刀……布！');
    pose('');
    const svg = $('#pet-body .rui');
    if (svg) { svg.classList.remove('jump'); void svg.getBoundingClientRect(); svg.classList.add('jump'); }
    later(() => {
      think(`${RPS[mine][0]} 我出${RPS[mine][1]}！`, 2400);
      const P = S.pet;
      if (mine === hers) { pose('happy'); petSay(`都出${RPS[mine][1]}，心有灵犀！再来～`); petAdd({ mood: 5, energy: -2, love: 1 }); }
      else if (BEATS[hers] === mine) { pose('sad'); petSay(`啊！${fill('{n}')}赢了…再来一局嘛 🥺`); petAdd({ mood: 6, energy: -3, love: 1 }); }
      else { pose('happy'); petSay('耶！睿睿赢啦～ ✌️'); burst('🎉', 'spark', 3); petAdd({ mood: 10, energy: -3, love: 1 }); }
      R.busy = false;
    }, 1000);
  }

  function dance() {
    if (R.busy) return;
    if (S.pet.energy < 10) { pose('wake'); petSay('跳不动了…先让我睡一觉 😪'); return; }
    R.busy = true;
    pose('happy'); petSay('音乐响起来～ 🎵');
    const pet = $('#pet');
    pet.classList.add('dance');
    for (let i = 0; i < 6; i++) later(() => { const b = petBox(); if (b) fx(pick(['🎵', '🎶', '✨']), 'note', b.x + b.w * Math.random(), b.y + b.h * 0.2); }, i * 400);
    later(() => { pet.classList.remove('dance'); petAdd({ mood: 10, energy: -8, love: 2 }); petSay('跳完啦！{n}给我打几分？'); R.busy = false; }, 2600);
  }

  function goSleep() {
    if (R.busy) return;
    R.busy = true;
    petSay(S.pet.energy > 85 ? '还不困呢……好吧，听{n}的 😪' : '晚安，{n}，梦里见 🌙');
    place(14, FLOOR, Math.max(500, (S.pet.x - 14) * 60));
    later(() => {
      S.pet.asleep = true; save();
      $('#pet').classList.add('lying');
      place(BED.x, BED.y, 300);
      setStage('sleep'); pose('sleep'); petButtons('sleep');
      R.busy = false;
    }, Math.max(500, (S.pet.x - 14) * 60) + 50);
  }

  function getUp(line = '哈～欠……睡饱啦！早上好 ☀️') {
    S.pet.asleep = false; save();
    $('#pet').classList.remove('lying');
    pose('wake'); petSay(line);
    place(30, FLOOR, 400);
    setStage('idle');
    later(() => goIdle(), 1200);
  }

  // ----- touch: tap = pat (head) / tickle (body), many taps = dizzy, long-press = pick him up -----
  function petDown(e) {
    if (e.button > 0) return;
    const pet = $('#pet');
    pet.setPointerCapture(e.pointerId);
    R.press = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
    clearTimeout(R.pressT);
    if (R.stage === 'idle' && !R.busy) R.pressT = setTimeout(() => pickUp(e), 420);
  }
  function petMove(e) {
    if (R.stage === 'bath') {
      const now = Date.now();
      if (now - bathLast > 60) { bathLast = now; const r = $('#room').getBoundingClientRect(); bathBubble(e.clientX - r.left, e.clientY - r.top); }
      return;
    }
    if (!R.press) return;
    if (Math.hypot(e.clientX - R.press.x, e.clientY - R.press.y) > 10) { R.press.moved = true; if (!R.held) clearTimeout(R.pressT); }
    if (R.held) dragTo(e);
  }
  function petUp(e) {
    clearTimeout(R.pressT);
    const p = R.press;
    R.press = null;
    if (R.held) { drop(); return; }
    if (!p || p.moved || Date.now() - p.t > 600) return;
    const b = petBox(), relY = (e.clientY - b.room.top - b.y) / b.h;
    petTap(relY);
  }
  function petTap(relY) {
    if (R.stage === 'sleep') { wakeAsk(); return; }
    if (R.stage !== 'idle' || R.busy) return;
    const now = Date.now();
    R.taps = R.taps.filter(t => now - t < 2500).concat(now);
    if (R.taps.length >= 6) {
      R.taps = []; R.busy = true;
      pose('dizzy'); petSay(pick(DIZZY_LINES));
      later(() => { R.busy = false; pose(restMood()); }, 1800);
      return;
    }
    const day = todayKey(), pats = S.pet.pats[day] || 0;
    if (relY < 0.5) {
      pose('happy'); petSay(pick(PAT_LINES)); burst('💗');
      S.pet.pats = { [day]: pats + 1 };
      petAdd({ mood: 3, love: pats < 10 ? 1 : 0 });
    } else {
      pose('happy'); petSay(pick(TICKLE_LINES));
      const pet = $('#pet'); pet.classList.remove('giggle'); void pet.offsetWidth; pet.classList.add('giggle');
      petAdd({ mood: 2 });
    }
    clearTimeout(R.restT);
    R.restT = setTimeout(() => { if (R.stage === 'idle' && !R.busy) pose(restMood()); }, 1600);
  }
  function pickUp(e) {
    R.held = true;
    $('#pet').classList.add('held');
    pose('dangle'); petSay(pick(HELD_LINES));
    dragTo(e);
  }
  function dragTo(e) {
    const b = petBox();
    if (!b) return;
    const x = Math.max(0, Math.min(63, (e.clientX - b.room.left - b.w / 2) / b.room.width * 100));
    const y = Math.max(FLOOR, Math.min(b.room.height - b.h, b.room.bottom - e.clientY - b.h * 0.9));
    const pet = $('#pet');
    pet.style.transition = 'none';
    pet.style.left = x + '%'; pet.style.bottom = y + 'px';
  }
  function drop() {
    R.held = false;
    const pet = $('#pet');
    pet.classList.remove('held');
    pet.style.transition = 'bottom .45s cubic-bezier(.5, 0, .7, 1.6)';
    pet.style.bottom = FLOOR + 'px';
    S.pet.x = parseFloat(pet.style.left) || 40;
    later(() => { pose('happy'); petSay('呼～安全着陆！'); }, 450);
    later(() => { if (R.stage === 'idle' && !R.busy) pose(restMood()); }, 2000);
  }

  // ----- 打手 -----
  // Faceless little baddies: no names, no faces. A bandage and stars show up when they get hit.
  const FOE_SVG = `<svg viewBox="0 0 60 80" aria-hidden="true">
    <ellipse cx="30" cy="77" rx="16" ry="3" fill="#000" opacity=".1"/>
    <path d="M13 77 Q13 52 30 52 Q47 52 47 77 Z" fill="#4b5263"/>
    <path d="M25 52 L30 58 L35 52 Z" fill="#e9ebef"/><path d="M28.6 56 h2.8 l1.1 11 -2.5 2.8 -2.5 -2.8 z" fill="#e34948"/>
    <circle cx="30" cy="32" r="17" fill="#c9ced8"/><ellipse cx="24" cy="25" rx="5" ry="3.4" fill="#fff" opacity=".45"/>
    <g class="f-hurt"><g transform="rotate(-30 36 24)"><rect x="27" y="21" width="18" height="6" rx="2" fill="#f2d3a9"/></g>
      <g transform="rotate(30 36 24)"><rect x="27" y="21" width="18" height="6" rx="2" fill="#f2d3a9"/></g>
      <g fill="#ffc83d"><path d="M10 12 l1.6 3.2 3.4.5 -2.5 2.3 .6 3.3 -3.1-1.6 -3.1 1.6 .6-3.3 -2.5-2.3 3.4-.5z"/><path d="M50 8 l1.3 2.6 2.8.4 -2 1.9 .5 2.7 -2.6-1.3 -2.6 1.3 .5-2.7 -2-1.9 2.8-.4z"/></g></g>
  </svg>`;

  const makeFoes = n => Array.from({ length: n }, () => ({ hp: n === 1 ? 4 : 2 }));

  let actx = null;
  function thwack(big) {
    if (S.beat.mute) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const len = 0.12, buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
      src.buffer = buf; f.type = 'bandpass'; f.frequency.value = big ? 700 : 1100; g.gain.value = 0.35;
      src.connect(f).connect(g).connect(actx.destination); src.start();
    } catch (e) { /* no sound, no problem */ }
  }

  function wakeAsk() {
    if (R.stage !== 'sleep' || R.busy) return;
    R.fromSleep = true;
    setStage('wake'); pose('wake');
    petSay('哈～欠…… 嗯？');
    petButtons('none');
    later(() => { petSay('来，你跟我说说谁欺负你了？'); petButtons('ask'); }, 900);
  }

  function backToBed(line) {
    pose('wake'); petSay(line);
    later(() => { pose('sleep'); setStage('sleep'); }, 1600);
    later(() => { S.pet.asleep = true; save(); petSay('Zzz…… 有事再叫我……'); petButtons('sleep'); R.busy = false; }, 2600);
  }

  function nobody() {
    petButtons('none');
    R.busy = true;
    backToBed(pick(NOBODY_LINES));
  }

  function startFight() {
    if (R.busy && R.stage !== 'wake') return;
    if (R.stage === 'sleep') R.fromSleep = true;
    else if (R.stage !== 'wake') R.fromSleep = false;
    if (R.fromSleep && R.stage === 'sleep') petSay('谁？！谁欺负{n}了？！');
    R.round = 0;
    fightRound();
  }

  function fightRound() {
    clearInterval(R.loop);
    R.busy = true;
    R.round++;
    S.pet.asleep = false;
    const n = R.round === 1 ? 1 : R.round === 2 ? 3 : Math.min(6, 5 + (R.round > 4));
    R.foes = makeFoes(n);
    $('#pet').classList.remove('lying');
    place(1, FLOOR, 350);
    $('#pet').classList.remove('flip'); // always face the baddies
    setStage('fight'); pose(R.round >= 2 ? 'rage' : 'fight');
    $('#foes').innerHTML = R.foes.map((f, i) => `<button class="foe" data-action="pet" data-do="hit" data-arg="${i}" style="--d:${i * 0.12}s" aria-label="打坏人">
      ${FOE_SVG}<span class="foe-ouch"></span></button>`).join('');
    petSay(pick(R.round >= 2 ? RAGE_LINES : FIGHT_LINES));
    petButtons('fight');
    later(() => { R.loop = setInterval(() => { const i = R.foes.findIndex(f => f.hp > 0); if (i >= 0) hitFoe(i); }, R.round >= 2 ? 420 : 640); R.timers.push(R.loop); }, 500 + n * 120);
  }

  function hitFoe(i) {
    const f = R.foes[i], el = $(`.foe[data-arg="${i}"]`), pet = $('#pet');
    if (!f || f.hp <= 0 || !el || R.stage !== 'fight') return;
    pet.classList.remove('swing'); void pet.offsetWidth; pet.classList.add('swing');
    f.hp--;
    thwack(f.hp <= 0);
    el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit');
    el.querySelector('.foe-ouch').textContent = pick(OUCH);
    const box = el.getBoundingClientRect(), r = $('#room').getBoundingClientRect();
    fx(pick(POW), 'pow', box.left - r.left + box.width * (0.1 + Math.random() * 0.4), box.top - r.top + box.height * (0.25 + Math.random() * 0.25));
    if (R.round >= 2 && Math.random() < 0.3) petSay(pick(RAGE_LINES));
    if (f.hp > 0) return;
    el.classList.add('gone');
    S.beat.total++;
    save();
    if (R.foes.every(x => x.hp <= 0)) {
      clearInterval(R.loop);
      later(() => { setStage('ask'); petSay(pick(ASK_LINES)); petButtons('more'); updateNeeds(); }, 800);
    }
  }

  function fightDone() {
    petButtons('none');
    $('#foes').innerHTML = '';
    R.round = 0;
    setStage('calm');
    petAdd({ mood: 15, energy: -10, love: 3 });
    if (R.fromSleep) {
      place(14, FLOOR, 500);
      later(() => { $('#pet').classList.add('lying'); place(BED.x, BED.y, 300); backToBed(pick(CALM_LINES) + ' 睿睿回去睡觉了……'); }, 550);
    } else {
      pose('happy');
      later(() => { place(40, FLOOR, 700); goIdle(pick(CALM_LINES)); }, 900);
    }
  }

  function petDo(cmd, arg) {
    switch (cmd) {
      case 'menu-food': if (!R.busy) petButtons('food'); break;
      case 'menu-play': if (!R.busy) petButtons('play'); break;
      case 'menu-wear': if (!R.busy) petButtons('wear'); break;
      case 'back': petButtons('main'); break;
      case 'eat': eat(arg); break;
      case 'bath': bath(); break;
      case 'bath-done': bathDone(); break;
      case 'rps': rps(arg); break;
      case 'dance': dance(); break;
      case 'sleep': goSleep(); break;
      case 'getup': if (R.stage === 'sleep') getUp(); break;
      case 'no': nobody(); break;
      case 'yes': if (R.stage === 'wake' || R.stage === 'ask') fightRound(); break;
      case 'fight': startFight(); break;
      case 'done': fightDone(); break;
      case 'hit': hitFoe(+arg); break;
      case 'wear': S.pet.outfit = arg; save(); pose('happy'); petSay(`换上${OUTFITS.find(o => o[0] === arg)[1]}啦，帅不帅？😎`); petButtons('wear'); break;
      case 'locked': toast(`亲密度到「${BOND[+arg][1]}」就能解锁哦`); break;
    }
  }

  function bondHTML() {
    const b = bondOf(S.pet.love), unlock = OUTFITS.find(o => o[2] === b.i + 1);
    return `<div class="card-title">💞 亲密度 · Lv${b.i + 1} ${b.name}</div>
      <div class="bond-bar"><i style="width:${b.next ? pct((S.pet.love - b.at) / (b.next[0] - b.at)) : 100}%"></i></div>
      <div class="card-sub">${b.next ? `再 ${b.next[0] - S.pet.love} 点升到「${b.next[1]}」${unlock ? `，解锁新衣服「${unlock[1]}」` : ''}` : '已经是最高级啦，睿睿最爱你 💗'}</div>
      <div class="card-sub">喂饭、洗澡、陪玩、摸摸头都会加亲密度；${esc(fill('{n}'))}自己按时吃鱼油、喝水，睿睿也会开心</div>
      <div class="card-title" style="margin-top:16px">🥊 打手战绩</div>
      <div class="card-sub">睿睿已经帮你打跑了 <b>${S.beat.total}</b> 个坏人</div>
      <div class="bond-links"><button class="link-btn" data-action="fight-title">打手名字：${esc(fightTitle())}打手 · 换一个</button>
        <button class="link-btn" data-action="fight-mute">${S.beat.mute ? '🔇 打人音效已关' : '🔊 打人音效已开'}</button></div>`;
  }

  function roomStop() {
    clearInterval(R.loop); clearInterval(R.idle); clearInterval(R.bathAuto);
    R.timers.forEach(t => { clearTimeout(t); clearInterval(t); }); R.timers = [];
    R.busy = false; R.held = null; R.press = null; R.round = 0; R.foes = [];
  }

  function viewRoom() {
    roomStop();
    petTick(); save();
    const P = S.pet, h = new Date().getHours(), night = h < 6 || h >= 19;
    R.stage = P.asleep ? 'sleep' : 'idle';
    const low = lowest();
    const line = P.asleep ? 'Zzz…… 睿睿睡着了。被欺负了就点点他 👆'
      : P[low] < 30 ? pick(NEED_LINES[low]) : `${greetWord()}！睿睿在家等{n}好久啦～`;
    return `<header class="page-head"><h1>🏡 睿睿小窝</h1><p>喂喂饭、洗洗澡、陪他玩；被欺负了就叫醒他</p></header>
      <section class="card room-card ${A()}">
        <div class="needs" id="needs">${needsHTML()}</div>
        <div class="room ${night ? 'night' : ''}" id="room" data-stage="${R.stage}">
          <div class="window"><span>${night ? '🌙' : '☀️'}</span></div>
          <div class="frame">💗</div>
          <div class="rug"></div>
          <svg class="bed" viewBox="0 0 220 120" aria-hidden="true">
            <rect x="2" y="18" width="20" height="98" rx="9" fill="#c98f6b"/><rect x="200" y="58" width="16" height="58" rx="7" fill="#c98f6b"/>
            <rect x="10" y="74" width="202" height="28" rx="8" fill="#fff" stroke="#f0d7df" stroke-width="2"/>
            <rect x="12" y="100" width="198" height="9" rx="4" fill="#b67d5a"/>
            <ellipse cx="52" cy="70" rx="34" ry="13" fill="#fff" stroke="#f0d7df" stroke-width="2"/>
            <path class="folded" d="M150 76 h52 v24 h-52 z" fill="#ff9fbf"/>
          </svg>
          <div class="tub" aria-hidden="true"><svg viewBox="0 0 160 70"><path d="M6 14 h148 q0 46 -40 52 h-68 q-40 -6 -40 -52z" fill="#fff" stroke="#bcd7f2" stroke-width="4"/>
            <rect x="2" y="8" width="156" height="10" rx="5" fill="#e4f1fc" stroke="#bcd7f2" stroke-width="3"/>
            <g fill="#fff" stroke="#cfe4f7" stroke-width="2"><circle cx="30" cy="12" r="10"/><circle cx="52" cy="6" r="11"/><circle cx="110" cy="8" r="11"/><circle cx="132" cy="12" r="9"/></g></svg></div>
          <div class="pet ${P.asleep ? 'lying' : ''}" id="pet" style="left:${P.asleep ? BED.x : P.x}%;bottom:${P.asleep ? BED.y : FLOOR}px">
            <div class="think" id="think"></div>
            <div class="pet-body" id="pet-body">${ruiSVG('', restMood(), P.outfit)}</div>
          </div>
          <svg class="blanket" viewBox="0 0 220 120" aria-hidden="true">
            <path d="M34 72 Q60 62 90 68 Q130 58 170 66 Q196 62 206 70 L210 104 Q120 112 30 104 Z" fill="#ff9fbf"/>
            <path d="M34 72 Q60 62 90 68 Q130 58 170 66 Q196 62 206 70" stroke="#ffc2d6" stroke-width="6" fill="none" stroke-linecap="round"/>
            <g fill="#fff" opacity=".8"><path d="M80 86 c-2-3 -6-1 -4 2 l4 4 4-4 c2-3 -2-5 -4-2z"/><path d="M130 82 c-2-3 -6-1 -4 2 l4 4 4-4 c2-3 -2-5 -4-2z"/>
              <path d="M176 90 c-2-3 -6-1 -4 2 l4 4 4-4 c2-3 -2-5 -4-2z"/></g>
          </svg>
          <div class="zzz" aria-hidden="true"><span>Z</span><span>z</span><span>z</span></div>
          <div class="foes" id="foes"></div>
        </div>
        <div class="pet-say pop" id="pet-say">${esc(fill(line))}</div>
        <div class="pet-btns" id="pet-btns"></div>
      </section>
      <section class="card ${A()}" id="bond-box">${bondHTML()}</section>`;
  }

  function greetWord() {
    const h = new Date().getHours();
    return h < 5 ? '这么晚还没睡' : h < 11 ? '早上好' : h < 13 ? '中午好' : h < 18 ? '下午好' : '晚上好';
  }

  function roomMount() {
    const pet = $('#pet');
    if (!pet) return;
    pet.addEventListener('pointerdown', petDown);
    pet.addEventListener('pointermove', petMove);
    pet.addEventListener('pointerup', petUp);
    pet.addEventListener('pointercancel', () => { clearTimeout(R.pressT); R.press = null; if (R.held) drop(); });
    petButtons(R.stage === 'sleep' ? 'sleep' : 'main');
    R.idle = setInterval(idleTick, 3500);
    if (ui.petStart) { const c = ui.petStart; ui.petStart = null; later(() => petDo(c), 300); }
  }

  // A small 睿睿 peeks in from the corner on other pages when he needs something.
  function updatePeek() {
    const el = $('#peek');
    if (!el) return;
    if (ui.view === 'room') { el.hidden = true; return; }
    petTick();
    const low = lowest(), need = S.pet[low] < 35 && !S.pet.asleep;
    el.hidden = false;
    el.innerHTML = `<button class="peek-btn" data-action="tab" data-view="room" aria-label="去睿睿小窝">
      ${need ? `<span class="peek-say">${esc(fill(pick(NEED_LINES[low])))}</span>` : ''}
      <span class="peek-head">${ruiSVG('', S.pet.asleep ? 'sleep' : need ? 'sad' : 'happy', S.pet.outfit)}</span></button>`;
  }

  // ---------- render ----------
  function render() {
    document.documentElement.dataset.font = S.settings.font === 'xl' ? 'xl' : 'large';
    animIndex = 0;
    const main = $('#main');
    main.innerHTML = ui.view === 'today' ? viewToday() : ui.view === 'room' ? viewRoom() : ui.view === 'trends' ? viewTrends() : viewSettings();
    main.classList.toggle('enter', ui.enter && !reduced);
    ui.enter = false;
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === ui.view));
    afterRender();
    if (ui.view === 'room') roomMount();
    updatePeek();
    if (ui.view === 'today' && ui.ruiFresh) { ui.ruiFresh = false; ui.ruiTap = 1; say(contextLine()); }
  }

  function afterRender() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$('.ring-p').forEach(el => {
        const p = +el.dataset.p, c = +el.dataset.c;
        el.style.strokeDashoffset = c * (1 - p);
        el.style.opacity = p > 0 ? 1 : 0;
        lastP[el.dataset.ring] = p;
      });
      $$('[data-count]').forEach(countUp);
    }));
  }

  function countUp(el) {
    const key = el.dataset.ckey, to = +el.dataset.count, from = lastCount[key] ?? 0;
    lastCount[key] = to;
    if (reduced || from === to) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 900;
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function greeting() {
    const h = new Date().getHours();
    return h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 13 ? '中午好' : h < 18 ? '下午好' : '晚上好';
  }

  // ---------- 睿睿 (perm-haired, glasses) ----------
  // Outfits for the pet room (unlocked by 亲密度); pajama moods always wear pajamas.
  const OUTFIT_LOOK = {
    blue: { shirt: '#4f6fa8', line: '#3d5a8c' }, pink: { shirt: '#f08cae', line: '#d26b90' },
    suit: { shirt: '#2f3240', line: '#1d1f29', bow: true }, chef: { shirt: '#ffffff', line: '#d8d2dc', hat: 'chef' },
    prince: { shirt: '#7b52c4', line: '#5e3aa3', hat: 'crown' },
  };
  function ruiSVG(extra = '', mood = '', outfit = 'blue') {
    const shy = mood === 'shy';
    // 打手 poses: pajamas + nightcap; asleep, just woken, fighting, and fighting with fire in his eyes.
    const pj = ['sleep', 'wake', 'fight', 'rage'].includes(mood), angry = mood === 'fight' || mood === 'rage';
    const skin = '#ffe1c9', hair = '#33241e', hairHi = '#6a5043';
    const look = pj ? { shirt: '#8db6ee', line: '#6a93d2' } : OUTFIT_LOOK[outfit] || OUTFIT_LOOK.blue;
    const shirt = look.shirt, shirtLine = look.line;
    const pants = pj ? '#8db6ee' : look.hat === 'chef' ? '#4a4f63' : '#3a3f55', shoe = pj ? '#ff9fbf' : '#6b4a3a';
    const joy = mood === 'happy' || mood === 'eat';
    // soft perm: scalloped crown + side-swept fringe, short tapered sides
    const crown = [[36,38,8],[40,29,9],[48,22,9.5],[58,18.5,10],[69,19,10],[79,23,9.5],[86,31,8.5],[88,40,7]]
      .map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
    const fringe = [[38,42,5.6],[45,40.5,6],[53,39.2,6.2],[61,38.6,6.2],[69,39.6,6],[76,41.5,5.6],[82,44,5]]
      .map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
    const curlMarks = [[45,28,-12],[57,23,6],[69,25,-8],[79,30,10],[51,34,4],[63,33,-6],[74,37,8],[41,37,-10]]
      .map(([x,y,r]) => `<path transform="rotate(${r} ${x} ${y})" d="M${x-4} ${y+1.5} q4 -5.5 8 0"/>`).join('');
    const flame = x => `<path d="M${x} 69 C${x - 7} 66 ${x - 6} 59 ${x - 2} 54 C${x - 2} 58 ${x + 1} 58 ${x} 52 C${x + 6} 56 ${x + 8} 63 ${x + 4} 67 C${x + 3} 68 ${x + 2} 69 ${x} 69Z" fill="#ff5a1f"/>
      <path d="M${x} 68 C${x - 3.5} 66 ${x - 3} 62 ${x - 1} 60 C${x} 62 ${x + 1.5} 62 ${x + 1} 58.5 C${x + 4} 61 ${x + 4} 65 ${x + 2} 67Z" fill="#ffd23f"/>`;
    const eyes = joy
      ? `<path d="M40 63 Q45 56.5 50 63" stroke="#2a1f1a" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M70 63 Q75 56.5 80 63" stroke="#2a1f1a" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : mood === 'dangle'
      ? `<ellipse cx="45" cy="61" rx="4.6" ry="5.8" fill="#2a1f1a"/><ellipse cx="75" cy="61" rx="4.6" ry="5.8" fill="#2a1f1a"/>
         <circle cx="46.8" cy="58.6" r="1.8" fill="#fff"/><circle cx="76.8" cy="58.6" r="1.8" fill="#fff"/>`
      : mood === 'dizzy'
      ? `<path d="M45 61 m-4 0 a4 4 0 1 1 4 4 a2.6 2.6 0 1 1 -2.6 -2.6" stroke="#2a1f1a" stroke-width="2.2" fill="none"/>
         <path d="M75 61 m-4 0 a4 4 0 1 1 4 4 a2.6 2.6 0 1 1 -2.6 -2.6" stroke="#2a1f1a" stroke-width="2.2" fill="none"/>`
      : mood === 'sad'
      ? `<ellipse cx="45" cy="62" rx="3.6" ry="4.4" fill="#2a1f1a"/><ellipse cx="75" cy="62" rx="3.6" ry="4.4" fill="#2a1f1a"/>
         <circle cx="46.2" cy="60.4" r="1.3" fill="#fff"/><circle cx="76.2" cy="60.4" r="1.3" fill="#fff"/>
         <path d="M41 70 q-2.6 4.6 0 6.6 q2.6 -2 0 -6.6z" fill="#7cc4ff"/>`
      : mood === 'sleep'
      ? `<path d="M40 61 Q45 65.5 50 61" stroke="#2a1f1a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
         <path d="M70 61 Q75 65.5 80 61" stroke="#2a1f1a" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
      : mood === 'wake'
      ? `<ellipse cx="45" cy="63" rx="3.8" ry="2.6" fill="#2a1f1a"/><ellipse cx="75" cy="63" rx="3.8" ry="2.6" fill="#2a1f1a"/>
         <path d="M39.5 60.5 H50.5 M69.5 60.5 H80.5" stroke="#2a1f1a" stroke-width="2.4" stroke-linecap="round"/>`
      : mood === 'rage' ? flame(45) + flame(75)
      : shy
      ? `<path d="M40 61 Q45 56 50 61" stroke="#2a1f1a" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M70 61 Q75 56 80 61" stroke="#2a1f1a" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse class="eye" cx="45" cy="61" rx="4.2" ry="5.2" fill="#2a1f1a"/><ellipse class="eye" cx="75" cy="61" rx="4.2" ry="5.2" fill="#2a1f1a"/>
         <circle cx="46.6" cy="59" r="1.6" fill="#fff"/><circle cx="76.6" cy="59" r="1.6" fill="#fff"/>
         <circle cx="43.7" cy="63" r=".85" fill="#fff" opacity=".8"/><circle cx="73.7" cy="63" r=".85" fill="#fff" opacity=".8"/>`;
    const brows = mood === 'sad' || mood === 'dangle'
      ? `<path d="M39 51 L51 47.5" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M81 51 L69 47.5" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : angry
      ? `<path d="M37.5 48 L52 54" stroke="${hair}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
         <path d="M82.5 48 L68 54" stroke="${hair}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
      : shy
      ? `<path d="M39 50.5 Q45 49 51 51" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M69 51 Q75 49 81 50.5" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path d="M39 51.5 Q45 47.5 51.5 50" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M68.5 50 Q75 47.5 81 51.5" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const mouth = mood === 'happy'
      ? `<path d="M52 77 Q60 88 68 77 Z" fill="#a24b3c"/><path d="M55 81.5 Q60 85 65 81.5" stroke="#ff8f9c" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
      : mood === 'eat' ? `<ellipse class="chomp" cx="60" cy="80" rx="6" ry="4.5" fill="#a24b3c"/>`
      : mood === 'sad' ? `<path d="M54 82 Q60 77 66 82" stroke="#a24b3c" stroke-width="2.7" fill="none" stroke-linecap="round"/>`
      : mood === 'dangle' ? `<ellipse cx="60" cy="80.5" rx="3.4" ry="4" fill="#a24b3c"/>`
      : mood === 'dizzy' ? `<path d="M52 80 q2 -3 4 0 t4 0 t4 0 t4 0" stroke="#a24b3c" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
      : angry
      ? `<rect x="52" y="76" width="16" height="7.5" rx="3.5" fill="#fff" stroke="#a24b3c" stroke-width="2.2"/>
         <path d="M56.5 76.5v6.5M60 76.5v6.5M63.5 76.5v6.5M52.5 79.7h15" stroke="#a24b3c" stroke-width="1.2"/>`
      : mood === 'sleep' ? `<ellipse cx="60" cy="80" rx="2.6" ry="2.2" fill="#a24b3c"/>`
      : mood === 'wake' ? `<ellipse cx="60" cy="80.5" rx="4" ry="5" fill="#a24b3c"/><ellipse cx="60" cy="83" rx="2.4" ry="1.6" fill="#e77b7b"/>`
      : shy
      ? `<path d="M55 80 Q60 83 65 80" stroke="#a24b3c" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<path class="mouth" d="M53 79 Q62 84.5 69.5 77" stroke="#a24b3c" stroke-width="2.7" fill="none" stroke-linecap="round"/>`;
    const hearts = shy ? `<g class="hearts" fill="#ff5c8a">
        <path d="M101 22 c-3-5 -10-2 -7 3 l7 7 7-7 c3-5 -4-8 -7-3z"/>
        <path d="M16 30 c-2-4 -8-2 -6 2 l6 6 6-6 c2-4 -4-6 -6-2z" opacity=".8"/></g>` : '';
    const sleeve = c => `stroke="${c}" stroke-width="10" stroke-linecap="round" fill="none"`;
    const arms = mood === 'dangle'
      ? `<path d="M34 112 Q22 100 25 86" ${sleeve(shirt)}/><circle cx="25.5" cy="82" r="6" fill="${skin}"/>
         <path d="M86 112 Q98 100 95 86" ${sleeve(shirt)}/><circle cx="94.5" cy="82" r="6" fill="${skin}"/>`
      : mood === 'eat'
      ? `<path d="M34 112 Q29 122 31 134" ${sleeve(shirt)}/><path d="M86 112 Q96 104 80 94" ${sleeve(shirt)}/><circle cx="76" cy="92" r="6" fill="${skin}"/>`
      : angry
      ? `<path d="M34 112 Q29 122 31 134" ${sleeve(shirt)}/>
         <g class="bat-arm"><g transform="rotate(24 103.5 86)"><rect x="99.5" y="32" width="8.5" height="58" rx="4.2" fill="#c0844a"/>
           <rect x="99.5" y="32" width="8.5" height="10" rx="4.2" fill="#a46a36"/><path d="M99.5 70h8.5M99.5 74h8.5" stroke="#fff" stroke-width="2.2" opacity=".9"/></g>
           <path d="M87 112 Q101 104 103 90" ${sleeve(shirt)}/><circle cx="103.5" cy="86" r="6.5" fill="${skin}"/></g>`
      : mood === 'wake'
      ? `<path d="M34 112 Q29 122 31 134" ${sleeve(shirt)}/>
         <path d="M87 112 Q98 98 88 80" ${sleeve(shirt)}/><circle cx="86" cy="76" r="6.5" fill="${skin}"/>`
      : mood === 'sleep'
      ? `<path d="M34 112 Q29 122 31 134" ${sleeve(shirt)}/><path d="M86 112 Q91 122 89 134" ${sleeve(shirt)}/>`
      : shy
      ? `<path d="M34 114 Q30 96 38 86" ${sleeve(shirt)}/>
         <circle cx="39" cy="83" r="6" fill="${skin}"/>
         <path d="M86 114 Q90 96 82 86" ${sleeve(shirt)}/>
         <circle cx="81" cy="83" r="6" fill="${skin}"/>`
      : `<path d="M34 112 Q29 122 31 134" ${sleeve(shirt)}/>
         <g class="arm"><path d="M87 112 Q101 104 103 90" ${sleeve(shirt)}/>
         <circle cx="103.5" cy="86" r="6.5" fill="${skin}"/></g>`;
    return `<svg class="rui ${extra} ${shy ? 'shy' : ''}" viewBox="0 0 120 142" aria-hidden="true">
      <ellipse cx="60" cy="138" rx="27" ry="4" fill="#000" opacity=".08"/>
      <g transform="translate(60 141) scale(1.1) translate(-60 -141)">
      <g transform="translate(60 128) scale(.66) translate(-60 -138)">
      <rect x="53.5" y="86" width="13" height="18" rx="5" fill="#f3c9a9"/>
      <g class="leg-l"><path d="M49 132 V149" stroke="${pants}" stroke-width="13" stroke-linecap="round"/><ellipse cx="47" cy="152" rx="10" ry="5" fill="${shoe}"/></g>
      <g class="leg-r"><path d="M71 132 V149" stroke="${pants}" stroke-width="13" stroke-linecap="round"/><ellipse cx="73" cy="152" rx="10" ry="5" fill="${shoe}"/></g>
      <path d="M26 138 Q27 106 60 104 Q93 106 94 138 Z" fill="${shirt}" ${look.hat === 'chef' ? 'stroke="#d8d2dc" stroke-width="2"' : ''}/>
      ${pj ? `<g fill="#fff" opacity=".85"><circle cx="40" cy="122" r="2.2"/><circle cx="80" cy="126" r="2.2"/><circle cx="48" cy="133" r="1.8"/><circle cx="73" cy="114" r="1.8"/></g>
        <path d="M50 104 L60 115 L70 104 Z" fill="#dce9fb"/><circle cx="60" cy="122" r="1.9" fill="#fff"/><circle cx="60" cy="130" r="1.9" fill="#fff"/>`
      : `<path d="M50 104 L60 118 L70 104 Z" fill="#fff"/>`}
      ${look.bow ? `<path d="M51 106 L59 110 L51 114 Z M69 106 L61 110 L69 114 Z" fill="#e34948"/><circle cx="60" cy="110" r="2.6" fill="#c43535"/>` : ''}
      ${look.hat === 'chef' ? `<path d="M60 106 v30" stroke="#e6e0ea" stroke-width="2"/><circle cx="64" cy="118" r="1.8" fill="#d8d2dc"/><circle cx="64" cy="127" r="1.8" fill="#d8d2dc"/>` : ''}
      <path d="M50 104 L44 116 M70 104 L76 116" stroke="${shirtLine}" stroke-width="2.2" stroke-linecap="round"/>
      ${arms}
      </g>
      <g transform="translate(0 14)">
      <g class="rui-head">
        <ellipse cx="29.5" cy="63" rx="5.5" ry="7" fill="#f7cbab"/><ellipse cx="90.5" cy="63" rx="5.5" ry="7" fill="#f7cbab"/>
        <path d="M31 56 Q31 33 60 31 Q89 33 89 56 Q89 78 75 89 Q60 98 45 89 Q31 78 31 56 Z" fill="${skin}"/>
        <g fill="${hair}">
          <path d="M30.5 62 Q28 40 42 28 Q60 17 78 25 Q92 34 89.5 62 Q88 52 84 47 Q74 42 60 42 Q46 42 37 47 Q32 52 30.5 62 Z"/>
          ${crown}${fringe}
        </g>
        <g stroke="${hairHi}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9">${curlMarks}</g>
        <path d="M47 21 Q58 14 71 18" stroke="#7a6052" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
        ${brows}
        ${eyes}
        <g fill="rgba(255,255,255,.16)" stroke="#232323" stroke-width="2.1">
          <rect x="34.5" y="53" width="21" height="16" rx="8"/><rect x="64.5" y="53" width="21" height="16" rx="8"/></g>
        <path d="M55.5 59 Q60 56.5 64.5 59" stroke="#232323" stroke-width="2.1" fill="none"/>
        <path d="M34 57 L31 56 M86 57 L89 56" stroke="#232323" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M60.5 66 Q58.5 71.5 61.5 72.5" stroke="#e3a78a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="38" cy="76" rx="${shy ? 7.5 : 5}" ry="${shy ? 4.5 : 3}" fill="#ff9aa8" opacity="${shy ? 0.8 : 0.45}"/>
        <ellipse cx="82" cy="76" rx="${shy ? 7.5 : 5}" ry="${shy ? 4.5 : 3}" fill="#ff9aa8" opacity="${shy ? 0.8 : 0.45}"/>
        ${mouth}
        ${pj ? `<g transform="translate(13 -10) scale(.8)"><path d="M30 47 Q28 20 54 13 Q80 8 95 25 Q104 37 107 55 Q98 44 89 41 Q70 33 30 47Z" fill="#7aa5e8"/>
          <g fill="#ffe27a"><circle cx="52" cy="25" r="2"/><circle cx="72" cy="20" r="1.7"/><circle cx="86" cy="31" r="1.6"/></g>
          <path d="M29 47 Q58 30 90 42" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
          <circle class="pom" cx="107" cy="57" r="6.5" fill="#fff"/></g>` : ''}
        ${look.hat === 'chef' ? `<g fill="#fff" stroke="#e3dde8" stroke-width="1.6"><rect x="41" y="14" width="38" height="14" rx="3"/>
          <circle cx="47" cy="10" r="9"/><circle cx="60" cy="5" r="11"/><circle cx="73" cy="10" r="9"/></g><rect x="41.8" y="20" width="36.4" height="7.4" fill="#fff"/>` : ''}
        ${look.hat === 'crown' ? `<path d="M43 26 L45 9 L52.5 17 L60 5 L67.5 17 L75 9 L77 26 Z" fill="#f5c542" stroke="#d49a1c" stroke-width="1.6" stroke-linejoin="round"/>
          <circle cx="60" cy="19" r="2.6" fill="#e34948"/><circle cx="50" cy="21" r="1.8" fill="#4aa3f0"/><circle cx="70" cy="21" r="1.8" fill="#4aa3f0"/>` : ''}
        ${mood === 'dizzy' ? `<g class="dizzy-stars" fill="#ffc83d"><path d="M22 30 l2 4 4 .6 -3 2.8 .8 4 -3.8 -2 -3.8 2 .8 -4 -3 -2.8 4 -.6z"/><path d="M96 24 l1.6 3.2 3.4.5 -2.5 2.3 .6 3.3 -3.1 -1.6 -3.1 1.6 .6 -3.3 -2.5 -2.3 3.4 -.5z"/></g>` : ''}
        ${mood === 'rage' ? `<ellipse cx="38" cy="76" rx="8" ry="4.5" fill="#ff5a5a" opacity=".55"/><ellipse cx="82" cy="76" rx="8" ry="4.5" fill="#ff5a5a" opacity=".55"/>` : ''}
      </g>
      ${mood === 'rage' ? `<g class="anger" stroke="#e8203a" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M14 30 q5 0 5 -5"/><path d="M24 25 q0 5 5 5"/><path d="M14 36 q5 0 5 5"/><path d="M29 36 q-5 0 -5 5"/></g>` : ''}
      ${hearts}
      </g></g>
    </svg>`;
  }

  function contextLine() {
    const t = todayKey(), n = who();
    if (ui.day !== t) return `在补记 ${fmtDate(ui.day)} 的哦，${n}吃过的、做过的都点上～`;
    const st = stats(t), hour = new Date().getHours(), ci = cycleInfo();
    if (ci.current && ci.dayOf <= 2) return `例假第 ${ci.dayOf} 天，热水袋安排上 🔥 今天谁惹${n}，睿睿咬谁！`;
    const due = hour >= 21 ? ['bedtime', 'evening', 'noon', 'morning'] : hour >= 17 ? ['evening', 'noon', 'morning']
      : hour >= 11 ? ['noon', 'morning'] : hour >= 5 ? ['morning'] : [];
    for (const s of due) {
      const p = st.ms.filter(m => m.slots.includes(s) && !mt(t, m.id, s));
      if (!p.length) continue;
      if (p.some(m => m.name.includes('避孕'))) return `${n}！避孕药吃了没？吃了点一下，不然睿睿要念叨到你吃为止 😤`;
      return `${n}，${SLOTS[s]}的${p.map(m => m.name).slice(0, 2).join('、')}还没吃哦，吃完点一下～`;
    }
    const yesterday = addDays(t, -1);
    const missed = activeMeds(yesterday).filter(m => m.name.includes('避孕') && m.slots.some(s => !mt(yesterday, m.id, s)));
    if (missed.length && hour < 21) return `${n}，昨天的避孕药好像没记！吃了的话去昨天补一下；真漏了就按说明书处理哦 📋`;
    if (ci.current) return `例假第 ${ci.dayOf} 天，少吃冰的，多抱抱自己 🤗`;
    if (ci.untilNext !== null && ci.untilNext >= 0 && ci.untilNext <= 3) return `${n}，大姨妈大概 ${ci.untilNext ? ci.untilNext + ' 天后' : '今天'}来，卫生巾带了没？这几天脾气不好全算领导的 😤`;
    if (ci.untilNext !== null && ci.untilNext < 0 && ci.untilNext > -20) return `例假比预计晚了 ${-ci.untilNext} 天，别慌，压力大也会推迟～实在担心就测一下 💗`;
    const water = st.hs.find(h => h.name.includes('水'));
    if (water && hv(t, water.id) < water.goal && hour >= 10) return `${n}，喝口水再骂领导，嗓子要紧 💧 还差 ${water.goal - hv(t, water.id)} 杯`;
    if (st.overall >= 1) return `今天全部搞定！${n}就是人间清醒本醒 👑`;
    return Math.random() < 0.5 ? fill(pick(WORK)) : roastLine();
  }

  function nextRuiLine() {
    const k = ui.ruiTap++ % 5;
    if (k === 0) return contextLine();
    if (k === 1) {
      const total = totalHearts(), lv = levelOf(total);
      return `今天攒了 ${heartsOn(todayKey())} 颗小爱心 💗 一共 ${total} 颗，现在是「${lv.name}」${lv.icon}` +
        (lv.next ? `，再 ${lv.next.at - total} 颗升级！` : '，已经封顶啦！');
    }
    const r = Math.random();
    return r < 0.35 ? fill(pick(WORK)) : r < 0.8 ? roastLine() : soupLine();
  }

  let typeTimer;
  function say(text) {
    ui.ruiText = text;
    const ghost = $('#rui-ghost'), live = $('#rui-live');
    if (!ghost) return;
    ghost.textContent = text;
    clearInterval(typeTimer);
    const svg = $('.rui-btn .rui');
    if (svg) { svg.classList.remove('talk'); void svg.getBoundingClientRect(); svg.classList.add('talk'); }
    if (reduced) { live.textContent = text; return; }
    const chars = Array.from(text);
    let i = 0;
    live.textContent = '';
    typeTimer = setInterval(() => {
      live.textContent = chars.slice(0, ++i).join('');
      if (i >= chars.length) clearInterval(typeTimer);
    }, 38);
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) { toast('这台手机暂时不能朗读'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ''));
    u.lang = 'zh-CN';
    u.rate = 0.9;
    const v = speechSynthesis.getVoices().find(x => /zh[-_]CN/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  function ruiCard(day) {
    const total = totalHearts(), lv = levelOf(total);
    return `<section class="card rui-card ${A()}">
      <div class="rui-row">
        <button class="rui-btn" data-action="rui" aria-label="戳一下睿睿">${ruiSVG()}</button>
        <div class="bubble">
          <div class="bubble-text"><span class="bt-ghost" id="rui-ghost">${esc(ui.ruiText)}</span><span id="rui-live">${esc(ui.ruiText)}</span></div>
          <div class="bubble-hint">戳戳睿睿，换一句</div>
        </div>
      </div>
      <div class="bubble-actions">
        <button class="mini-btn" data-action="rui-roast">🗯️ 帮我骂两句</button>
        <button class="mini-btn" data-action="rui-soup">🍵 来碗鸡汤</button>
        <button class="mini-btn" data-action="go-fight">🥊 有人欺负我</button>
      </div>
      <div class="flower-bar">${day === todayKey() ? '今天' : '这天'} <b>💗 × ${heartsOn(day)}</b><span>· 一共 ${total} 颗</span><span class="lv">${lv.icon} ${lv.name}</span></div>
    </section>`;
  }

  function periodCard() {
    const ci = cycleInfo(), t = todayKey();
    let big, sub, btn, ringP;
    if (!ci.last) {
      big = '还没有记录';
      sub = '例假来的时候点一下，睿睿帮你算下次什么时候来';
      btn = `<button class="btn btn-period btn-wide" data-action="period-start">🩸 例假来了</button>`;
      ringP = 0;
    } else if (ci.current) {
      big = `例假第 <b>${ci.dayOf}</b> 天`;
      sub = `一般持续 ${ci.plen} 天左右 · 注意保暖，多喝热水 ☕`;
      btn = `<button class="btn btn-period btn-wide" data-action="period-end">✓ 例假走了</button>`;
      ringP = Math.min(1, ci.dayOf / ci.plen);
    } else {
      const u = ci.untilNext;
      big = u > 0 ? `距离下次例假 <b>${u}</b> 天` : u === 0 ? '预计<b>今天</b>来例假' : `比预计晚了 <b>${-u}</b> 天`;
      sub = `预计 ${fmtDate(ci.nextStart)} · 周期约 ${ci.cycle} 天 · 现在是周期第 ${ci.cycleDay} 天`;
      btn = `<button class="btn btn-period btn-wide" data-action="period-start">🩸 例假来了</button>`;
      ringP = Math.min(1, ci.cycleDay / ci.cycle);
    }
    return `<section class="card period-card ${ci.current ? 'on' : ''} ${A()}">
      <div class="habit-top">
        <div class="mini-ring"><svg viewBox="0 0 84 84" aria-hidden="true">${ring('period', ringP, PERIOD, 42, 36, 10, '#fbdada')}</svg><span class="mini-icon">${ci.current ? '🩸' : '🌸'}</span></div>
        <div class="habit-info"><div class="card-title" style="font-size:1rem;color:var(--ink2)">例假</div><div class="period-big">${big}</div></div>
      </div>
      <div class="card-sub" style="margin-top:8px">${sub}</div>
      <div class="habit-actions">${btn}</div>
      ${ci.last ? `<button class="link-btn" data-action="period-edit">记错了？修改记录</button>` : ''}
    </section>`;
  }

  function loveCard(day) {
    if (S.settings.hideLove && !ui.loveOpen) {
      return `<section class="card love-cover ${A()}" data-action="love-reveal" role="button" aria-label="打开小秘密">
        <span class="lc-icon">🙈</span><div><div class="card-title">小秘密</div><div class="card-sub">点一下打开（上班时不怕别人瞄到）</div></div>
      </section>`;
    }
    const ym = day.slice(0, 7), month = loveInMonth(ym), today = loveOn(day);
    const [y, m] = ym.split('-').map(Number);
    const prev = new Date(y, m - 2, 1), prevYm = `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}`;
    return `<section class="card love-card ${A()}">
      <div class="love-row">
        <div class="love-rui">${ruiSVG('', 'shy')}</div>
        <div style="flex:1">
          <div class="card-title">💕 亲密时光</div>
          <div class="love-num"><span data-count="${month}" data-ckey="love-${ym}">0</span><small> 次 · ${m}月</small></div>
          <div class="card-sub">${day === todayKey() ? '今天' : fmtDate(day)} ${today} 次 · 上个月 ${loveInMonth(prevYm)} 次</div>
        </div>
      </div>
      <div class="quick" style="margin-top:12px">
        <button class="btn btn-soft love-soft" data-action="love-add" data-n="-1" aria-label="减一">－1</button>
        <button class="btn btn-love grow" data-action="love-add" data-n="1">＋1 💕</button>
      </div>
      ${S.settings.hideLove ? '<button class="link-btn" data-action="love-hide">🙈 收起来</button>' : ''}
    </section>`;
  }

  // ---------- today ----------
  function viewToday() {
    const day = ui.day, isToday = day === todayKey(), st = stats(day);
    const totalPct = pct(st.overall);
    const showFrom = lastCount.hero ?? 0;
    let html = `
      <header class="today-head">
        <div class="date-nav">
          <button class="nav-btn" data-action="day-prev" aria-label="看前一天">‹</button>
          <div class="date-mid">
            <div class="date-big">${fmtDate(day)}</div>
            <div class="date-sub">${isToday ? '今天 · ' : ''}星期${weekdayOf(day)}</div>
          </div>
          <button class="nav-btn" data-action="day-next" aria-label="看后一天" ${isToday ? 'disabled' : ''}>›</button>
        </div>
        ${isToday ? '' : `<div class="past-banner">正在看 ${fmtDate(day)} 的记录，可以补记 <button class="btn btn-small" data-action="day-today">回到今天</button></div>`}
      </header>
      ${ruiCard(day)}

      <section class="card hero ${A()}">
        <div class="hero-ring">
          ${doubleRing('hero', st, 220, 22)}
          <div class="hero-center">
            <div class="hero-pct"><span data-count="${totalPct}" data-ckey="hero">${showFrom}</span><small>%</small></div>
            <div class="hero-cap">${isToday ? '今天' : '这天'}完成度</div>
          </div>
        </div>
        <div class="legend">
          <div class="legend-row"><span class="dot" style="background:${HABIT_RING}"></span>外圈 · 习惯<span class="lv">${st.hs.length ? `${st.hDone} / ${st.hs.length} 项` : '未设置'}</span></div>
          <div class="legend-row"><span class="dot" style="background:${MED_RING}"></span>内圈 · 吃药<span class="lv">${st.exp ? `${st.tak} / ${st.exp} 次` : '未设置'}</span></div>
        </div>
      </section>`;

    html += `<h2 class="sec-title ${A()}">🌸 例假</h2>` + periodCard();
    html += `<h2 class="sec-title ${A()}">💊 吃药${st.exp ? `<span class="sec-note">${st.tak === st.exp ? '✓ 都吃了' : `还差 ${st.exp - st.tak} 次`}</span>` : ''}</h2>`;
    html += medSection(day, st);

    html += `<h2 class="sec-title ${A()}">💧 每日习惯${st.hs.length ? `<span class="sec-note">达标 ${st.hDone} / ${st.hs.length}</span>` : ''}</h2>`;
    html += st.hs.length
      ? st.hs.map(h => habitCard(day, h, isToday)).join('')
      : emptyCard('⭐', '还没有添加习惯', '比如喝水、运动', '去添加习惯', 'add-habit');

    html += `<h2 class="sec-title ${A()}">💕 小秘密</h2>` + loveCard(day);
    html += `<p class="foot-note">数据只保存在这台手机上 · 记得偶尔在「设置」里备份</p>`;
    return html;
  }

  function emptyCard(icon, title, text, btn, action) {
    return `<div class="card empty ${A()}"><div class="e-icon">${icon}</div><div class="e-title">${title}</div>
      <div class="e-text">${text}</div><button class="btn btn-primary" data-action="${action}">${btn}</button></div>`;
  }

  function medSection(day, st) {
    if (!st.ms.length) return emptyCard('💊', '还没有添加药品', '把每天要吃的药和保健品加进来', '去添加药品', 'add-med');
    let out = '';
    for (const kind of ['medicine', 'supplement']) {
      const list = st.ms.filter(m => m.kind === kind);
      if (!list.length) continue;
      let e = 0, t = 0;
      list.forEach(m => m.slots.forEach(s => { e++; if (mt(day, m.id, s)) t++; }));
      out += `<div class="group-title ${A()}"><span class="kind kind-${kind}">${KINDS[kind].icon} ${KINDS[kind].label}</span><span class="group-count">${t} / ${e} 次</span></div>`;
      out += list.map(m => medCard(day, m)).join('');
    }
    return out;
  }

  function takenLabel(day, ts) {
    return dkey(new Date(ts)) === day ? `已吃 ${fmtTime(ts)}` : '已补记';
  }

  function medCard(day, m) {
    const slots = sortedSlots(m.slots);
    const allDone = slots.every(s => mt(day, m.id, s));
    const dose = [m.dose ? `每次 ${esc(m.dose)}` : '', m.note ? esc(m.note) : ''].filter(Boolean).join(' · ');
    return `<div class="card med ${allDone ? 'done' : ''} ${A()}">
      <div class="med-top">
        <div style="flex:1;min-width:0"><div class="med-name">${esc(m.name)}</div>${dose ? `<div class="med-dose">${dose}</div>` : ''}</div>
        ${allDone ? '<span class="chip-done">✓ 吃完了</span>' : ''}
      </div>
      <div class="slots">${slots.map(s => {
        const t = mt(day, m.id, s), key = `${m.id}:${s}`;
        return `<button class="slot ${t ? 'taken' : ''} ${ui.pop === key ? 'pop' : ''}" data-action="med" data-id="${m.id}" data-slot="${s}"
          aria-label="${SLOTS[s]}的${esc(m.name)}，${t ? '已经吃了' : '还没吃'}">
          <span class="slot-name">${t ? '✓ ' : SLOT_ICON[s] + ' '}${SLOTS[s]}</span>
          <span class="slot-sub">${t ? takenLabel(day, t) : '还没吃 · 点一下'}</span></button>`;
      }).join('')}</div>
    </div>`;
  }

  function habitCard(day, h, isToday) {
    const v = hv(day, h.id), p = clamp01(v / h.goal), done = v >= h.goal;
    const c = colorOf(h), unit = esc(unitOf(h));
    const timer = S.timers[h.id];
    const value = h.type === 'check'
      ? (done ? '做到了 👏' : '还没做')
      : `<b>${v}</b> / ${h.goal} ${unit}`;
    let actions = '', edit = '';
    if (h.type === 'minutes') {
      if (timer && isToday) {
        actions = `<div class="timer-box"><div class="timer-label">⏱️ 正在计时</div>
          <div class="timer-display" data-timer="${h.id}">${fmtDur(Date.now() - timer)}</div>
          <button class="btn btn-primary btn-wide" data-action="timer-stop" data-id="${h.id}">⏹ 停止并记录</button></div>`;
      } else {
        actions = `<div class="quick">${[5, 10, 15].map(n =>
          `<button class="btn btn-soft" data-action="habit-add" data-id="${h.id}" data-n="${n}">+${n}<small>分钟</small></button>`).join('')}</div>` +
          (isToday ? `<button class="btn btn-primary btn-wide" data-action="timer-start" data-id="${h.id}">▶ 开始计时</button>` : '');
      }
      edit = `<button class="link-btn" data-action="habit-set" data-id="${h.id}">记错了？修改数字</button>`;
    } else if (h.type === 'count') {
      actions = `<div class="quick">
        <button class="btn btn-soft" data-action="habit-add" data-id="${h.id}" data-n="-1" aria-label="减一">－1</button>
        <button class="btn btn-primary grow" data-action="habit-add" data-id="${h.id}" data-n="1">＋1 ${unit}</button></div>`;
      edit = `<button class="link-btn" data-action="habit-set" data-id="${h.id}">修改数字</button>`;
    } else {
      actions = done
        ? `<button class="btn btn-done btn-wide" data-action="habit-check" data-id="${h.id}">✓ 今天做到了</button>`
        : `<button class="btn btn-primary btn-wide" data-action="habit-check" data-id="${h.id}">✓ 我做到了</button>`;
    }
    return `<div class="card habit ${done ? 'done' : ''} ${ui.pop === h.id ? 'pop' : ''} ${A()};--c:${c};--on:${onColorOf(h)}">
      <div class="habit-top">
        <div class="mini-ring"><svg viewBox="0 0 84 84" aria-hidden="true">${ring(`h-${h.id}`, p, c, 42, 36, 10, c + '2e')}</svg><span class="mini-icon">${h.icon}</span></div>
        <div class="habit-info"><div class="habit-name">${esc(h.name)}</div><div class="habit-val">${value}</div></div>
        ${done ? '<span class="chip-done">✓ 达标</span>' : ''}
      </div>
      <div class="habit-actions">${actions}</div>${edit}
    </div>`;
  }

  // ---------- trends ----------
  function lastNDays(n) {
    const t = todayKey();
    return Array.from({ length: n }, (_, i) => addDays(t, i - n + 1));
  }

  function viewTrends() {
    return `<header class="page-head"><h1>我的趋势</h1><p>看看这段时间坚持得怎么样</p></header>
      <div class="seg ${A()}">
        <button class="${ui.trend === 'week' ? 'on' : ''}" data-action="trend" data-mode="week">最近 7 天</button>
        <button class="${ui.trend === 'month' ? 'on' : ''}" data-action="trend" data-mode="month">按月看</button>
      </div>
      ${ui.trend === 'week' ? trendWeek() : trendMonth()}`;
  }

  function medSummary(days) {
    let exp = 0, tak = 0;
    days.forEach(d => { const st = stats(d); exp += st.exp; tak += st.tak; });
    return { exp, tak, rate: exp ? tak / exp : null };
  }

  function trendWeek() {
    const days = lastNDays(7), t = todayKey();
    const ms = medSummary(days), streak = medStreak();
    let html = `<section class="card ${A()}">
      <div class="card-title">每天完成度</div>
      <div class="card-sub">点一下圆圈，看那天的详细记录</div>
      <div class="week-rings">${days.map(d => {
        const st = stats(d);
        return `<button class="day-ring" data-action="day-detail" data-day="${d}" aria-label="${fmtDate(d)} 完成${pct(st.overall)}%">
          ${doubleRing('w-' + d, st, 64, 8)}
          <span class="dr-lbl ${d === t ? 'today' : ''}">${d === t ? '今天' : '周' + weekdayOf(d)}</span>
          <span class="dr-pct">${st.empty ? '–' : pct(st.overall) + '%'}</span></button>`;
      }).join('')}</div>
      <div class="mini-legend"><span><i class="dot" style="background:${HABIT_RING}"></i>外圈 习惯</span><span><i class="dot" style="background:${MED_RING}"></i>内圈 吃药</span></div>
    </section>`;

    html += `<div class="tiles ${A()}">
      <div class="tile"><div class="tile-label">💊 按时吃药</div>
        <div class="tile-value">${ms.rate === null ? '–' : `<span data-count="${pct(ms.rate)}" data-ckey="rate7">0</span><small>%</small>`}</div>
        <div class="tile-note">${ms.exp ? `7 天吃了 ${ms.tak} / ${ms.exp} 次` : '还没有药品'}</div></div>
      <div class="tile"><div class="tile-label">🔥 连续全吃</div>
        <div class="tile-value"><span data-count="${streak}" data-ckey="streak">0</span><small>天</small></div>
        <div class="tile-note">${streak ? '每天的药都吃了' : '从今天开始吧'}</div></div>
    </div>`;

    html += flowerTile();
    html += cycleCard();
    html += medTable(days);
    activeOrUsedHabits(days).forEach(h => { html += habitWeekCard(h, days); });
    html += loveTrend();
    return html;
  }

  function cycleCard() {
    const ci = cycleInfo();
    if (!ci.last) return '';
    const hist = ci.ps.slice(-6).reverse().map((p, i, arr) => {
      const len = daysBetween(p.start, periodEnd(p, ci.plen)) + 1;
      const prev = arr[i + 1];
      return `<div class="detail-row"><span>🩸</span>${fmtDate(p.start)}<span class="dv">持续 ${len} 天${prev ? `<br><span class="card-sub">间隔 ${daysBetween(prev.start, p.start)} 天</span>` : ''}</span></div>`;
    }).join('');
    return `<section class="card ${A()}">
      <div class="card-title">🌸 例假周期</div>
      <div class="tiles" style="margin:12px 0 4px">
        <div class="tile soft-tile"><div class="tile-label">平均周期</div><div class="tile-value">${ci.cycle}<small>天</small></div></div>
        <div class="tile soft-tile"><div class="tile-label">平均经期</div><div class="tile-value">${ci.plen}<small>天</small></div></div>
      </div>
      <div class="card-sub">下次预计 ${fmtDate(ci.nextStart)}${ci.ps.length < 3 ? ' · 记录满 3 次以后会更准' : ''}</div>
      <div class="detail-list" style="margin-top:10px">${hist}</div>
    </section>`;
  }

  function loveTrend() {
    if (S.settings.hideLove && !ui.loveOpen) return '';
    const t = todayKey(), months = [];
    for (let i = 5; i >= 0; i--) {
      const d = parseKey(t); d.setDate(1); d.setMonth(d.getMonth() - i);
      months.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
    }
    const vals = months.map(loveInMonth), max = Math.max(4, ...vals);
    const W = 340, H = 170, top = 26, bottom = 30, slot = W / 6, bw = 30, ph = H - top - bottom;
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="最近6个月亲密次数">`;
    svg += `<line x1="0" x2="${W}" y1="${top + ph}" y2="${top + ph}" stroke="#c3c2b7"/>`;
    months.forEach((ym, i) => {
      const v = vals[i], cx = slot * i + slot / 2, h = ph * v / max, isNow = i === 5;
      if (v) svg += `<path d="${barPath(cx - bw / 2, top + ph - h, bw, h, 4)}" fill="#e87ba4" opacity="${isNow ? 1 : 0.6}"/>`;
      svg += `<text x="${cx}" y="${top + ph - h - 7}" text-anchor="middle" font-size="14" font-weight="800" fill="${isNow ? '#0b0b0b' : '#52514e'}">${v}</text>`;
      svg += `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="14" font-weight="700" fill="${isNow ? '#a3285a' : '#52514e'}">${+ym.slice(5)}月</text>`;
    });
    return `<section class="card ${A()}"><div class="card-title">💕 亲密时光 · 最近半年</div>
      <div class="card-sub">每个月的次数</div><div class="chart">${svg}</svg></div></section>`;
  }

  function cycleCard() {
    const ci = cycleInfo();
    if (!ci.last) return '';
    const hist = ci.ps.slice(-6).reverse().map((p, i, arr) => {
      const len = daysBetween(p.start, periodEnd(p, ci.plen)) + 1;
      const prev = arr[i + 1];
      return `<div class="detail-row"><span>🩸</span>${fmtDate(p.start)}<span class="dv">持续 ${len} 天${prev ? `<br><span class="card-sub">间隔 ${daysBetween(prev.start, p.start)} 天</span>` : ''}</span></div>`;
    }).join('');
    return `<section class="card ${A()}">
      <div class="card-title">🌸 例假周期</div>
      <div class="tiles" style="margin:12px 0 4px">
        <div class="tile soft-tile"><div class="tile-label">平均周期</div><div class="tile-value">${ci.cycle}<small>天</small></div></div>
        <div class="tile soft-tile"><div class="tile-label">平均经期</div><div class="tile-value">${ci.plen}<small>天</small></div></div>
      </div>
      <div class="card-sub">下次预计 ${fmtDate(ci.nextStart)}${ci.ps.length < 3 ? ' · 记录满 3 次以后会更准' : ''}</div>
      <div class="detail-list" style="margin-top:10px">${hist}</div>
    </section>`;
  }

  function loveTrend() {
    if (S.settings.hideLove && !ui.loveOpen) return '';
    const t = todayKey(), months = [];
    for (let i = 5; i >= 0; i--) {
      const d = parseKey(t); d.setDate(1); d.setMonth(d.getMonth() - i);
      months.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
    }
    const vals = months.map(loveInMonth), max = Math.max(4, ...vals);
    const W = 340, H = 170, top = 26, bottom = 30, slot = W / 6, bw = 30, ph = H - top - bottom;
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="最近6个月亲密次数">`;
    svg += `<line x1="0" x2="${W}" y1="${top + ph}" y2="${top + ph}" stroke="#c3c2b7"/>`;
    months.forEach((ym, i) => {
      const v = vals[i], cx = slot * i + slot / 2, h = ph * v / max, isNow = i === 5;
      if (v) svg += `<path d="${barPath(cx - bw / 2, top + ph - h, bw, h, 4)}" fill="#e87ba4" opacity="${isNow ? 1 : 0.6}"/>`;
      svg += `<text x="${cx}" y="${top + ph - h - 7}" text-anchor="middle" font-size="14" font-weight="800" fill="${isNow ? '#0b0b0b' : '#52514e'}">${v}</text>`;
      svg += `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="14" font-weight="700" fill="${isNow ? '#a3285a' : '#52514e'}">${+ym.slice(5)}月</text>`;
    });
    return `<section class="card ${A()}"><div class="card-title">💕 亲密时光 · 最近半年</div>
      <div class="card-sub">每个月的次数</div><div class="chart">${svg}</svg></div></section>`;
  }

  function flowerTile() {
    const total = totalHearts(), lv = levelOf(total);
    const prog = lv.next ? (total - lv.at) / (lv.next.at - lv.at) : 1;
    return `<section class="card ${A()}">
      <div class="card-title">🌸 小红花收藏</div>
      <div class="flower-big"><span class="fb-num"><span data-count="${total}" data-ckey="flowers">0</span> 颗</span><span class="fb-lv">${lv.icon} ${lv.name}</span></div>
      <div class="level-track"><div class="level-fill" style="width:${Math.round(prog * 100)}%"></div></div>
      <div class="card-sub" style="margin-top:6px">${lv.next ? `再 ${lv.next.at - total} 颗升级到「${lv.next.name}」${lv.next.icon}` : '已经是最高等级啦！'}</div>
      <div class="card-sub">每个习惯达标、每种药当天吃完，都能得到一颗</div>
    </section>`;
  }

  function activeOrUsedHabits(days) {
    return S.habits.filter(h => days.some(d => isActive(h, d)));
  }

  function medTable(days) {
    const meds = S.meds.filter(m => days.some(d => isActive(m, d)));
    if (!meds.length) return '';
    const t = todayKey();
    const head = days.map(d => `<span class="mg-h ${d === t ? 'today' : ''}">${d === t ? '今天' : weekdayOf(d)}</span>`).join('');
    const rows = meds.map(m => `<div class="mg-row">
      <div class="mg-name">${KINDS[m.kind].icon} ${esc(m.name)}${m.archived ? '<span class="card-sub">（已删除）</span>' : ''}</div>
      <div class="mg-cells">${days.map(d => {
        if (!isActive(m, d)) return '<span></span>';
        const e = m.slots.length, k = m.slots.filter(s => mt(d, m.id, s)).length;
        const label = `${fmtDate(d)} ${m.name}：吃了 ${k} / ${e} 次`;
        let cell;
        if (k === e) cell = '<span class="st st-good">✓</span>';
        else if (k > 0) cell = `<span class="st st-part">${k}/${e}</span>`;
        else if (d === t) cell = '<span class="st st-wait">·</span>';
        else cell = '<span class="st st-miss">✗</span>';
        return `<button data-action="tip" data-tip="${esc(label)}" aria-label="${esc(label)}">${cell}</button>`;
      }).join('')}</div></div>`).join('');
    return `<section class="card ${A()}">
      <div class="card-title">💊 吃药记录</div>
      <div class="mg-cells mg-head">${head}</div>
      ${rows}
      <div class="st-legend"><span><i class="st st-good">✓</i>都吃了</span><span><i class="st st-part">1/2</i>吃了一部分</span><span><i class="st st-miss">✗</i>漏吃</span><span><i class="st st-wait">·</i>今天还没吃</span></div>
    </section>`;
  }

  function habitWeekCard(h, days) {
    const c = colorOf(h), unit = unitOf(h), t = todayKey();
    const act = days.filter(d => isActive(h, d));
    const vals = days.map(d => isActive(h, d) ? hv(d, h.id) : null);
    const met = act.filter(d => hv(d, h.id) >= h.goal).length;
    const total = act.reduce((a, d) => a + hv(d, h.id), 0);
    let body, pills;
    if (h.type === 'check') {
      body = `<div class="check-row">${days.map((d, i) => {
        const v = vals[i], label = `${fmtDate(d)} ${h.name}：${v === null ? '没有记录' : v ? '做到了' : '没做'}`;
        return `<button class="check-cell" data-action="tip" data-tip="${esc(label)}" aria-label="${esc(label)}">
          <span class="check-dot ${v ? 'yes' : ''}">${v ? '✓' : ''}</span>${d === t ? '今天' : '周' + weekdayOf(d)}</button>`;
      }).join('')}</div>`;
      pills = `<span class="stat-pill">做到了 <b>${met}</b> / ${act.length} 天</span>`;
    } else {
      body = barChart(h, days, vals);
      pills = `<span class="stat-pill">一共 <b>${total}</b> ${esc(unit)}</span>
        <span class="stat-pill">平均每天 <b>${act.length ? Math.round(total / act.length) : 0}</b> ${esc(unit)}</span>
        <span class="stat-pill">达标 <b>${met}</b> / ${act.length} 天</span>`;
    }
    return `<section class="card ${A()};--c:${c};--on:${onColorOf(h)}">
      <div class="card-title"><span>${h.icon}</span>${esc(h.name)}${h.archived ? '<span class="card-sub">（已删除）</span>' : ''}</div>
      <div class="card-sub">每天目标 ${h.type === 'check' ? '做一次' : `${h.goal} ${esc(unit)}`}</div>
      <div class="stat-line">${pills}</div>
      ${body}
    </section>`;
  }

  function barPath(x, y, w, h, r) {
    if (h <= 0) return '';
    r = Math.min(r, w / 2, h);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  }

  function barChart(h, days, vals) {
    const W = 340, H = 190, top = 30, bottom = 30, side = 4;
    const c = colorOf(h), unit = unitOf(h), t = todayKey();
    const max = Math.max(h.goal * 1.2, ...vals.map(v => v || 0), 1);
    const ph = H - top - bottom, slot = (W - side * 2) / days.length, bw = Math.min(28, slot * 0.5);
    const y = v => top + ph * (1 - v / max);
    const gy = y(h.goal);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(h.name)}最近7天">`;
    s += `<line x1="${side}" x2="${W - side}" y1="${top + ph}" y2="${top + ph}" stroke="#c3c2b7" stroke-width="1"/>`;
    s += `<line x1="${side}" x2="${W - side}" y1="${gy}" y2="${gy}" stroke="#898781" stroke-width="1.5" stroke-dasharray="5 5"/>`;
    s += `<text x="${W - side}" y="${gy - 7}" text-anchor="end" font-size="14" font-weight="700" fill="#52514e">目标 ${h.goal}</text>`;
    days.forEach((d, i) => {
      const v = vals[i], cx = side + slot * i + slot / 2, x = cx - bw / 2;
      const isT = d === t;
      if (v) s += `<path d="${barPath(x, y(v), bw, top + ph - y(v), 4)}" fill="${c}" opacity="${v >= h.goal ? 1 : 0.55}"/>`;
      if (isT || (v && v >= h.goal)) {
        const label = isT ? String(v || 0) : '✓';
        s += `<text x="${cx}" y="${(v ? y(v) : top + ph) - 7}" text-anchor="middle" font-size="${isT ? 15 : 14}" font-weight="800" fill="${isT ? '#0b0b0b' : '#52514e'}">${label}</text>`;
      }
      s += `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="14" font-weight="700" fill="${isT ? '#b0431a' : '#52514e'}">${isT ? '今天' : '周' + weekdayOf(d)}</text>`;
      const tip = `${fmtDate(d)} 周${weekdayOf(d)}：${h.name} ${v ?? 0} ${unit}${v >= h.goal ? '，达标 ✓' : ''}`;
      s += `<rect class="bar-hit" data-action="tip" data-tip="${esc(tip)}" x="${side + slot * i}" y="0" width="${slot}" height="${H}"/>`;
    });
    return `<div class="chart">${s}</svg></div>`;
  }

  function trendMonth() {
    const [yy, mm] = ui.month.split('-').map(Number);
    const first = new Date(yy, mm - 1, 1), n = new Date(yy, mm, 0).getDate();
    const offset = (first.getDay() + 6) % 7, t = todayKey(), ci = cycleInfo();
    const showLove = !S.settings.hideLove || ui.loveOpen;
    let cells = ['一', '二', '三', '四', '五', '六', '日'].map(w => `<div class="cal-h">${w}</div>`).join('');
    cells += '<div></div>'.repeat(offset);
    const days = [];
    for (let i = 1; i <= n; i++) {
      const k = `${yy}-${pad(mm)}-${pad(i)}`, type = periodDayType(k, ci);
      const heart = showLove && loveOn(k) ? '<i class="cal-heart">❤</i>' : '';
      const cls = `cal-d ${type ? 'p-' + type : ''} ${k === t ? 'today' : ''}`;
      if (k > t) { cells += `<div class="${cls} future">${i}</div>`; continue; }
      days.push(k);
      cells += `<button class="${cls}" data-action="day-detail" data-day="${k}" aria-label="${fmtDate(k)}${type === 'period' ? ' 例假' : ''}">${i}${heart}</button>`;
    }
    const ms = medSummary(days);
    const isCurrent = ui.month >= t.slice(0, 7);
    let html = `<section class="card ${A()}">
      <div class="month-nav">
        <button class="nav-btn" data-action="month-prev" aria-label="上个月">‹</button>
        <div class="month-name">${yy}年${mm}月</div>
        <button class="nav-btn" data-action="month-next" aria-label="下个月" ${isCurrent ? 'disabled' : ''}>›</button>
      </div>
      <div class="cal">${cells}</div>
      <div class="cal-legend"><span><i class="lg p-period"></i>例假</span><span><i class="lg p-predicted"></i>预计例假</span>${showLove ? '<span><i class="cal-heart">❤</i>亲密</span>' : ''}</div>
      <div class="card-sub" style="text-align:center;margin-top:6px">点日期看那天的记录</div>
    </section>`;
    html += `<div class="tiles ${A()}">
      <div class="tile"><div class="tile-label">💊 本月按时吃药</div>
        <div class="tile-value">${ms.rate === null ? '–' : `<span data-count="${pct(ms.rate)}" data-ckey="rateM">0</span><small>%</small>`}</div>
        <div class="tile-note">${ms.exp ? `吃了 ${ms.tak} / ${ms.exp} 次` : '这个月没有记录'}</div></div>
      <div class="tile"><div class="tile-label">${showLove ? '💕 本月亲密' : '🌸 下次例假'}</div>
        <div class="tile-value">${showLove ? `<span data-count="${loveInMonth(ui.month)}" data-ckey="loveM">0</span><small>次</small>`
          : ci.nextStart ? `<span style="font-size:1.4rem">${fmtDate(ci.nextStart)}</span>` : '–'}</div>
        <div class="tile-note">${showLove ? `${mm}月` : ci.nextStart ? `周期约 ${ci.cycle} 天` : '还没有记录'}</div></div>
    </div>`;
    return html;
  }

  // ---------- settings ----------
  function viewSettings() {
    const habits = S.habits.filter(h => !h.archived);
    const meds = S.meds.filter(m => !m.archived);
    return `<header class="page-head"><h1>设置</h1><p>添加或修改要坚持的事情</p></header>

      <section class="card ${A()}">
        <div class="card-title">💬 睿睿怎么叫你</div>
        <div class="card-sub">可以写好几个，用顿号隔开，睿睿会轮着叫</div>
        <input class="text-input" id="set-nick" maxlength="40" placeholder="例如：老婆、宝宝" value="${esc(S.settings.nicknames.join('、'))}">
        <div class="card-title" style="margin-top:18px">🔠 字体大小</div>
        <div class="font-opts">
          <button class="font-opt ${S.settings.font !== 'xl' ? 'on' : ''}" data-action="set-font" data-font="large" style="font-size:1rem">正常</button>
          <button class="font-opt ${S.settings.font === 'xl' ? 'on' : ''}" data-action="set-font" data-font="xl" style="font-size:1.2rem">大一点</button>
        </div>
      </section>

      <section class="card ${A()}">
        <div class="card-title">🗂️ 睿睿的小本本</div>
        <div class="card-sub">写上同事的名字，睿睿吐槽时会点名。名字只存在这台手机里，用顿号隔开。</div>
        <label class="f-label" for="ppl-bad">😈 坏人（可以随便骂）</label>
        <input class="text-input" style="margin-top:0" id="ppl-bad" data-people="bad" maxlength="60" placeholder="例如：张三、李四" value="${esc(people('bad').join('、'))}">
        <label class="f-label" for="ppl-mixed">🌗 时好时坏</label>
        <input class="text-input" style="margin-top:0" id="ppl-mixed" data-people="mixed" maxlength="60" placeholder="例如：王五" value="${esc(people('mixed').join('、'))}">
        <label class="f-label" for="ppl-good">😇 好人</label>
        <input class="text-input" style="margin-top:0" id="ppl-good" data-people="good" maxlength="60" placeholder="例如：赵六" value="${esc(people('good').join('、'))}">
      </section>

      <section class="card ${A()}">
        <div class="card-title">🌸 例假设置</div>
        <div class="card-sub">记录满 3 次以后，睿睿会按你的真实周期来算</div>
        <div class="set-row"><div class="set-main"><div class="set-name">平时周期</div><div class="set-desc">两次例假开始之间隔几天</div></div>
          <div class="stepper small"><button data-action="set-num" data-key="cycle" data-n="-1" aria-label="减少">－</button><span class="sv">${S.settings.cycle}</span><button data-action="set-num" data-key="cycle" data-n="1" aria-label="增加">＋</button></div></div>
        <div class="set-row"><div class="set-main"><div class="set-name">经期长度</div><div class="set-desc">一般持续几天</div></div>
          <div class="stepper small"><button data-action="set-num" data-key="plen" data-n="-1" aria-label="减少">－</button><span class="sv">${S.settings.plen}</span><button data-action="set-num" data-key="plen" data-n="1" aria-label="增加">＋</button></div></div>
      </section>

      <section class="card ${A()}">
        <div class="card-title">🙈 隐私</div>
        <div class="set-row"><div class="set-main"><div class="set-name">「小秘密」默认收起来</div><div class="set-desc">打开 app 时先盖住，点一下才显示</div></div>
          <button class="toggle ${S.settings.hideLove ? 'on' : ''}" data-action="set-hide-love" aria-pressed="${S.settings.hideLove}"><i></i></button></div>
      </section>

      <section class="card ${A()}">
        <div class="card-title">💊 我的药品和保健品</div>
        ${meds.length ? meds.map(m => `<div class="set-row">
          <span class="set-icon">${KINDS[m.kind].icon}</span>
          <div class="set-main"><div class="set-name">${esc(m.name)}</div>
            <div class="set-desc">${KINDS[m.kind].label}${m.dose ? ' · 每次 ' + esc(m.dose) : ''} · ${sortedSlots(m.slots).map(s => SLOTS[s]).join('、')}</div></div>
          <button class="btn btn-outline" data-action="edit-med" data-id="${m.id}">修改</button></div>`).join('')
          : '<p class="card-sub" style="margin-top:8px">还没有添加</p>'}
        <div class="btn-stack"><button class="btn btn-primary btn-wide" data-action="add-med">＋ 添加药 / 保健品</button></div>
      </section>

      <section class="card ${A()}">
        <div class="card-title">💧 我的习惯</div>
        ${habits.length ? habits.map(h => `<div class="set-row">
          <span class="set-icon">${h.icon}</span>
          <div class="set-main"><div class="set-name">${esc(h.name)}</div>
            <div class="set-desc">${TYPES[h.type].label} · ${h.type === 'check' ? '每天一次' : `目标 ${h.goal} ${esc(unitOf(h))}`}</div></div>
          <button class="btn btn-outline" data-action="edit-habit" data-id="${h.id}">修改</button></div>`).join('')
          : '<p class="card-sub" style="margin-top:8px">还没有添加</p>'}
        <div class="btn-stack"><button class="btn btn-primary btn-wide" data-action="add-habit">＋ 添加习惯</button></div>
      </section>

      <section class="card ${A()}">
        <div class="card-title">📱 放到手机桌面</div>
        <ol class="steps">
          <li>用 <b>Safari</b> 打开这个网页</li>
          <li>点屏幕下方的 <b>分享按钮</b>（方框加向上箭头）</li>
          <li>往下滑，点 <b>「添加到主屏幕」</b></li>
          <li>点右上角 <b>「添加」</b>，以后从桌面图标打开</li>
        </ol>
      </section>

      <section class="card ${A()}">
        <div class="card-title">💾 备份数据</div>
        <div class="card-sub">数据只存在这台手机上。换手机或清理 Safari 前，先导出备份。</div>
        <div class="btn-stack">
          <button class="btn btn-outline btn-wide" data-action="export">📤 导出备份</button>
          <button class="btn btn-outline btn-wide" data-action="import">📥 从备份恢复</button>
          <input type="file" id="import-file" accept="application/json,.json" hidden>
          <button class="btn btn-danger btn-wide" data-action="reset">清除所有数据</button>
        </div>
      </section>
      ${DEMO ? '<p class="foot-note">现在是预览模式，修改不会保存</p>' : ''}`;
  }

  // ---------- modal / toast / cheer ----------
  let modalGen = 0;
  function openModal({ title, body, actions = [], onMount }) {
    const root = $('#modal-root'), gen = ++modalGen;
    root.innerHTML = `<div class="modal-backdrop"><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="sheet-head"><h2>${esc(title)}</h2></div>
      <div class="sheet-body">${body}</div>
      <div class="sheet-actions">${actions.map((a, i) => `<button class="btn ${a.cls || 'btn-soft'}" data-mi="${i}">${a.label}</button>`).join('')}</div>
    </div></div>`;
    root.classList.add('open');
    document.body.classList.add('no-scroll');
    $$('[data-mi]', root).forEach(b => b.addEventListener('click', () => {
      const a = actions[+b.dataset.mi];
      const keep = a.onClick && a.onClick(root) === false;
      if (!keep && gen === modalGen) closeModal();
    }));
    if (onMount) onMount(root);
  }

  function closeModal() {
    const root = $('#modal-root');
    root.classList.remove('open');
    root.innerHTML = '';
    document.body.classList.remove('no-scroll');
  }

  function confirmBox(title, text, okLabel, onOk, danger) {
    openModal({
      title, body: `<p>${esc(text)}</p>`,
      actions: [{ label: '不了', cls: 'btn-soft' }, { label: okLabel, cls: danger ? 'btn-danger-solid' : 'btn-primary', onClick: onOk }],
    });
  }

  let toastTimer;
  function toast(msg, undo) {
    const el = $('#toast');
    el.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button class="toast-undo">撤销</button>' : ''}`;
    el.classList.add('show');
    clearTimeout(toastTimer);
    if (undo) el.querySelector('.toast-undo').onclick = () => { undo(); el.classList.remove('show'); };
    toastTimer = setTimeout(() => el.classList.remove('show'), undo ? 5000 : 2800);
  }

  function cheer(emoji, text) {
    const el = $('#cheer');
    el.innerHTML = `<div class="cheer-box"><div class="cheer-rui">${ruiSVG('jump')}</div><div class="cheer-text">${emoji} ${esc(text)}</div></div>`;
    clearTimeout(cheer.t);
    cheer.t = setTimeout(() => { el.innerHTML = ''; }, 2100);
  }

  let confettiRAF;
  function confetti(big) {
    if (reduced) return;
    const cv = $('#confetti'), ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;
    const W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.scale(dpr, dpr);
    const parts = Array.from({ length: big ? 150 : 70 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.42,
      vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 13 - 6,
      r: 4 + Math.random() * 5, c: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, sq: Math.random() < 0.55,
    }));
    cancelAnimationFrame(confettiRAF);
    let t0 = null;
    const frame = ts => {
      if (t0 === null) t0 = ts;
      const t = ts - t0;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(p => {
        p.vy += 0.33; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - t / 2300);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.sq) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        else { ctx.beginPath(); ctx.arc(0, 0, p.r / 1.4, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      if (t < 2300) confettiRAF = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };
    confettiRAF = requestAnimationFrame(frame);
  }

  // Celebrate the biggest milestone crossed by the last action; otherwise 睿睿 says `line`.
  function celebrate(before, after, habit, line, hearts0) {
    const n = who();
    const f1 = totalHearts(), lv0 = levelOf(hearts0 ?? f1), lv1 = levelOf(f1);
    if (before.overall < 1 && after.overall >= 1) {
      confetti(true); cheer('🎉', '今天全部搞定！');
      say(`全部搞定！${n}今天就是人间清醒本醒，奖励小爱心 💗`);
    } else if (lv1.i > lv0.i) {
      confetti(true); cheer(lv1.icon, `升级啦！「${lv1.name}」`);
      say(`哇塞！攒了 ${f1} 颗小爱心，${n}升级成「${lv1.name}」${lv1.icon} 啦！`);
    } else if (before.exp && before.tak < before.exp && after.tak === after.exp) {
      confetti(false); cheer('💊', '今天的药都吃了！');
      say(`今天的药全吃完啦，${n}真乖～睿睿奖励小爱心 💗`);
    } else if (habit && after.hDone > before.hDone) {
      confetti(false); cheer(habit.icon, `${habit.name}达标了！`);
      say(`「${habit.name}」达标！${n}今天水灵灵的 💧 奖励小爱心`);
    } else if (line) {
      say(line);
    }
  }

  function addLove(n) {
    const day = ui.day, old = loveOn(day), nv = Math.max(0, old + n);
    if (nv === old) { if (n < 0) toast('已经是 0 啦'); return; }
    dayLog(day).love = nv;
    save();
    render();
    if (n > 0) {
      const c = loveInMonth(day.slice(0, 7));
      say(fill(pick(LOVE_LINES), { c }));
      cheerShy();
    }
    toast(n > 0 ? '💕 已记录' : '已减去一次', () => { dayLog(day).love = old; save(); render(); });
  }

  function cheerShy() {
    const el = $('#cheer');
    el.innerHTML = `<div class="cheer-box"><div class="cheer-rui">${ruiSVG('jump', 'shy')}</div><div class="cheer-text">🙈 睿睿什么都没看见</div></div>`;
    clearTimeout(cheer.t);
    cheer.t = setTimeout(() => { el.innerHTML = ''; }, 2100);
  }

  function pickDay(title, text, okLabel, onPick) {
    const t = todayKey();
    let chosen = t;
    openModal({
      title,
      body: `<p>${text}</p>
        <div class="opt-grid" style="margin-top:12px">
          ${[[t, '今天'], [addDays(t, -1), '昨天'], [addDays(t, -2), '前天']].map(([k, l], i) =>
            `<button type="button" class="opt ${i === 0 ? 'on' : ''}" data-day="${k}"><b>${l}</b><small>${fmtDate(k)}</small></button>`).join('')}
          <label class="opt date-opt"><b>选别的日子</b><input type="date" id="pick-date" max="${t}"></label>
        </div>`,
      actions: [{ label: '取消' }, { label: okLabel, cls: 'btn-primary', onClick: () => onPick(chosen) }],
      onMount: root => {
        root.addEventListener('click', e => {
          const b = e.target.closest('[data-day]');
          if (!b) return;
          chosen = b.dataset.day;
          $$('.opt', root).forEach(x => x.classList.toggle('on', x === b));
        });
        $('#pick-date', root).addEventListener('change', e => {
          if (!e.target.value) return;
          chosen = e.target.value > t ? t : e.target.value;
          $$('.opt', root).forEach(x => x.classList.toggle('on', x.classList.contains('date-opt')));
        });
      },
    });
  }

  function startPeriod() {
    pickDay('例假哪天来的？', '选一下第一天，睿睿帮你算接下来的日子', '记好了', day => {
      const ci = cycleInfo();
      // A start within an existing period just moves that period's start.
      const hit = ci.ps.find(p => day >= addDays(p.start, -3) && day <= periodEnd(p, ci.plen));
      const done = () => {
        save(); render();
        say(`记下了！${who()}这几天辛苦啦，热水袋、红糖水安排上 🔥 谁惹你睿睿咬谁`);
      };
      if (hit) { hit.start = day < hit.start ? day : hit.start; if (hit.end && hit.end < hit.start) hit.end = null; done(); return; }
      const gap = ci.last ? daysBetween(ci.last.start, day) : 99;
      if (gap >= 0 && gap < 15) {
        confirmBox('确定是新的一次吗？', `离上次例假开始（${fmtDate(ci.last.start)}）才 ${gap} 天哦。`, '是的，记下来', () => {
          S.periods.push({ start: day, end: null }); done();
        });
        return false;
      }
      S.periods.push({ start: day, end: null });
      done();
    });
  }

  function endPeriod() {
    const ci = cycleInfo(), cur = ci.current;
    if (!cur) return;
    pickDay('例假哪天走的？', `这次是从 ${fmtDate(cur.start)} 开始的`, '记好了', day => {
      if (day < cur.start) { toast('结束日期不能早于开始日期'); return false; }
      cur.end = day;
      save(); render();
      say(`撒花 🎉 ${who()}又是一条好汉！这次持续了 ${daysBetween(cur.start, day) + 1} 天`);
    });
  }

  function editPeriods() {
    const ci = cycleInfo();
    const list = ci.ps.slice(-6).reverse();
    openModal({
      title: '修改例假记录',
      body: `<p>点「删除」去掉记错的那一次。</p><div class="detail-list" style="margin-top:10px">${list.map(p =>
        `<div class="detail-row"><span>🩸</span>${fmtDate(p.start)} – ${p.end ? fmtDate(p.end) : '还没结束'}
          <button type="button" class="btn btn-danger btn-small-danger" data-del="${p.start}">删除</button></div>`).join('')}</div>`,
      actions: [{ label: '好了' }],
      onMount: root => root.addEventListener('click', e => {
        const b = e.target.closest('[data-del]');
        if (!b) return;
        S.periods = S.periods.filter(p => p.start !== b.dataset.del);
        b.closest('.detail-row').remove();
        save(); render();
        toast('已删除');
      }),
    });
  }

  function onboard() {
    openModal({
      title: '嗨～我是睿睿 👓',
      body: `<div class="cheer-rui" style="margin:4px auto 10px">${ruiSVG('wave')}</div>
        <p>以后我来提醒你吃药、喝水、记例假，顺便陪你吐槽领导 😏</p>
        <label class="f-label" for="ob-nick">我该怎么叫你？（可以写好几个，用顿号隔开）</label>
        <input class="f-input" id="ob-nick" maxlength="40" placeholder="例如：老婆、宝宝" value="${esc(S.settings.nicknames.join('、'))}">`,
      actions: [{
        label: '就这么叫我 💗', cls: 'btn-primary', onClick: root => {
          setNicknames($('#ob-nick', root).value);
          S.settings.onboarded = true;
          save(); ui.ruiFresh = true; render();
        },
      }],
    });
  }

  function setNicknames(text) {
    const names = String(text).split(/[,，、;；\s]+/).map(x => x.trim().slice(0, 8)).filter(Boolean).slice(0, 8);
    S.settings.nicknames = names.length ? names : ['老婆'];
  }

  // ---------- actions ----------
  function setHabitValue(day, h, nv) {
    const before = stats(day), f0 = totalHearts();
    dayLog(day).h[h.id] = Math.max(0, nv);
    save();
    ui.pop = h.id; render(); ui.pop = null;
    const v = hv(day, h.id), left = h.goal - v;
    const line = h.type === 'check' ? '' : left > 0
      ? `${h.icon} ${h.name}现在 ${v} ${unitOf(h)}，再 ${left} ${unitOf(h)}就达标啦，加油！`
      : `${h.icon} ${h.name}已经 ${v} ${unitOf(h)}啦，超额完成，真厉害！`;
    celebrate(before, stats(day), h, line, f0);
  }

  function addToHabit(h, n) {
    const day = ui.day, old = hv(day, h.id), nv = Math.max(0, old + n);
    if (nv === old) { if (n < 0) toast('已经是 0 了'); return; }
    if (n > 0 && day === todayKey()) petCare(3);
    setHabitValue(day, h, nv);
    const unit = unitOf(h);
    toast(n > 0 ? `${h.icon} ${h.name} +${n} ${unit}` : `${h.icon} ${h.name} ${n} ${unit}`,
      () => { dayLog(day).h[h.id] = old; save(); render(); });
  }

  function toggleMed(id, slot) {
    const day = ui.day, m = getMed(id);
    if (!m) return;
    if (mt(day, id, slot)) {
      confirmBox('取消这次记录？', `${SLOTS[slot]}的「${m.name}」，确定是还没吃吗？`, '是的，还没吃', () => {
        delete dayLog(day).m[id][slot]; save(); render();
      }, true);
      return;
    }
    const before = stats(day), f0 = totalHearts(), l = dayLog(day);
    (l.m[id] = l.m[id] || {})[slot] = Date.now();
    if (day === todayKey()) petCare(5);
    save();
    ui.pop = `${id}:${slot}`; render(); ui.pop = null;
    toast(`✓ 记好了：${SLOTS[slot]}的${m.name}`, () => { delete dayLog(day).m[id][slot]; save(); render(); });
    const medDone = m.slots.every(s => mt(day, id, s));
    celebrate(before, stats(day), null,
      medDone && m.slots.length > 1 ? `「${m.name}」今天都吃完啦，奖励小爱心 💗` : fill(pick(PRAISE)), f0);
  }

  function openSetValue(h) {
    const day = ui.day;
    let v = hv(day, h.id);
    const step = h.type === 'minutes' ? 5 : 1;
    openModal({
      title: `修改${h.name}`,
      body: `<p>${fmtDate(day)}一共${h.type === 'minutes' ? '做了多少分钟' : '多少' + esc(unitOf(h))}？</p>
        <div class="stepper" style="justify-content:center;margin:18px 0 8px">
          <button type="button" data-st="-1" aria-label="减少">－</button>
          <span class="sv" id="sv">${v}</span><span class="su">${esc(unitOf(h))}</span>
          <button type="button" data-st="1" aria-label="增加">＋</button>
        </div>`,
      actions: [{ label: '取消' }, { label: '保存', cls: 'btn-primary', onClick: () => setHabitValue(day, h, v) }],
      onMount: root => $$('[data-st]', root).forEach(b => b.addEventListener('click', () => {
        v = Math.max(0, v + step * +b.dataset.st);
        $('#sv', root).textContent = v;
      })),
    });
  }

  function openHabitForm(h) {
    const isNew = !h;
    const f = h ? Object.assign({}, h) : { name: '', icon: ICONS[0], type: 'minutes', goal: 30, unit: '次', color: S.nextColor % COLORS.length };
    const body = `
      <label class="f-label" for="f-name">叫什么名字</label>
      <input class="f-input" id="f-name" maxlength="16" placeholder="例如：读书、散步、喝水" value="${esc(f.name)}">
      <label class="f-label">选一个图标</label>
      <div class="icon-grid">${ICONS.map(i => `<button type="button" class="icon-opt ${i === f.icon ? 'on' : ''}" data-icon="${i}">${i}</button>`).join('')}</div>
      <label class="f-label">怎么记录</label>
      <div class="opt-list">${Object.entries(TYPES).map(([k, t]) => `<button type="button" class="opt ${k === f.type ? 'on' : ''}" data-type="${k}">
        <span class="o-icon">${t.icon}</span><span><b>${t.label}</b><small>${t.desc}</small></span><span class="o-check">✓</span></button>`).join('')}</div>
      <div id="f-goal-wrap"><label class="f-label">每天的目标</label>
        <div class="stepper"><button type="button" data-step="-1" aria-label="减少">－</button><span class="sv" id="f-goal">${f.goal}</span><span class="su" id="f-goal-unit"></span><button type="button" data-step="1" aria-label="增加">＋</button></div></div>
      <div id="f-unit-wrap"><label class="f-label" for="f-unit">单位</label>
        <input class="f-input" id="f-unit" maxlength="4" placeholder="例如：杯、次、页" value="${esc(f.unit === '分钟' ? '次' : f.unit)}"></div>
      <label class="f-label">颜色</label>
      <div class="color-row">${COLORS.map((c, i) => `<button type="button" class="color-opt ${i === f.color ? 'on' : ''}" data-color="${i}" style="background:${c}" aria-label="颜色 ${i + 1}"></button>`).join('')}</div>
      ${isNew ? '' : '<div class="btn-stack" style="margin-top:22px"><button type="button" class="btn btn-danger btn-wide" id="f-del">删除这个习惯</button></div>'}`;

    const sync = root => {
      $('#f-goal-wrap', root).hidden = f.type === 'check';
      $('#f-unit-wrap', root).hidden = f.type !== 'count';
      $('#f-goal', root).textContent = f.goal;
      $('#f-goal-unit', root).textContent = f.type === 'minutes' ? '分钟' : ($('#f-unit', root).value.trim() || '次');
    };

    openModal({
      title: isNew ? '添加习惯' : '修改习惯',
      body,
      actions: [{ label: '取消' }, {
        label: '保存', cls: 'btn-primary', onClick: root => {
          const nameEl = $('#f-name', root), name = nameEl.value.trim();
          if (!name) { nameEl.classList.add('err'); nameEl.focus(); toast('请先写上名字'); return false; }
          const data = {
            name, icon: f.icon, type: f.type, color: f.color,
            goal: f.type === 'check' ? 1 : Math.max(1, f.goal),
            unit: f.type === 'minutes' ? '分钟' : f.type === 'count' ? ($('#f-unit', root).value.trim() || '次') : '',
          };
          if (isNew) {
            S.habits.push(Object.assign({ id: uid(), created: todayKey() }, data));
            S.nextColor = (f.color + 1) % COLORS.length;
            toast(`已添加：${name}`);
          } else {
            Object.assign(getHabit(h.id), data);
            toast('已保存');
          }
          save(); render();
        },
      }],
      onMount: root => {
        sync(root);
        root.addEventListener('click', e => {
          const b = e.target.closest('button');
          if (!b) return;
          if (b.dataset.icon) { f.icon = b.dataset.icon; $$('.icon-opt', root).forEach(x => x.classList.toggle('on', x === b)); }
          if (b.dataset.color) { f.color = +b.dataset.color; $$('.color-opt', root).forEach(x => x.classList.toggle('on', x === b)); }
          if (b.dataset.type && b.dataset.type !== f.type) {
            f.type = b.dataset.type;
            f.goal = f.type === 'minutes' ? 30 : f.type === 'count' ? 8 : 1;
            $$('.opt', root).forEach(x => x.classList.toggle('on', x === b));
            sync(root);
          }
          if (b.dataset.step) {
            const step = f.type === 'minutes' ? 5 : 1;
            f.goal = Math.max(step, Math.min(f.type === 'minutes' ? 600 : 99, f.goal + step * +b.dataset.step));
            sync(root);
          }
          if (b.id === 'f-del') {
            confirmBox('删除这个习惯？', `删除「${h.name}」后，今天起不再显示。以前的记录会保留在趋势里。`, '删除', () => {
              archive(S.habits, h.id); save(); render(); toast('已删除');
            }, true);
          }
        });
        $('#f-unit', root).addEventListener('input', () => sync(root));
        $('#f-name', root).addEventListener('input', e => e.target.classList.remove('err'));
      },
    });
  }

  function openMedForm(m) {
    const isNew = !m;
    const f = m ? Object.assign({}, m, { slots: m.slots.slice() }) : { name: '', kind: 'medicine', dose: '', slots: ['morning'], note: '' };
    const body = `
      <label class="f-label" for="m-name">药名</label>
      <input class="f-input" id="m-name" maxlength="20" placeholder="例如：鱼油、避孕药、维生素" value="${esc(f.name)}">
      <label class="f-label">是哪一类</label>
      <div class="opt-grid">${Object.entries(KINDS).map(([k, t]) => `<button type="button" class="opt ${k === f.kind ? 'on' : ''}" data-kind="${k}">
        <span class="o-icon">${t.icon}</span><b>${t.label}</b></button>`).join('')}</div>
      <label class="f-label" for="m-dose">每次吃多少（可以不填）</label>
      <input class="f-input" id="m-dose" maxlength="12" placeholder="例如：1片、2粒" value="${esc(f.dose)}">
      <label class="f-label">什么时候吃（可以选几个）</label>
      <div class="opt-grid">${SLOT_ORDER.map(s => `<button type="button" class="opt ${f.slots.includes(s) ? 'on' : ''}" data-slot="${s}">
        <span class="o-icon">${SLOT_ICON[s]}</span><b>${SLOTS[s]}</b></button>`).join('')}</div>
      <label class="f-label" for="m-note">备注（可以不填）</label>
      <input class="f-input" id="m-note" maxlength="20" placeholder="例如：饭后吃" value="${esc(f.note)}">
      ${isNew ? '' : '<div class="btn-stack" style="margin-top:22px"><button type="button" class="btn btn-danger btn-wide" id="m-del">删除这个药</button></div>'}`;

    openModal({
      title: isNew ? '添加药品 / 保健品' : '修改药品',
      body,
      actions: [{ label: '取消' }, {
        label: '保存', cls: 'btn-primary', onClick: root => {
          const nameEl = $('#m-name', root), name = nameEl.value.trim();
          if (!name) { nameEl.classList.add('err'); nameEl.focus(); toast('请先写上药名'); return false; }
          if (!f.slots.length) { toast('请至少选一个吃药时间'); return false; }
          const data = { name, kind: f.kind, slots: sortedSlots(f.slots), dose: $('#m-dose', root).value.trim(), note: $('#m-note', root).value.trim() };
          if (isNew) { S.meds.push(Object.assign({ id: uid(), created: todayKey() }, data)); toast(`已添加：${name}`); }
          else { Object.assign(getMed(m.id), data); toast('已保存'); }
          save(); render();
        },
      }],
      onMount: root => {
        root.addEventListener('click', e => {
          const b = e.target.closest('button');
          if (!b) return;
          if (b.dataset.kind) { f.kind = b.dataset.kind; $$('[data-kind]', root).forEach(x => x.classList.toggle('on', x === b)); }
          if (b.dataset.slot) {
            const s = b.dataset.slot;
            f.slots = f.slots.includes(s) ? f.slots.filter(x => x !== s) : f.slots.concat(s);
            b.classList.toggle('on', f.slots.includes(s));
          }
          if (b.id === 'm-del') {
            confirmBox('删除这个药？', `删除「${m.name}」后，今天起不再提醒记录。以前的记录会保留在趋势里。`, '删除', () => {
              archive(S.meds, m.id); save(); render(); toast('已删除');
            }, true);
          }
        });
        $('#m-name', root).addEventListener('input', e => e.target.classList.remove('err'));
      },
    });
  }

  // Items added today with no history are removed outright; otherwise keep them for past trends.
  function archive(list, id) {
    const it = list.find(x => x.id === id), t = todayKey();
    if (!it) return;
    const used = Object.values(S.log).some(l => (l.h && l.h[id]) || (l.m && l.m[id] && Object.keys(l.m[id]).length));
    if (it.created >= t && !used) list.splice(list.indexOf(it), 1);
    else it.archived = t;
    delete S.timers[id];
  }

  function openDayDetail(day) {
    const st = stats(day);
    const hs = st.hs.map(h => {
      const v = hv(day, h.id), ok = v >= h.goal;
      const val = h.type === 'check' ? (v ? '✓ 做到了' : '没做') : `${v} / ${h.goal} ${esc(unitOf(h))}${ok ? ' ✓' : ''}`;
      return `<div class="detail-row"><span>${h.icon}</span>${esc(h.name)}<span class="dv">${val}</span></div>`;
    }).join('');
    const ms = st.ms.map(m => {
      const v = sortedSlots(m.slots).map(s => {
        const t = mt(day, m.id, s);
        return `${SLOTS[s]} ${t ? '<span style="color:var(--good)">✓</span>' : '<span style="color:var(--miss)">✗</span>'}`;
      }).join('　');
      return `<div class="detail-row"><span>${KINDS[m.kind].icon}</span>${esc(m.name)}<span class="dv">${v}</span></div>`;
    }).join('');
    const ci = cycleInfo(), ptype = periodDayType(day, ci);
    const extra = (ptype === 'period' ? '<div class="detail-row"><span>🩸</span>例假<span class="dv">这天在例假期</span></div>' : '') +
      ((!S.settings.hideLove || ui.loveOpen) && loveOn(day) ? `<div class="detail-row"><span>💕</span>亲密<span class="dv">${loveOn(day)} 次</span></div>` : '');
    openModal({
      title: `${fmtDate(day)} 星期${weekdayOf(day)}`,
      body: st.empty ? '<p>这天还没有要记录的事情。</p>' : `
        <p>这天完成了 <b>${pct(st.overall)}%</b></p>
        ${ms ? `<div class="detail-sec">💊 吃药</div><div class="detail-list">${ms}</div>` : ''}
        ${hs ? `<div class="detail-sec">💧 习惯</div><div class="detail-list">${hs}</div>` : ''}
        ${extra ? `<div class="detail-sec">🌸 其他</div><div class="detail-list">${extra}</div>` : ''}`,
      actions: [{ label: '关闭' }, {
        label: day === todayKey() ? '去打卡' : '补记 / 修改', cls: 'btn-primary',
        onClick: () => { ui.day = day; ui.view = 'today'; ui.enter = true; ui.ruiFresh = true; render(); scrollTo(0, 0); },
      }],
    });
  }

  async function exportData() {
    const name = `每日好习惯备份-${todayKey()}.json`;
    const file = new File([JSON.stringify(S)], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: name }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let data;
      try { data = JSON.parse(reader.result); } catch (e) { data = null; }
      if (!data || data.v !== 1 || !Array.isArray(data.habits)) { toast('这个文件不是本应用的备份'); return; }
      confirmBox('从备份恢复？', '会用备份里的数据替换现在手机上的数据。', '确定恢复', () => {
        S = normalize(data); save(); ui.enter = true; render(); toast('已恢复');
      });
    };
    reader.readAsText(file);
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.closest('#modal-root')) return;
    const id = el.dataset.id;
    switch (el.dataset.action) {
      case 'tab':
        if (ui.view !== el.dataset.view) { roomStop(); ui.view = el.dataset.view; ui.enter = true; }
        if (ui.view === 'today') { ui.day = todayKey(); ui.ruiFresh = true; }
        render(); scrollTo(0, 0);
        break;
      case 'med': toggleMed(id, el.dataset.slot); break;
      case 'go-fight': roomStop(); ui.view = 'room'; ui.enter = true; ui.petStart = 'fight'; render(); scrollTo(0, 0); break;
      case 'pet': petDo(el.dataset.do, el.dataset.arg); break;
      case 'fight-title': S.beat.ti = ((S.beat.ti || 0) + 1) % S.settings.nicknames.length; save(); updateNeeds(); petButtons($('#pet-btns').dataset.mode || 'main'); break;
      case 'fight-mute': S.beat.mute = !S.beat.mute; save(); updateNeeds(); break;
      case 'habit-add': addToHabit(getHabit(id), +el.dataset.n); break;
      case 'habit-set': openSetValue(getHabit(id)); break;
      case 'habit-check': {
        const h = getHabit(id), day = ui.day;
        if (hv(day, id)) confirmBox('取消打卡？', `「${h.name}」今天还没做到吗？`, '是的，取消', () => { dayLog(day).h[id] = 0; save(); render(); }, true);
        else setHabitValue(day, h, 1);
        break;
      }
      case 'timer-start':
        S.timers[id] = Date.now(); save(); render();
        toast('⏱️ 开始计时了，做完点「停止」');
        break;
      case 'timer-stop': {
        const h = getHabit(id), ms = Date.now() - (S.timers[id] || Date.now());
        delete S.timers[id];
        const min = ms >= 30000 ? Math.max(1, Math.round(ms / 60000)) : 0;
        if (!min) { save(); render(); toast('时间太短，这次没有记录'); break; }
        const day = todayKey(), old = hv(day, id);
        setHabitValue(day, h, old + min);
        toast(`${h.icon} 记好了：${h.name} ${min} 分钟`, () => { dayLog(day).h[id] = old; save(); render(); });
        break;
      }
      case 'day-prev': ui.day = addDays(ui.day, -1); ui.ruiFresh = true; render(); break;
      case 'day-next': if (ui.day < todayKey()) { ui.day = addDays(ui.day, 1); ui.ruiFresh = true; render(); } break;
      case 'day-today': ui.day = todayKey(); ui.ruiFresh = true; render(); break;
      case 'trend': ui.trend = el.dataset.mode; ui.enter = true; render(); break;
      case 'month-prev': case 'month-next': {
        const [y, m] = ui.month.split('-').map(Number);
        const d = new Date(y, m - 1 + (el.dataset.action === 'month-next' ? 1 : -1), 1);
        ui.month = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
        ui.enter = true; render();
        break;
      }
      case 'day-detail': openDayDetail(el.dataset.day); break;
      case 'tip': toast(el.dataset.tip); break;
      case 'rui': {
        const svg = el.querySelector('.rui');
        if (svg) { svg.classList.remove('wave'); void svg.getBoundingClientRect(); svg.classList.add('wave'); }
        say(nextRuiLine());
        break;
      }
      case 'rui-roast': say(roastLine()); break;
      case 'rui-soup': say(soupLine()); break;
      case 'period-start': startPeriod(); break;
      case 'period-end': endPeriod(); break;
      case 'period-edit': editPeriods(); break;
      case 'love-add': addLove(+el.dataset.n); break;
      case 'love-reveal': ui.loveOpen = true; render(); break;
      case 'love-hide': ui.loveOpen = false; render(); break;
      case 'set-hide-love': S.settings.hideLove = !S.settings.hideLove; save(); render(); break;
      case 'set-num': {
        const k = el.dataset.key, lim = k === 'cycle' ? [18, 45] : [2, 10];
        S.settings[k] = Math.max(lim[0], Math.min(lim[1], S.settings[k] + +el.dataset.n));
        save(); render();
        break;
      }
      case 'set-font': S.settings.font = el.dataset.font; save(); render(); break;
      case 'add-habit': openHabitForm(null); break;
      case 'edit-habit': openHabitForm(getHabit(id)); break;
      case 'add-med': openMedForm(null); break;
      case 'edit-med': openMedForm(getMed(id)); break;
      case 'export': exportData(); break;
      case 'import': $('#import-file').click(); break;
      case 'reset':
        confirmBox('清除所有数据？', '所有记录、药品和习惯都会被删除，而且不能恢复。建议先导出备份。', '全部清除', () => {
          if (!DEMO) localStorage.removeItem(STORE_KEY);
          S = seed(); S.habits = []; S.meds = []; save(); ui.enter = true; render(); toast('已清除');
        }, true);
        break;
    }
  });

  document.addEventListener('change', e => {
    if (e.target.id === 'set-nick') {
      setNicknames(e.target.value); e.target.value = S.settings.nicknames.join('、'); save(); toast('睿睿记住啦 💗');
    } else if (e.target.dataset && e.target.dataset.people) {
      const list = e.target.value.split(/[,，、;；\s]+/).map(x => x.trim().slice(0, 12)).filter(Boolean).slice(0, 12);
      S.settings.people[e.target.dataset.people] = list;
      e.target.value = list.join('、'); save(); toast('睿睿记在小本本上了 📓');
    } else if (e.target.id === 'import-file') {
      importData(e.target.files[0]); e.target.value = '';
    }
  });

  // Running timers tick without a full re-render.
  setInterval(() => {
    $$('[data-timer]').forEach(el => { const s = S.timers[el.dataset.timer]; if (s) el.textContent = fmtDur(Date.now() - s); });
  }, 1000);

  // Coming back after midnight: move "today" forward if the user was on today.
  let lastToday = todayKey();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    const t = todayKey();
    if (t !== lastToday) { if (ui.day === lastToday) ui.day = t; lastToday = t; render(); }
  });

  window.addEventListener('error', e => {
    const msg = document.createElement('div');
    msg.className = 'fatal';
    msg.textContent = '出错了：' + e.message;
    document.body.prepend(msg);
  });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    // When a new version takes over, reload once so the new files are used right away.
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloaded) { reloaded = true; location.reload(); }
    });
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {});
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  document.addEventListener('touchstart', () => {}, { passive: true }); // lets :active styles show on iPhone
  render();
  if (!S.settings.onboarded && !DEMO) onboard();
})();

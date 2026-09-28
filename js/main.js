(function () {
  const { TOOLS, DEX } = window.CipherTools;
  const STAGES = window.STAGES;
  const SAVE_KEY = 'cipher-deluxe:v1';
  const $ = id => document.getElementById(id);

  // ---------- 保存 ----------
  const load = () => {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; }
  };
  const state = Object.assign({ cleared: [], hints: {}, current: 0 }, load());
  const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {} };
  const unlocked = i => i === 0 || state.cleared.includes(i - 1);

  // ---------- 答え照合(gen.jsと同じ正規化) ----------
  const norm = s => s.normalize('NFKC').toUpperCase()
    .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[^0-9A-Zぁ-ゖ一-鿿]/g, '');
  async function sha256(s) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ---------- ステージ表示 ----------
  function renderNav() {
    const nav = $('stageNav');
    nav.innerHTML = '';
    STAGES.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'stage-pill' + (i === state.current ? ' active' : '') + (state.cleared.includes(i) ? ' done' : '');
      b.disabled = !unlocked(i);
      b.textContent = state.cleared.includes(i) ? '✓' : (unlocked(i) ? String(i + 1) : '🔒');
      b.title = unlocked(i) ? `${i + 1}. ${s.title}` : 'ロック中';
      b.onclick = () => { state.current = i; save(); renderStage(); };
      nav.appendChild(b);
    });
  }

  function renderStage() {
    const i = state.current, s = STAGES[i];
    renderNav();
    $('stageNo').textContent = i === STAGES.length - 1 ? 'FINAL' : `No.${String(i + 1).padStart(2, '0')}`;
    $('stageTitle').textContent = s.title;
    $('stageTag').textContent = s.tag;
    $('stageStory').textContent = s.story;
    $('stageMeta').innerHTML = s.meta.map(m => `<span>${escapeHtml(m)}</span>`).join('');

    const frags = $('fragments');
    frags.innerHTML = '';
    s.fragments.forEach(f => {
      const box = document.createElement('div');
      box.className = 'fragment';
      box.innerHTML = `<div class="frag-head"><span>${escapeHtml(f.label)}</span><button class="ghost small">ワークベンチへ →</button></div><pre></pre>`;
      box.querySelector('pre').textContent = f.text;
      box.querySelector('button').onclick = () => sendToBench(f.text);
      frags.appendChild(box);
    });
    if (s.hidden) {
      // 背景と同じ色の隠し文字。全選択すると浮かび上がる
      const h = document.createElement('div');
      h.className = 'invisible-ink';
      h.textContent = s.hidden;
      frags.appendChild(h);
      frags.appendChild(document.createComment(' ' + s.hidden + ' '));
    }
    if (s.consoleKey) console.log('%c' + s.consoleKey, 'color:#ffb347;font-size:14px;font-weight:bold');

    const done = state.cleared.includes(i);
    $('answerInput').value = '';
    $('feedback').textContent = done ? '✓ 解読済み' : '';
    $('feedback').className = 'feedback' + (done ? ' ok' : '');
    renderHints();
  }

  function renderHints() {
    const i = state.current, s = STAGES[i];
    const n = state.hints[i] || 0;
    $('hintList').innerHTML = s.hints.slice(0, n).map((h, k) => `<li class="${k === s.hints.length - 1 ? 'spoiler' : ''}">${escapeHtml(h)}</li>`).join('');
    const btn = $('btnHint');
    btn.hidden = n >= s.hints.length;
    btn.textContent = n === s.hints.length - 1 ? '🚨 答えを見る' : `💡 ヒント ${n + 1}/${s.hints.length - 1}`;
  }

  $('btnHint').onclick = () => {
    const i = state.current, n = state.hints[i] || 0;
    if (n === STAGES[i].hints.length - 1 && !confirm('答えを表示します。本当にいいですか?')) return;
    state.hints[i] = n + 1; save(); renderHints();
  };

  $('answerForm').onsubmit = async e => {
    e.preventDefault();
    const i = state.current, s = STAGES[i];
    const raw = $('answerInput').value;
    if (!norm(raw)) return;
    const h = await sha256('cipher-deluxe:' + norm(raw));
    const fb = $('feedback');
    if (s.answers.includes(h)) {
      fb.textContent = '✓ 正解!';
      fb.className = 'feedback ok';
      if (!state.cleared.includes(i)) state.cleared.push(i);
      save(); renderNav();
      showClear(i);
    } else {
      fb.textContent = '✗ 合言葉が違うようだ…';
      fb.className = 'feedback ng';
      $('answerForm').classList.remove('shake'); void $('answerForm').offsetWidth; $('answerForm').classList.add('shake');
    }
  };

  function showClear(i) {
    const last = i === STAGES.length - 1;
    $('clearMsg').textContent = STAGES[i].clear;
    $('btnNext').textContent = last ? '🎉 全通信解読完了!' : '次の通信へ →';
    $('clearModal').hidden = false;
    $('btnNext').onclick = () => {
      $('clearModal').hidden = true;
      if (!last) { state.current = i + 1; save(); renderStage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };
  }

  // ---------- ワークベンチ ----------
  let activeTool = null;
  const params = {};
  const history = [];
  const chain = [];

  function renderTools() {
    const wrap = $('tools');
    wrap.innerHTML = '';
    TOOLS.forEach(t => {
      const b = document.createElement('button');
      b.className = 'tool' + (activeTool === t ? ' active' : '');
      b.textContent = t.name;
      b.onclick = () => { activeTool = activeTool === t ? null : t; renderTools(); renderParams(); runTool(); };
      wrap.appendChild(b);
    });
  }

  function renderParams() {
    const wrap = $('params');
    wrap.innerHTML = '';
    if (!activeTool || !activeTool.params) return;
    activeTool.params.forEach(p => {
      if (params[p.key] === undefined) params[p.key] = p.def;
      const row = document.createElement('div');
      row.className = 'param';
      if (p.type === 'shift') {
        row.innerHTML = `<span>${p.label}</span><button class="ghost small" data-d="-1">−</button><input type="range" min="-25" max="25"><output></output><button class="ghost small" data-d="1">+</button>`;
        const range = row.querySelector('input'), out = row.querySelector('output');
        const sync = () => { range.value = params[p.key]; out.textContent = (params[p.key] > 0 ? '+' : '') + params[p.key]; runTool(); };
        range.oninput = () => { params[p.key] = +range.value; sync(); };
        row.querySelectorAll('button').forEach(b => b.onclick = () => {
          params[p.key] = Math.max(-25, Math.min(25, params[p.key] + +b.dataset.d)); sync();
        });
        sync();
      } else {
        row.innerHTML = `<span>${p.label}</span><input type="text" spellcheck="false" autocomplete="off">`;
        const inp = row.querySelector('input');
        inp.value = params[p.key];
        inp.oninput = () => { params[p.key] = inp.value; runTool(); };
      }
      wrap.appendChild(row);
    });
  }

  function runTool() {
    const out = $('benchOut');
    out.classList.remove('err');
    if (!activeTool) { out.value = ''; out.placeholder = '上のツールを選ぶと、ここに結果が出る'; return; }
    try {
      out.value = activeTool.run($('benchIn').value, params);
    } catch (e) {
      out.value = '⚠ ' + e.message;
      out.classList.add('err');
    }
  }

  function toolLabel() {
    if (!activeTool) return '';
    if (activeTool.id === 'caesar') return `シーザー${params.shift > 0 ? '+' : ''}${params.shift}`;
    if (activeTool.id === 'vig') return `ヴィジュネル(${(params.key || '').toUpperCase()})`;
    return activeTool.name.replace(' → 文字', '');
  }

  function setInput(v, label) {
    history.push({ text: $('benchIn').value, chain: chain.slice() });
    if (label === null) chain.length = 0; else chain.push(label);
    $('benchIn').value = v;
    $('chain').textContent = chain.length ? chain.join(' → ') : '';
    runTool();
  }

  function sendToBench(text) {
    setInput(text, null);
    if (window.innerWidth < 900) $('bench').scrollIntoView({ behavior: 'smooth' });
  }

  $('benchIn').oninput = runTool;
  $('btnApply').onclick = () => {
    if (!activeTool || $('benchOut').classList.contains('err') || !$('benchOut').value) return;
    setInput($('benchOut').value, toolLabel());
    activeTool = null; renderTools(); renderParams(); runTool();
  };
  $('btnUndo').onclick = () => {
    const h = history.pop();
    if (!h) return;
    $('benchIn').value = h.text;
    chain.length = 0; chain.push(...h.chain);
    $('chain').textContent = chain.join(' → ');
    runTool();
  };
  $('btnClear').onclick = () => setInput('', null);
  $('btnCopy').onclick = () => {
    navigator.clipboard?.writeText($('benchOut').value).then(() => {
      $('btnCopy').textContent = 'コピーした'; setTimeout(() => $('btnCopy').textContent = 'コピー', 1200);
    });
  };

  // ---------- 図鑑・その他 ----------
  $('dexBody').innerHTML = DEX.map(([n, d]) => `<details><summary>${n}</summary><p>${d}</p></details>`).join('');
  $('btnDex').onclick = () => { $('dex').hidden = false; };
  document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => {
    if (e.target === m || e.target.hasAttribute('data-close')) m.hidden = true;
  }));
  $('btnReset').onclick = () => {
    if (!confirm('進行状況をすべてリセットしますか?')) return;
    state.cleared = []; state.hints = {}; state.current = 0; save(); renderStage();
  };

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  if (!unlocked(state.current)) state.current = 0;
  renderTools(); renderParams(); runTool(); renderStage();
})();

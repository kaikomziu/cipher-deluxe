// 解読ツール群。各ツールは (入力文字列, パラメータ) → 出力文字列
(function () {
  const shiftChar = (c, k) => {
    const b = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - b + k) % 26 + 26) % 26 + b);
  };

  const MORSE = { '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9', '.-.-.-': '.', '--..--': ',', '..--..': '?', '-.-.--': '!' };

  const bytesToText = bytes => new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));

  const TOOLS = [
    {
      id: 'b64', name: 'Base64 → 文字',
      run(s) {
        const clean = s.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
        if (!clean) return '';
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) throw new Error('Base64に使えない文字が含まれています');
        const bin = atob(clean.padEnd(Math.ceil(clean.length / 4) * 4, '='));
        return bytesToText([...bin].map(c => c.charCodeAt(0)));
      }
    },
    {
      id: 'caesar', name: 'シーザー', params: [{ key: 'shift', label: 'ずらす数', type: 'shift', def: 0 }],
      run: (s, p) => s.replace(/[A-Za-z]/g, c => shiftChar(c, p.shift | 0))
    },
    { id: 'rot13', name: 'ROT13', run: s => s.replace(/[A-Za-z]/g, c => shiftChar(c, 13)) },
    { id: 'rev', name: '逆さにする', run: s => [...s].reverse().join('') },
    {
      id: 'atbash', name: 'アトバシュ',
      run: s => s.replace(/[A-Za-z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(25 - (c.charCodeAt(0) - b) + b); })
    },
    {
      id: 'morse', name: 'モールス → 文字',
      run: s => s.trim().split(/\s*[\/|]\s*/).map(w => w.split(/\s+/).filter(Boolean).map(code => {
        const m = MORSE[code.replace(/[・•]/g, '.').replace(/[ー－—_]/g, '-')];
        return m || '?';
      }).join('')).join(' ')
    },
    {
      id: 'bin', name: '2進数 → 文字',
      run(s) {
        const bits = s.replace(/[^01]/g, '');
        if (bits.length % 8) throw new Error('0と1の数が8の倍数ではありません');
        return bytesToText(bits.match(/.{8}/g).map(b => parseInt(b, 2)));
      }
    },
    {
      id: 'hex', name: '16進数 → 文字',
      run(s) {
        const h = s.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '');
        if (h.length % 2) throw new Error('16進数の桁数が奇数です');
        return bytesToText((h.match(/.{2}/g) || []).map(b => parseInt(b, 16)));
      }
    },
    {
      id: 'a1z26', name: 'A1Z26 → 文字',
      run: s => s.split(/\s*\/\s*|\s{2,}|\n/).map(w => (w.match(/\d+/g) || []).map(n => {
        const v = +n;
        return v >= 1 && v <= 26 ? String.fromCharCode(64 + v) : '?';
      }).join('')).join(' ')
    },
    {
      id: 'vig', name: 'ヴィジュネル', params: [{ key: 'key', label: '鍵(英単語)', type: 'text', def: '' }],
      run(s, p) {
        const key = (p.key || '').toUpperCase().replace(/[^A-Z]/g, '');
        if (!key) throw new Error('鍵を入力してください');
        let i = 0;
        return s.replace(/[A-Za-z]/g, c => shiftChar(c, -(key.charCodeAt(i++ % key.length) - 65)));
      }
    }
  ];

  const DEX = [
    ['Base64', '文字をいったんバイト列にして、64種類の記号(A-Z a-z 0-9 + /)で書き直したもの。暗号というより「包装」。末尾の「=」、長さが4の倍数、という見た目が目印。日本語も包める。'],
    ['シーザー暗号', 'アルファベットを決まった数だけずらす。+3で暗号化したならA→D、戻すには−3。ずらし幅(鍵)は0〜25の26通りしかない。'],
    ['ROT13', 'シーザー暗号のずらし幅13版。アルファベットは26文字なので、2回かけると元に戻る。'],
    ['逆さ', '文字列を後ろから読むだけ。単純だが他と組み合わせると気づきにくい。'],
    ['アトバシュ暗号', 'A↔Z、B↔Y、C↔X…とアルファベットを鏡のように反転させる。鍵はなく、暗号化と復号が同じ操作。'],
    ['モールス信号', '短点「.」と長点「-」の組み合わせで文字を表す。このツールでは文字の区切りを空白、単語の区切りを「/」とする。大文字小文字の区別はない。'],
    ['2進数 / 16進数', 'コンピュータの中の文字の番号(文字コード)を、0と1だけ、または0-9とA-Fで書いたもの。2進数は8桁、16進数は2桁で1バイト。'],
    ['A1Z26', 'A=1、B=2 … Z=26 と、アルファベットを順番の数字に置き換える。'],
    ['ヴィジュネル暗号', 'シーザー暗号の強化版。鍵の単語の各文字(A=0, B=1…)ぶんずつ、1文字ごとにずらし幅を変える。鍵がわからないと非常に解きにくい。']
  ];

  window.CipherTools = { TOOLS, DEX };
})();

// 自動生成ファイル(平文は含まない)。答えは正規化後のSHA-256で照合する
window.STAGES = [
 {
  "title": "はじめての傍受",
  "tag": "BASE64",
  "story": "解読室へようこそ、新人。まずは肩慣らしだ。英数字と「+」「/」「=」だけでできた妙な文字列を傍受した。末尾の「=」はBase64のしるしであることが多い。下のワークベンチに送って復元してみろ。",
  "meta": [
   "CH: 01",
   "SIGNAL: ▮▮▮▮▮",
   "FROM: 解読室 訓練係"
  ],
  "fragments": [
   {
    "label": "傍受文 #1",
    "text": "44KI44GG44GT44Gd44CB6Kej6Kqt54+t44G444CC44GT44KM44Gv6KiT57e055So44Gu6YCa5L+h44Gg44CC5ZCI6KiA6JGJ44Gv44CM44GC44GV44KE44GR44CN44CC"
   }
  ],
  "hints": [
   "「通信文をワークベンチへ」を押して、ツールの「Base64 → 文字」を使おう。",
   "復元すると日本語の文章が出てくる。その中に合言葉がある。",
   "答えは「あさやけ」。"
  ],
  "answers": [
   "e431b0ca23f3ec5901dd329bf1741fbc66b2324efbe81f18987425fc121e2456",
   "c8124bd62ee0ec4e185eda4dd4221610233c1b33b30723a939346c48447d9847",
   "ecea1c42db865da562a0242e5b9d20150b3e5124c795842a187353d9665fa6bc",
   "f9cc72aea356607337fdc74365bebc1a2efb82e1af14a898ed4df4072c4a2472"
  ],
  "clear": "上出来だ。本物の通信はここまで素直じゃない。"
 },
 {
  "title": "ずらされた文字",
  "tag": "CAESAR",
  "story": "謎の送信者「ELEVEN」からの最初の通信を傍受した。アルファベットだが読めない。古代ローマの将軍は、文字を決まった数だけずらして手紙を書いたという。ずらし幅の手がかりは、通信の情報欄にあるはずだ。",
  "meta": [
   "CH: 07",
   "SIGNAL: ▮▮▮▮▯",
   "FROM: UNKNOWN"
  ],
  "fragments": [
   {
    "label": "傍受文 #2",
    "text": "NVVK. AOL ZLUKLY HSDHFZ ZOPMAZ IF AOL JOHUULS UBTILY. WHZZDVYK: KYHNVUMSF"
   }
  ],
  "hints": [
   "シーザー暗号。暗号化で「+N」ずらしたなら、戻すには「−N」ずらす。",
   "情報欄の「CH」はチャンネル番号。",
   "シフトを −7 にする。答えは DRAGONFLY。"
  ],
  "answers": [
   "e20eda753109092aedcc163fe1af8ba920dec480ee2693ac7c7797f61c903809"
  ],
  "clear": "チャンネル番号が鍵…ELEVENは律儀なやつらしい。"
 },
 {
  "title": "二重の封筒",
  "tag": "BASE64 → CAESAR",
  "story": "今度はBase64だ。だが開けてみても、中身がまだ読めないらしい。封筒の中にもう一枚封筒が入っていたわけだ。ELEVENは暗号にいつも「自分の名前」を仕込む癖がある。",
  "meta": [
   "CH: ??",
   "SIGNAL: ▮▮▮▯▯",
   "SIGNED: — ELEVEN"
  ],
  "fragments": [
   {
    "label": "傍受文 #3",
    "text": "RVNURCBXUEVFUEMgSExEIEhDTEFBUE8gRUhUTlAuIEFMRERIWkNPOiBQTldUQURQ"
   }
  ],
  "hints": [
   "まずBase64を復元。出てきたものはシーザー暗号になっている。",
   "「ELEVEN」は英語で数字の…?",
   "Base64 → シーザー −11。答えは ECLIPSE。"
  ],
  "answers": [
   "c8691ce281182b0ec25b30fc534a675edfbd7d7830a4f6c86c7b12485a987878"
  ],
  "clear": "名前がそのまま鍵とはな。だが油断するな、ここからが本番だ。"
 },
 {
  "title": "トン・ツー",
  "tag": "MORSE",
  "story": "無線から短音と長音だけの信号が流れてきた。モールス信号だ。記録係が「.」と「-」で書き起こしてくれた(単語の区切りは「/」)。…ただ、復元した記録係が「意味が通らない」とぼやいていた。",
  "meta": [
   "CH: RADIO",
   "SIGNAL: ▮▮▯▯▯",
   "NOTE: 鏡の前で読め"
  ],
  "fragments": [
   {
    "label": "傍受文 #4",
    "text": "... ... .- .--. -- --- -.-. / ... .. / -.. .-. --- .-- ... ... .- .--. / . .... -"
   }
  ],
  "hints": [
   "「モールス → 文字」で復元しよう。",
   "出てきた英文、後ろから読むと…?「逆さにする」ツールがある。",
   "モールス → 逆さ。答えは COMPASS。"
  ],
  "answers": [
   "d5532bdf727c8a9e43b73ce477fec1bbcdcd8529dc20a9d4364de64de3b80848"
  ],
  "clear": "鏡文字か。ELEVENは遊んでいるのかもしれない。"
 },
 {
  "title": "0と1の海",
  "tag": "BINARY → ROT13",
  "story": "サーバーのログに0と1だけの列が紛れていた。8個ずつの区切りは、コンピュータの文字1つぶん(1バイト)だ。",
  "meta": [
   "CH: SERVER LOG",
   "SIGNAL: ▮▮▮▮▮",
   "NOTE: 13番目の扉"
  ],
  "fragments": [
   {
    "label": "傍受文 #5",
    "text": "01000111 01010101 01010010 00100000 01000011 01001110 01000110 01000110 01001010 01000010 01000101 01010001 00100000 01010110 01000110 00100000 01010110 01000001 01011000 01001010 01010010 01011001 01011001"
   }
  ],
  "hints": [
   "「2進数 → 文字」で復元。",
   "出てきた文はシーザー暗号の中でも特に有名な「13ずらし」、ROT13。",
   "2進数 → ROT13。答えは INKWELL。"
  ],
  "answers": [
   "a49cf36ed0c21349a0a34a8fb595d90c5a205e0019ce1eb419981788c7e2fe78"
  ],
  "clear": "ROT13は2回かけると元に戻る。覚えておけ。"
 },
 {
  "title": "鏡のアルファベット",
  "tag": "HEX → ATBASH",
  "story": "16進数のダンプが見つかった。0〜9とA〜Fの2文字で1バイトを表す形式だ。中身はまた英文らしいが…メモが添えてあった。「AはZに、BはYに」。",
  "meta": [
   "CH: DUMP",
   "SIGNAL: ▮▮▮▯▯",
   "NOTE: A↔Z  B↔Y  C↔X ..."
  ],
  "fragments": [
   {
    "label": "傍受文 #6",
    "text": "47 53 56 20 4B 5A 48 48 44 4C 49 57 20 52 48 20 4B 53 5A 4D 47 4C 4E"
   }
  ],
  "hints": [
   "「16進数 → 文字」で復元。",
   "アルファベットを逆順に対応させる暗号は「アトバシュ暗号」。",
   "16進数 → アトバシュ。答えは PHANTOM。"
  ],
  "answers": [
   "7403c1496f9691b0ac31b1013d89be2b9de31ac889fb5c3830a7affc0966cb16"
  ],
  "clear": "ヘブライ語由来の古い暗号だ。ELEVENは暗号オタクだな。"
 },
 {
  "title": "鍵は果実",
  "tag": "A1Z26 + VIGENÈRE",
  "story": "2つの断片を同時に傍受した。1つ目は数字の羅列、2つ目は英文らしきもの。1つ目の数字はアルファベットの順番(A=1, B=2…)だと推測される。1つ目が2つ目の鍵になっているはずだ。",
  "meta": [
   "CH: 2 LINES",
   "SIGNAL: ▮▮▮▮▯",
   "NOTE: 文字ごとにずらし幅が変わる"
  ],
  "fragments": [
   {
    "label": "断片 A",
    "text": "11-5-25 / 12-5-13-15-14"
   },
   {
    "label": "断片 B",
    "text": "ELQ DNDWICEO ME VNCZQGG"
   }
  ],
  "hints": [
   "断片Aを「A1Z26 → 文字」で復元すると、鍵の単語が出てくる。",
   "断片Bは「ヴィジュネル暗号」。鍵の単語を入れて復元しよう。",
   "鍵は LEMON。答えは HARVEST。"
  ],
  "answers": [
   "2296ec567105eb6b775bdc2a80385820fe48c4a1859b6173dfff396d9ced0d2f"
  ],
  "clear": "鍵が単語になると総当たりは難しい。ELEVENも本気を出してきた。"
 },
 {
  "title": "見えない鍵",
  "tag": "BASE64 + CAESAR + ???",
  "story": "今回の通信はシンプルに見えるが、鍵がどこにも書かれていない。…いや、書かれてはいるが「見えない」のかもしれない。",
  "meta": [
   "CH: ---",
   "SIGNAL: ▮▯▯▯▯",
   "FROM: ELEVEN"
  ],
  "fragments": [
   {
    "label": "指示書",
    "text": "Q0FFU0FSIEFHQUlOLiBUSEUgS0VZIElTIEhJRERFTiBXSEVSRSBPTkxZIERFVkVMT1BFUlMgQU5EIFRIRSBDVVJJT1VTIExPT0suIFRSWSBTRUxFQ1RJTkcgRVZFUllUSElORy4="
   },
   {
    "label": "本文",
    "text": "MAX ITLLPHKW BL XFUXK"
   }
  ],
  "hidden": "// key = 19",
  "consoleKey": "[ELEVEN] 見つけたね。key = 19",
  "hints": [
   "指示書をBase64で復元しよう。「開発者と好奇心旺盛な人だけが見る場所」とは?",
   "このページの文字を全選択(Ctrl+A / 長押し)してみよう。PCならF12の開発者ツールのコンソールにも何か出ている。",
   "鍵は19。本文をシーザー −19。答えは EMBER。"
  ],
  "answers": [
   "9caed18b1f31f4c7e16f9a3feef43b50947c1323c9bef539c4d2bd1c440b8757"
  ],
  "clear": "背景色と同じ色の文字…古典的だが効く手だ。"
 },
 {
  "title": "三重の錠前",
  "tag": "BASE64 → ? → ?",
  "story": "ELEVENの最後の防壁だ。Base64の中身は逆さにされ、さらにずらされている。ずらし幅については、記録係がこう言っていた。「受信時刻の数字を全部足したら何かになる気がする」。",
  "meta": [
   "CH: 00",
   "RECV: 03:14:00",
   "FROM: ELEVEN"
  ],
  "fragments": [
   {
    "label": "傍受文 #9",
    "text": "LkFWUUlVTVogWldXTCBCQUlUIE1WVyAuVk1ESVogQVEgTFpXRUFBSVggTVBC"
   }
  ],
  "hints": [
   "順番は Base64 → 逆さ → シーザー。",
   "受信時刻 03:14:00 の数字を全部足すと 0+3+1+4+0+0 = 8。",
   "シーザー −8。答えは RAVEN。"
  ],
  "answers": [
   "57cc6a0bed0c54197a431b20740b08c646476d92fc81ac93ebe7886c79932635"
  ],
  "clear": "最後の扉、か。ここまでの合言葉をメモしてあるだろうな?"
 },
 {
  "title": "最後の扉",
  "tag": "FINAL",
  "story": "ELEVENから最後の通信が届いた。添え書きは一言だけ。「鍵は、君がここまで開けてきた扉の頭文字」。第2の扉から第9の扉まで、合言葉を順に並べてみろ。",
  "meta": [
   "CH: ∞",
   "SIGNAL: ▮▮▮▮▮",
   "FROM: ELEVEN"
  ],
  "fragments": [
   {
    "label": "最終通信",
    "text": "RlNQT0dIWExPRVZRRFVXIFJKSVBCLiBOVlkgWURaRyBaVEhIIFZZSVRHIEhMR0lIWCBLIEFUVVguIEtLSSBIUUNIUCBOUlZGIFFIIEpTVUhGVE1QUklJLg=="
   }
  ],
  "hints": [
   "まずBase64を復元。出てくるのはヴィジュネル暗号。",
   "第2〜第9の答え: DRAGONFLY, ECLIPSE, COMPASS, INKWELL, PHANTOM, HARVEST, EMBER, RAVEN。頭文字を並べると…",
   "鍵は DECIPHER。答えは CODEBREAKER。"
  ],
  "answers": [
   "b9cee2dc5fb913aecf7b83f6d132e005e86114181fecea60f56c3c1fd7e342dd"
  ],
  "clear": "おめでとう、コードブレイカー。君はすべての秘密を読んだ。"
 }
];

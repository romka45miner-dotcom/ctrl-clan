/* CTRL CLAN: intro (Ctrl key drops on a pixel parachute, then the zone closes) and pixel sprites */
(function(){
  var css = [
    '.px{display:block;image-rendering:crisp-edges;image-rendering:pixelated}',
    '.px-icon{margin-bottom:16px}',
    '.px-drop{flex:none;animation:ctrl-bob 3.2s ease-in-out infinite}',
    '@keyframes ctrl-bob{50%{transform:translateY(-6px) rotate(2deg)}}',

    '.intro{position:fixed;inset:0;z-index:1000;display:grid;place-content:center;justify-items:center;gap:28px;overflow:hidden;background:var(--ink);color:var(--bg);clip-path:circle(150% at 50% 50%);animation:ctrl-zone .7s cubic-bezier(.7,0,.3,1) 2.5s forwards;cursor:pointer}',
    '.intro.out{animation:ctrl-zone .35s cubic-bezier(.7,0,.3,1) forwards}',
    '@keyframes ctrl-zone{to{clip-path:circle(0% at 50% 50%)}}',
    '.intro-ring{position:absolute;left:50%;top:50%;width:min(90vmin,720px);aspect-ratio:1;translate:-50% -50%;border:3px dashed var(--zone);border-radius:50%;pointer-events:none;animation:ctrl-ring 2.5s ease-out both}',
    '@keyframes ctrl-ring{from{transform:scale(1.9);opacity:0}to{transform:scale(1);opacity:.8}}',
    '.intro-stage{position:relative;display:flex;align-items:flex-end;gap:.22em;font:400 clamp(48px,12vw,140px)/1 var(--display)}',
    '.intro-drop{display:flex;flex-direction:column;align-items:center;animation:ctrl-fall 1.25s cubic-bezier(.2,.7,.3,1) both}',
    '@keyframes ctrl-fall{0%{transform:translateY(-110vh) rotate(-7deg)}55%{transform:translateY(-6vh) rotate(5deg)}80%{transform:translateY(0) rotate(-2deg)}100%{transform:none}}',
    '.intro-chute{width:2.6em;height:auto;margin-bottom:-.02em;animation:ctrl-chute .5s ease-in 1.25s forwards}',
    '@keyframes ctrl-chute{to{transform:translate(.9em,-1.5em) rotate(20deg);opacity:0}}',
    '.intro-key{padding:.06em .22em .1em;background:var(--smoke);color:var(--smoke-ink);border:4px solid var(--bg);border-radius:.16em;box-shadow:0 .1em 0 var(--bg);animation:ctrl-press .22s ease-out 1.27s}',
    '@keyframes ctrl-press{50%{transform:translateY(.07em);box-shadow:0 .03em 0 var(--bg)}}',
    '.intro-word{animation:ctrl-rise .5s cubic-bezier(.2,.8,.3,1) 1.4s both}',
    '@keyframes ctrl-rise{from{opacity:0;transform:translateY(.3em)}}',
    '.intro-sub{position:relative;margin:0;font:500 13px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--smoke);animation:ctrl-rise .5s ease-out 1.65s both}',
    '.intro-skip{position:absolute;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));padding:10px 14px;background:none;border:1px solid currentColor;border-radius:8px;color:inherit;opacity:.65;font:500 12px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;cursor:pointer}',
    '@media (prefers-reduced-motion:reduce){.px-drop{animation:none}}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* fixed sprite palette: dark outline reads on both themes */
  var P = {K:'#18202c', R:'#d8432b', W:'#f1efe6', B:'#3a72d8', L:'#8fb4ff', O:'#6f7d3c', D:'#48532a', H:'#a6b46a', G:'#5d646c', S:'#a3aab2', T:'#8a5a2b'};
  var CHUTE = [
    '.......KKKKKK.......',
    '....KKKRRWWRRKKK....',
    '..KKRRRRWWWWRRRRKK..',
    '.KRRRRRWWWWWWRRRRRK.',
    'KRRRRRRWWWWWWRRRRRRK',
    'KKKKKKKKKKKKKKKKKKKK',
    '.K......K..K......K.',
    '..K.....K..K.....K..',
    '...K....K..K....K...',
    '....K...K..K...K....'
  ];
  var SPR = {
    chute: CHUTE,
    drop: CHUTE.concat([
      '.....KKKKKKKKKK.....',
      '.....KBBBBBBBBK.....',
      '.....KBLBBBBLBK.....',
      '.....KKKKKKKKKK.....',
      '.....KBBBBBBBBK.....',
      '.....KBLBBBBLBK.....',
      '.....KKKKKKKKKK.....'
    ]),
    helmet: [
      '.....KKKKKK.....',
      '...KKOOOOOOKK...',
      '..KOOOOOOOOOOK..',
      '.KOHHOOOOOOOOOK.',
      '.KOHOOOOOOOOOOK.',
      'KOOOOOOOOOOOOOOK',
      'KOOOOOOOOOOOOOOK',
      'KDDDDDDDDDDDDDDK',
      'KDKKKKKKKKKKKKDK',
      'KDK..........KDK',
      '.KK..........KK.'
    ],
    headset: [
      '....KKKKKKKK....',
      '..KKBBBBBBBBKK..',
      '.KBBKKKKKKKKBBK.',
      '.KBK........KBK.',
      'KBK..........KBK',
      'KBK..........KBK',
      'KKKK........KKKK',
      'KGGK........KGGK',
      'KGSK........KGSK',
      'KGGK........KGGK',
      'KKKKK.......KKKK',
      '...KK...........',
      '....KK.KKK......',
      '.....KKKRK......',
      '.......KKK......'
    ],
    pan: [
      '..KKKKKK........',
      '.KGGGGGGK.......',
      'KGGSSGGGGK......',
      'KGSGGGGGGKKKKKKK',
      'KGGGGGGGGKTTTTTK',
      'KGGGGGGGGKKKKKKK',
      '.KGGGGGGK.......',
      '..KKKKKK........'
    ]
  };

  function sprite(name, px, cls){
    var rows = SPR[name], h = rows.length, w = rows[0].length;
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var g = c.getContext('2d');
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var ch = rows[y].charAt(x);
      if (ch !== '.') { g.fillStyle = P[ch]; g.fillRect(x, y, 1, 1); }
    }
    if (px) { c.style.width = w * px + 'px'; c.style.height = h * px + 'px'; }
    c.className = 'px ' + (cls || '');
    c.setAttribute('aria-hidden', 'true');
    return c;
  }

  /* intro: once per browser session, never with reduced motion */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem('ctrl-intro') === '1'; sessionStorage.setItem('ctrl-intro', '1'); } catch (e) {}
  if (!reduce && !seen && document.body) {
    var intro = document.createElement('div');
    intro.className = 'intro';
    intro.setAttribute('aria-hidden', 'true');
    intro.innerHTML = '<div class="intro-ring"></div>' +
      '<div class="intro-stage"><div class="intro-drop"><div class="intro-key">Ctrl</div></div><div class="intro-word">Clan</div></div>' +
      '<p class="intro-sub">PUBG · набор открыт</p>' +
      '<button class="intro-skip" type="button">Пропустить</button>';
    intro.querySelector('.intro-drop').insertBefore(sprite('chute', 0, 'intro-chute'), intro.querySelector('.intro-key'));
    document.body.insertBefore(intro, document.body.firstChild);
    var root = document.documentElement, prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    var finish = function(){
      if (!intro) return;
      intro.remove(); intro = null;
      root.style.overflow = prevOverflow;
      removeEventListener('keydown', skip);
    };
    var skip = function(){ if (intro) intro.classList.add('out'); };
    intro.addEventListener('animationend', function(e){ if (e.animationName === 'ctrl-zone') finish(); });
    intro.addEventListener('click', skip);
    addEventListener('keydown', skip);
    setTimeout(finish, 5000);
  }

  /* sprites in the page */
  function decorate(){
    var icons = ['helmet', 'headset', 'pan'];
    var cols = document.querySelectorAll('.trio > div');
    for (var i = 0; i < cols.length && i < icons.length; i++) cols[i].insertBefore(sprite(icons[i], 4, 'px-icon'), cols[i].firstChild);
    var fin = document.querySelector('.final');
    if (fin) fin.insertBefore(sprite('drop', 4, 'px-drop'), fin.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate);
  else decorate();
})();

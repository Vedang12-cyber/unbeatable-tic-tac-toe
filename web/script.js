/* ---------- Game state ---------- */
const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let board, human = 'X', ai = 'O', over, busy, nodes;
const scores = { win: 0, draw: 0, loss: 0 };

const $ = id => document.getElementById(id);
const boardEl = $('board');

/* ---------- Minimax core ---------- */

// Returns {p:'X'|'O'|'draw', line:[..]} when the game is finished, else null.
function result(b) {
  for (const [a, c, d] of WINS) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { p: b[a], line: [a, c, d] };
  }
  return b.includes(null) ? null : { p: 'draw', line: [] };
}

// Score is from the computer's point of view.
// Faster wins score higher and slower losses score higher, so the AI wins quickly and loses slowly.
function minimax(b, depth, isMax, alpha, beta, prune) {
  nodes++;
  const r = result(b);
  if (r) {
    if (r.p === ai) return 10 - depth;
    if (r.p === human) return depth - 10;
    return 0;
  }
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = ai;
      best = Math.max(best, minimax(b, depth + 1, false, alpha, beta, prune));
      b[i] = null;
      alpha = Math.max(alpha, best);
      if (prune && beta <= alpha) break;   // alpha-beta cut-off
    }
    return best;
  }
  let best = Infinity;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = human;
    best = Math.min(best, minimax(b, depth + 1, true, alpha, beta, prune));
    b[i] = null;
    beta = Math.min(beta, best);
    if (prune && beta <= alpha) break;
  }
  return best;
}

function bestMove(prune) {
  nodes = 0;
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = ai;
    const score = minimax(board, 1, false, -Infinity, Infinity, prune);
    board[i] = null;
    if (score > best) { best = score; move = i; }
  }
  return { move, score: best };
}

/* ---------- UI ---------- */
function markSVG(p, animate) {
  const cls = 'mark ' + (p === 'X' ? 'x' : 'o') + (animate ? ' draw' : '');
  const shape = p === 'X'
    ? '<path pathLength="1" class="' + cls + '" d="M18 18 L82 82"/><path pathLength="1" class="' + cls + '" d="M82 18 L18 82"/>'
    : '<circle pathLength="1" class="' + cls + '" cx="50" cy="50" r="33"/>';
  return '<svg viewBox="0 0 100 100" aria-hidden="true">' + shape + '</svg>';
}

function render(winLine = [], lastIdx = -1) {
  boardEl.innerHTML = '';
  board.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'cell' + (winLine.includes(i) ? ' win' : '');
    btn.setAttribute('role', 'gridcell');
    btn.setAttribute('aria-label', 'Row ' + (Math.floor(i / 3) + 1) + ' column ' + (i % 3 + 1) + (p ? ', ' + p : ', empty'));
    btn.disabled = !!p || over || busy;
    if (p) btn.innerHTML = markSVG(p, i === lastIdx);
    btn.addEventListener('click', () => humanMove(i));
    boardEl.appendChild(btn);
  });
}

function setStatus(t) { $('status').textContent = t; }

function describe(score) {
  if (score > 0) return 'The computer has found a forced win from here.';
  if (score === 0) return 'With best play from both sides this is a draw.';
  return 'The computer sees no way to avoid a loss.';
}

function finish(r) {
  over = true;
  if (r.p === 'draw') { scores.draw++; setStatus("It's a draw"); }
  else if (r.p === human) { scores.win++; setStatus('You win!'); }
  else { scores.loss++; setStatus('Computer wins'); }
  $('sWin').textContent = scores.win;
  $('sDraw').textContent = scores.draw;
  $('sLoss').textContent = scores.loss;
}

function humanMove(i) {
  if (over || busy || board[i]) return;
  board[i] = human;
  const r = result(board);
  render(r ? r.line : [], i);
  if (r) return finish(r);
  busy = true;
  setStatus('Computer is thinking…');
  render([], i);
  setTimeout(aiMove, 350);
}

function aiMove() {
  const prune = $('ab').checked;
  const t0 = performance.now();
  const { move, score } = bestMove(prune);
  const ms = performance.now() - t0;
  board[move] = ai;
  busy = false;

  $('nodes').textContent = nodes.toLocaleString();
  $('time').textContent = ms < 1 ? '< 1 ms' : Math.round(ms) + ' ms';
  $('abState').textContent = prune ? 'On' : 'Off';
  $('verdict').textContent = describe(score);

  const r = result(board);
  render(r ? r.line : [], move);
  if (r) finish(r); else setStatus('Your move');
}

function newGame() {
  board = Array(9).fill(null);
  over = false; busy = false;
  render();
  if (ai === 'X') {            // computer goes first
    busy = true;
    render();
    setStatus('Computer is thinking…');
    setTimeout(aiMove, 350);
  } else {
    setStatus('Your move');
  }
}

function chooseSide(side) {
  human = side; ai = side === 'X' ? 'O' : 'X';
  $('playX').setAttribute('aria-pressed', side === 'X');
  $('playO').setAttribute('aria-pressed', side === 'O');
  newGame();
}

$('playX').addEventListener('click', () => chooseSide('X'));
$('playO').addEventListener('click', () => chooseSide('O'));
$('reset').addEventListener('click', newGame);
newGame();

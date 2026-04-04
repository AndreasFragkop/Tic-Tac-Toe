let board = Array(9).fill(null);
let current = 'X';
let scores = { X: 0, O: 0, D: 0 };
let gameOver = false;
let mode = '2p';

const WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function $(id) {
  return document.getElementById(id);
}

function cells() {
  return document.querySelectorAll('.cell');
}

function setStatus(text) {
  $('status').textContent = text;
}

function checkWinner(state) {
  for (const [a, c, d] of WINS) {
    if (state[a] && state[a] === state[c] && state[a] === state[d]) {
      return { winner: state[a], line: [a, c, d] };
    }
  }

  if (state.every(Boolean)) {
    return { winner: 'draw', line: [] };
  }

  return null;
}

function play(index) {
  if (gameOver || board[index]) {
    return;
  }

  board[index] = current;
  const cell = cells()[index];
  cell.classList.add('taken', current === 'X' ? 'x-mark' : 'o-mark');
  cell.innerHTML = current === 'X'
    ? '<span class="mark mark-x" aria-label="X"></span>'
    : '<span class="mark mark-o" aria-label="O"></span>';

  const result = checkWinner(board);
  if (result) {
    endGame(result);
    return;
  }

  current = current === 'X' ? 'O' : 'X';

  if (mode === 'ai' && current === 'O') {
    setStatus('CPU thinking...');
    lock(true);
    setTimeout(() => {
      lock(false);
      play(bestMove());
    }, 450);
  } else {
    setStatus(`Player ${current}'s turn`);
  }
}

function endGame(result) {
  gameOver = true;
  lock(true);

  if (result.winner === 'draw') {
    scores.D += 1;
    setStatus("It's a draw!");
  } else {
    scores[result.winner] += 1;
    const label = mode === 'ai' && result.winner === 'O'
      ? 'CPU wins! 🎉'
      : `Player ${result.winner} wins! 🎉`;
    setStatus(label);
    result.line.forEach((index) => cells()[index].classList.add('winner'));
  }

  $('score-x').textContent = scores.X;
  $('score-o').textContent = scores.O;
  $('score-d').textContent = scores.D;
}

function lock(isLocked) {
  cells().forEach((cell) => {
    cell.style.pointerEvents = isLocked ? 'none' : '';
  });
}

function bestMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i += 1) {
    if (!board[i]) {
      board[i] = 'O';
      const score = mm(board, 0, false);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function mm(state, depth, isMaximizing) {
  const result = checkWinner(state);
  if (result) {
    return result.winner === 'O' ? 10 - depth : result.winner === 'X' ? depth - 10 : 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i += 1) {
      if (!state[i]) {
        state[i] = 'O';
        bestScore = Math.max(bestScore, mm(state, depth + 1, false));
        state[i] = null;
      }
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (let i = 0; i < 9; i += 1) {
    if (!state[i]) {
      state[i] = 'X';
      bestScore = Math.min(bestScore, mm(state, depth + 1, true));
      state[i] = null;
    }
  }

  return bestScore;
}

function setMode(nextMode) {
  mode = nextMode;
  $('btn-2p').classList.toggle('active', nextMode === '2p');
  $('btn-ai').classList.toggle('active', nextMode === 'ai');
  $('label-o').textContent = nextMode === 'ai' ? '🤖 CPU' : 'Player O';
  resetAll();
}

function resetRound() {
  board = Array(9).fill(null);
  current = 'X';
  gameOver = false;
  lock(false);
  cells().forEach((cell) => {
    cell.className = 'cell';
    cell.innerHTML = '';
  });
  setStatus("Player X's turn");
}

function resetAll() {
  scores = { X: 0, O: 0, D: 0 };
  $('score-x').textContent = 0;
  $('score-o').textContent = 0;
  $('score-d').textContent = 0;
  resetRound();
}

document.getElementById('board').addEventListener('click', (event) => {
  const cell = event.target.closest('.cell');
  if (cell) {
    play(parseInt(cell.dataset.i, 10));
  }
});

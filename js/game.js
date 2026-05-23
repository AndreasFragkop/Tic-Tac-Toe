function switchPlayer() {
  current = current === PLAYER_X ? PLAYER_O : PLAYER_X;
}

function checkWinner(state) {
  for (const [a, b, c] of WINS) {
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return { winner: state[a], line: [a, b, c] };
    }
  }

  if (state.every(Boolean)) {
    return { winner: 'draw', line: [] };
  }

  return null;
}

function endGame(result) {
  gameOver = true;
  setBoardLocked(true);

  if (result.winner === 'draw') {
    scores.D += 1;
    setStatus("It's a draw!");
  } else {
    scores[result.winner] += 1;
    setStatus(mode === MODE_CPU && result.winner === PLAYER_O
      ? 'CPU wins! 🎉'
      : `Player ${result.winner} wins! 🎉`);
    highlightWinningCells(result.line);
  }

  updateScoresUI();
}

function maybePlayCpuTurn() {
  if (mode !== MODE_CPU || current !== PLAYER_O || gameOver) {
    setStatus(`${getCurrentPlayerLabel()}'s turn`);
    return;
  }

  setStatus('CPU thinking...');
  setBoardLocked(true);

  setTimeout(() => {
    setBoardLocked(false);
    playMove(getBestMove());
  }, CPU_DELAY_MS);
}

function playMove(index) {
  if (gameOver || board[index]) {
    return;
  }

  board[index] = current;
  renderCell(index, current);

  const result = checkWinner(board);
  if (result) {
    endGame(result);
    return;
  }

  switchPlayer();
  maybePlayCpuTurn();
}

function resetRound() {
  board = createEmptyBoard();
  current = PLAYER_X;
  gameOver = false;
  setBoardLocked(false);
  clearBoardUI();
  setStatus("Player X's turn");
}

function resetAll() {
  scores = createEmptyScores();
  updateScoresUI();
  resetRound();
}

function setMode(nextMode) {
  mode = nextMode;
  updateModeUI();
  resetAll();
}

boardEl.addEventListener('click', (event) => {
  const cell = event.target.closest('.cell');
  if (!cell) {
    return;
  }

  playMove(parseInt(cell.dataset.i, 10));
});

// ─── Turn management ──────────────────────────────────────────────────────────

// Flips the `current` player between X and O after each move.
function switchPlayer() {
  current = current === PLAYER_X ? PLAYER_O : PLAYER_X;
}

// ─── Win detection ────────────────────────────────────────────────────────────

// Checks every winning triplet in WINS against the given board state.
// Returns { winner, line } on a win, { winner: 'draw', line: [] } when all
// nine cells are filled with no winner, or null if the game is still going.
//
// Accepts `state` as a parameter (rather than reading `board` directly) so
// the same function can be reused by the minimax search in ai.js.
function checkWinner(state) {
  for (const [a, b, c] of WINS) {
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return { winner: state[a], line: [a, b, c] };
    }
  }

  // All cells filled but no matching triplet found → draw.
  if (state.every(Boolean)) {
    return { winner: 'draw', line: [] };
  }

  return null; // game is still in progress
}

// ─── Game end ─────────────────────────────────────────────────────────────────

// Finalises the game after a win or draw:
//   - sets gameOver so no further moves are accepted
//   - locks the board to block accidental clicks
//   - increments the correct score counter
//   - updates the status message
//   - highlights the winning cells (skipped on a draw)
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

// ─── CPU turn scheduling ──────────────────────────────────────────────────────

// Called after every human move. If the mode is CPU and it is now O's turn,
// shows a "thinking" status, locks the board, and schedules the CPU move after
// CPU_DELAY_MS so the move feels deliberate rather than instantaneous.
// If it is not the CPU's turn (2-player mode or game already over), just
// updates the status to show whose turn it is.
function maybePlayCpuTurn() {
  if (mode !== MODE_CPU || current !== PLAYER_O || gameOver) {
    setStatus(`${getCurrentPlayerLabel()}'s turn`);
    return;
  }

  setStatus('CPU thinking...');
  setBoardLocked(true);

  setTimeout(() => {
    setBoardLocked(false);
    playMove(getBestMove()); // getBestMove is defined in ai.js
  }, CPU_DELAY_MS);
}

// ─── Core move handler ────────────────────────────────────────────────────────

// Places the current player's mark at the given board index, renders it,
// then either ends the game (if there is a result) or advances to the next turn.
// Ignores calls on already-taken cells and calls after the game has ended.
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
  maybePlayCpuTurn(); // either triggers CPU move or updates status for next human turn
}

// ─── Reset helpers ────────────────────────────────────────────────────────────

// Clears the board and resets turn order to X without touching the scoreboard.
// Called by the "New Game" button and internally by resetAll().
function resetRound() {
  board    = createEmptyBoard();
  current  = PLAYER_X;
  gameOver = false;
  setBoardLocked(false);
  clearBoardUI();
  setStatus("Player X's turn");
}

// Zeroes all scores and then resets the round.
// Called by the "Reset" button and whenever the game mode changes.
function resetAll() {
  scores = createEmptyScores();
  updateScoresUI();
  resetRound();
}

// ─── Mode switching ───────────────────────────────────────────────────────────

// Updates the active mode, syncs the mode button UI, and resets everything
// so the new mode takes effect from a clean state.
// Called by the onclick handlers on both mode buttons in index.html.
function setMode(nextMode) {
  mode = nextMode;
  updateModeUI();
  resetAll();
}

// ─── Board click listener ─────────────────────────────────────────────────────

// A single delegated listener on the board container handles all cell clicks.
// Using event delegation means we never need to attach or remove per-cell
// listeners across resets. The cell index is read from the data-i attribute
// rather than being derived from DOM position, so markup order does not matter.
boardEl.addEventListener('click', (event) => {
  const cell = event.target.closest('.cell');
  if (!cell) {
    return; // click landed on the board padding, not a cell
  }

  playMove(parseInt(cell.dataset.i, 10));
});

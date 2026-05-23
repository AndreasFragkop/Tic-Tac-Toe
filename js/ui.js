// ─── Cell query ───────────────────────────────────────────────────────────────

// Returns a fresh NodeList of all nine .cell elements.
// Called as a function (not cached) because clearBoardUI() resets class names,
// so a stale NodeList would still point to the right nodes but a cached array
// of references is fine — the reason it's a function is just convention here.
function getCells() {
  return document.querySelectorAll('.cell');
}

// Returns the display name for the current player.
// In CPU mode, O is shown as "CPU" rather than "Player O".
function getCurrentPlayerLabel() {
  return mode === MODE_CPU && current === PLAYER_O ? 'CPU' : `Player ${current}`;
}

// ─── Status bar ───────────────────────────────────────────────────────────────

// Writes a message to the status bar shown above the board
// (e.g. "Player X's turn", "CPU wins! 🎉").
function setStatus(text) {
  statusEl.textContent = text;
}

// ─── Board locking ────────────────────────────────────────────────────────────

// Enables or disables pointer events on every cell.
// The board is locked while the CPU is "thinking" and after the game ends
// to prevent the player from clicking during those states.
function setBoardLocked(isLocked) {
  getCells().forEach((cell) => {
    cell.style.pointerEvents = isLocked ? 'none' : '';
  });
}

// ─── Scoreboard ───────────────────────────────────────────────────────────────

// Writes all three values from the `scores` state object to their DOM elements.
// Called after every game end and after a full reset.
function updateScoresUI() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

// ─── Cell rendering ───────────────────────────────────────────────────────────

// Marks a cell as taken by the given player.
// Adds the colour class (x-mark / o-mark) so CSS applies the right colour,
// and injects a <span> that CSS draws as an X (two rotated bars) or O (circle).
// The aria-label makes the mark readable to screen readers.
function renderCell(index, player) {
  const cell      = getCells()[index];
  const markClass = player === PLAYER_X ? 'x-mark' : 'o-mark';
  const markHtml  = player === PLAYER_X
    ? '<span class="mark mark-x" aria-label="X"></span>'
    : '<span class="mark mark-o" aria-label="O"></span>';

  cell.classList.add('taken', markClass);
  cell.innerHTML = markHtml;
}

// Resets every cell to a blank state: removes all extra classes and clears
// inner HTML. Called at the start of each new round.
function clearBoardUI() {
  getCells().forEach((cell) => {
    cell.className = 'cell';
    cell.innerHTML = '';
  });
}

// Adds the 'winner' class to each cell in the winning triplet so CSS can
// apply the highlight colour and pulse animation.
function highlightWinningCells(line) {
  line.forEach((index) => {
    getCells()[index].classList.add('winner');
  });
}

// ─── Mode button UI ───────────────────────────────────────────────────────────

// Syncs the active-button highlight and the O score-box label to the current
// mode value. Called whenever setMode() changes the mode.
function updateModeUI() {
  btn2pEl.classList.toggle('active', mode === MODE_TWO_PLAYER);
  btnAiEl.classList.toggle('active', mode === MODE_CPU);
  // In CPU mode the label switches to a robot emoji so the player knows
  // they are facing the computer, not a second human.
  labelOEl.textContent = mode === MODE_CPU ? '🤖 CPU' : 'Player O';
}

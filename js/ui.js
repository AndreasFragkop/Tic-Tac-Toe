function getCells() {
  return document.querySelectorAll('.cell');
}

function getCurrentPlayerLabel() {
  return mode === MODE_CPU && current === PLAYER_O ? 'CPU' : `Player ${current}`;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function setBoardLocked(isLocked) {
  getCells().forEach((cell) => {
    cell.style.pointerEvents = isLocked ? 'none' : '';
  });
}

function updateScoresUI() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

function renderCell(index, player) {
  const cell = getCells()[index];
  const markClass = player === PLAYER_X ? 'x-mark' : 'o-mark';
  const markHtml = player === PLAYER_X
    ? '<span class="mark mark-x" aria-label="X"></span>'
    : '<span class="mark mark-o" aria-label="O"></span>';

  cell.classList.add('taken', markClass);
  cell.innerHTML = markHtml;
}

function clearBoardUI() {
  getCells().forEach((cell) => {
    cell.className = 'cell';
    cell.innerHTML = '';
  });
}

function highlightWinningCells(line) {
  line.forEach((index) => {
    getCells()[index].classList.add('winner');
  });
}

function updateModeUI() {
  btn2pEl.classList.toggle('active', mode === MODE_TWO_PLAYER);
  btnAiEl.classList.toggle('active', mode === MODE_CPU);
  labelOEl.textContent = mode === MODE_CPU ? '🤖 CPU' : 'Player O';
}

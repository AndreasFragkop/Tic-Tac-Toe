// ─── Minimax AI ───────────────────────────────────────────────────────────────
// The CPU uses a complete minimax search to choose the optimal move.
// Tic-Tac-Toe has at most 9 half-moves (plies), so the full game tree is
// tiny and can be searched exhaustively on every turn without any pruning.
//
// The algorithm alternates between two roles:
//   Maximizing (O / CPU) — tries to find the highest possible score.
//   Minimizing (X / human) — tries to find the lowest possible score.
//
// Scores are from O's perspective:
//   positive  → O wins  (higher = fewer moves to win = better)
//   negative  → X wins  (lower  = fewer moves to lose = worse)
//   0         → draw

// Recursively scores a board position.
//
//   state        — the 9-cell board array being evaluated (mutated in place,
//                  then restored, to avoid allocating copies on every call)
//   depth        — number of moves made since getBestMove called this;
//                  used to prefer faster wins and slower losses
//   isMaximizing — true on O's turn, false on X's turn
function scorePosition(state, depth, isMaximizing) {
  const result = checkWinner(state);

  // Terminal node: game already decided — score it and unwind the stack.
  if (result) {
    if (result.winner === PLAYER_O) return 10 - depth; // O wins; prefer soonest
    if (result.winner === PLAYER_X) return depth - 10; // X wins; prefer latest
    return 0;                                          // draw
  }

  if (isMaximizing) {
    // O's turn: try every empty cell, take the move with the highest score.
    let bestScore = -Infinity;

    for (let i = 0; i < state.length; i += 1) {
      if (!state[i]) {
        state[i] = PLAYER_O;
        bestScore = Math.max(bestScore, scorePosition(state, depth + 1, false));
        state[i] = null; // undo — no object copy needed
      }
    }

    return bestScore;
  }

  // X's turn (minimizing): try every empty cell, take the move with the lowest score.
  let bestScore = Infinity;

  for (let i = 0; i < state.length; i += 1) {
    if (!state[i]) {
      state[i] = PLAYER_X;
      bestScore = Math.min(bestScore, scorePosition(state, depth + 1, true));
      state[i] = null; // undo
    }
  }

  return bestScore;
}

// Scans all empty cells on the live board, scores each as a candidate CPU
// move, and returns the index of the highest-scoring one.
// Called once per CPU turn by maybePlayCpuTurn() in game.js.
function getBestMove() {
  let bestScore = -Infinity;
  let bestMove  = -1;

  for (let i = 0; i < board.length; i += 1) {
    if (!board[i]) {
      board[i] = PLAYER_O;
      // Start with isMaximizing=false because after placing O it will be X's turn.
      const score = scorePosition(board, 0, false);
      board[i] = null; // undo

      if (score > bestScore) {
        bestScore = score;
        bestMove  = i;
      }
    }
  }

  return bestMove;
}

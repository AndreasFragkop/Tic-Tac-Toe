function scorePosition(state, depth, isMaximizing) {
  const result = checkWinner(state);
  if (result) {
    if (result.winner === PLAYER_O) {
      return 10 - depth;
    }

    if (result.winner === PLAYER_X) {
      return depth - 10;
    }

    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < state.length; i += 1) {
      if (!state[i]) {
        state[i] = PLAYER_O;
        bestScore = Math.max(bestScore, scorePosition(state, depth + 1, false));
        state[i] = null;
      }
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (let i = 0; i < state.length; i += 1) {
    if (!state[i]) {
      state[i] = PLAYER_X;
      bestScore = Math.min(bestScore, scorePosition(state, depth + 1, true));
      state[i] = null;
    }
  }

  return bestScore;
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i += 1) {
    if (!board[i]) {
      board[i] = PLAYER_O;
      const score = scorePosition(board, 0, false);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

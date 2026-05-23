// ─── Player tokens ────────────────────────────────────────────────────────────
// Used as both board markers and display values throughout the codebase.
const PLAYER_X = 'X';
const PLAYER_O = 'O';

// ─── Game mode identifiers ────────────────────────────────────────────────────
// Matched against the `mode` state variable so one change here propagates
// to all mode checks in game.js, ui.js, and state.js.
const MODE_TWO_PLAYER = '2p';
const MODE_CPU        = 'ai';

// ─── CPU move delay ───────────────────────────────────────────────────────────
// Short pause before the CPU places its mark so the move feels intentional
// rather than instant.
const CPU_DELAY_MS = 450;

// ─── Winning index triplets ───────────────────────────────────────────────────
// Every combination of three board indices that constitutes a win.
// Rows first (top → bottom), then columns (left → right), then diagonals.
//
// Board index layout:
//   0 | 1 | 2
//   ---------
//   3 | 4 | 5
//   ---------
//   6 | 7 | 8
const WINS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // center column
  [2, 5, 8], // right column
  [0, 4, 8], // top-left → bottom-right diagonal
  [2, 4, 6], // top-right → bottom-left diagonal
];

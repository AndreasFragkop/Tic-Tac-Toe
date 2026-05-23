// ─── DOM references ───────────────────────────────────────────────────────────
// Cached once at page load so every module can access them without calling
// getElementById on every function call.
const statusEl = document.getElementById('status');  // turn / result message bar
const boardEl  = document.getElementById('board');   // grid container (click target)
const btn2pEl  = document.getElementById('btn-2p');  // "2 Players" mode button
const btnAiEl  = document.getElementById('btn-ai');  // "vs CPU" mode button
const labelOEl = document.getElementById('label-o'); // O score-box label (changes in CPU mode)
const scoreXEl = document.getElementById('score-x'); // X win counter display
const scoreOEl = document.getElementById('score-o'); // O win counter display
const scoreDEl = document.getElementById('score-d'); // draw counter display

// ─── Mutable game state ───────────────────────────────────────────────────────
// All variables that change during play live here so every module loaded
// after state.js can read and write them as shared globals.

let board    = createEmptyBoard();   // 9-element array; null = empty, 'X'/'O' = taken
let current  = PLAYER_X;            // whose turn it currently is
let scores   = createEmptyScores(); // cumulative wins and draws for the session
let gameOver = false;               // true once a winner or draw is detected
let mode     = MODE_TWO_PLAYER;     // currently active game mode

// ─── State factories ──────────────────────────────────────────────────────────
// Defined here (before first use) so both initial setup and every reset call
// the same factory instead of duplicating the literal structure.

// Returns a fresh 9-cell board with every position empty.
function createEmptyBoard() {
  return Array(9).fill(null);
}

// Returns a zeroed scores object: X wins, O wins, and draws all start at 0.
function createEmptyScores() {
  return { X: 0, O: 0, D: 0 };
}

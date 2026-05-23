const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const btn2pEl = document.getElementById('btn-2p');
const btnAiEl = document.getElementById('btn-ai');
const labelOEl = document.getElementById('label-o');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDEl = document.getElementById('score-d');

let board = createEmptyBoard();
let current = PLAYER_X;
let scores = createEmptyScores();
let gameOver = false;
let mode = MODE_TWO_PLAYER;

function createEmptyBoard() {
  return Array(9).fill(null);
}

function createEmptyScores() {
  return { X: 0, O: 0, D: 0 };
}

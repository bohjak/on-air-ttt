/* This is an implementation of a different way of handling state.
 *
 * The advantages would've been:
 * agnostic approach to board size (and, potentially, number of players),
 * more efficient execution (only doing work relevant for the new move, not the whole board),
 * and easily accessible knowledge of positions for an AI.
 *
 * Alas, this approach has proven more difficult than anticipated
 * and is not in a usable shape, currently.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StepPossibility = number[];
type StepPossibilities = StepPossibility[];
type AllPossibilities = StepPossibilities[];

interface MovesState {
  // Indeces of moves in order of play
  positions: number[];
  // Possible winning progressions for each play
  possibleWins: AllPossibilities;
  // Width of the board
  width: number;
  // Height of the board
  height: number;
  // Number of marks of the same kind in a line necessary for a win
  streak: number;
}

const initialState: MovesState = {
  positions: [],
  possibleWins: [],
  width: 0,
  height: 0,
  streak: 0,
};

const movesSlice = createSlice({
  name: "moves",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<{ w: number; h: number }>) => {
      const { w, h } = action.payload;
      state.width = w;
      state.height = h;
      state.positions = [];
      state.possibleWins = [];
      state.streak = w; // TODO: make configurable
    },

    move: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      state.positions.push(idx);

      const possibleWins = getPossibleWins(
        state.width,
        state.height,
        state.streak,
        idx,
        state.positions[state.positions.length - 2]
      );
      state.possibleWins.push(possibleWins);
      collapsePossibilities(state.possibleWins, idx);
    },
  },
});

export const movesActions = movesSlice.actions;
export const movesReducer = movesSlice.reducer;

export type CellType = "x" | "o" | "empty";
export const selectBoard = ({ moves }: { moves: MovesState }): CellType[] => {
  const { width: boardWidth, height: boardHeight, positions } = moves;
  const board: CellType[] = new Array(boardWidth * boardHeight);
  board.fill("empty");
  for (const [i, pos] of positions.entries()) {
    board[pos] = i % 2 === 0 ? "x" : "o";
  }
  return board;
};

export const getPossibleWins = (
  h: number,
  w: number,
  streak: number,
  idx: number,
  lastMove: number
): StepPossibilities => {
  const possibleWins: StepPossibilities = [];
  const x = idx % h;
  const y = (idx - x) / h;
  console.assert(Number.isInteger(y));
  const s = streak - 1;

  // Row
  for (let i = Math.max(0, x - s); i <= x && i + s < w; ++i) {
    const possibility: StepPossibility = [];
    for (let j = i; j < i + streak; ++j) {
      if (j === x) continue;
      const possibilityIdx = idx - x + j;
      if (possibilityIdx === lastMove) break;
      possibility.push(possibilityIdx);
    }
    if (possibility.length) possibleWins.push(possibility);
  }

  // Column
  for (let i = Math.max(0, y - s); i <= y && i + s < h; ++i) {
    const possibility: StepPossibility = [];
    for (let j = i; j < i + streak; ++j) {
      if (j === y) continue;
      const possibilityIdx = j * w + x;
      if (possibilityIdx === lastMove) break;
      possibility.push(possibilityIdx);
    }
    if (possibility.length) possibleWins.push(possibility);
  }

  // Diagonal — totally confusing; here i and j are offsets applied to x and y, instead of real coordinates + there are two possible diagonals
  for (let i = s; i >= 0; --i) {
    const possibility: StepPossibility = [];
    const ix = x - i;
    const iy = y - i;
    if (ix < 0 || iy < 0 || ix + s >= w || iy + s >= h) continue;

    for (let j = 0; j < streak; ++j) {
      // TODO: figure out diagR as well
      const jx = ix + j;
      const jy = iy + j;
      if (jx == x || jy == y) continue;

      const possibilityIdx = jy * w + jx;
      if (possibilityIdx === lastMove) break;
      possibility.push(possibilityIdx);
    }
    if (possibility.length) possibleWins.push(possibility);
  }

  for (let i = s; i >= 0; --i) {
    const possibility: StepPossibility = [];
    const ix = x + i;
    const iy = y - i;
    if (ix >= w || iy < 0 || ix - s < 0 || iy + s >= h) continue;

    for (let j = 0; j < streak; ++j) {
      const jx = ix - j;
      const jy = iy + j;
      if (jx == x || jy == y) continue;

      const possibilityIdx = idx - x + j;
      if (possibilityIdx === lastMove) break;
      possibility.push(possibilityIdx);
    }
    if (possibility.length) possibleWins.push(possibility);
  }

  return possibleWins;
};

// Might work?
export const collapsePossibilities = (
  possibilities: AllPossibilities,
  newMove: number
): AllPossibilities => {
  const playerCount = 2; // TODO: if more players, update this number
  const playerId = possibilities.length % playerCount;
  for (const [stepId, stepPosss] of possibilities.entries()) {
    // Ignore players own moves
    if (stepId % playerCount !== playerId) continue;
    for (const [i, stepPoss] of stepPosss.entries()) {
      for (const poss of stepPoss) {
        if (poss === newMove) {
          stepPosss.splice(i, 1);
        }
      }
    }
  }
  return possibilities;
};

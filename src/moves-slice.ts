import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MovesState {
  // Indeces of moves in order of play
  positions: number[];
  // Possible winning progressions for each play
  possibleWins: number[][][];
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

      const possibleWins: number[][] = [];

      // Winning slices
      // *--  *  -  -    *    -    -  *    -    -
      // -*-  -  *  -   -    *    -    -    *    -
      // --*  -  -  *  -    -    *      -    -    *

      const { height: h, width: w, streak } = state;
      const x = idx % h;
      const y = (idx - x) / h;
      console.assert(Number.isInteger(y));
      const s = streak - 1;

      // Row
      const horizontal: number[] = [];
      for (let i = Math.max(0, x - s); i <= x && i + s < w; ++i) {
        for (let j = i; j < i + streak; ++j) {
          if (j === x) continue;
          horizontal.push(idx - x + j);
        }
      }
      possibleWins.push(horizontal);

      // Column
      const vertical: number[] = [];
      for (let i = Math.max(0, y - s); i <= y && i + s < h; ++i) {
        for (let j = i; j < i + streak; ++j) {
          if (j === y) continue;
          vertical.push(j * w + x);
        }
      }
      possibleWins.push(vertical);

      // Diagonal — totally confusing; here i and j are offsets applied to x and y, instead of real coordinates + there are two possible diagonals
      const diagL: number[] = [];
      for (let i = s; i >= 0; --i) {
        const ix = x - i;
        const iy = y - i;
        if (ix < 0 || iy < 0 || ix + s >= w || iy + s >= h) continue;

        for (let j = 0; j < streak; ++j) {
          // TODO: figure out diagR as well
          const jx = ix + j;
          const jy = iy + j;
          if (jx == x || jy == y) continue;

          diagL.push(jy * w + jx);
        }
      }
      possibleWins.push(diagL);

      const diagR: number[] = [];
      for (let i = s; i >= 0; --i) {
        const ix = x + i;
        const iy = y - i;
        if (ix >= w || iy < 0 || ix - s < 0 || iy + s >= h) continue;

        for (let j = 0; j < streak; ++j) {
          const jx = ix - j;
          const jy = iy + j;
          if (jx == x || jy == y) continue;

          diagR.push(jy * w + jx);
        }
      }
      possibleWins.push(diagR);

      state.possibleWins.push(possibleWins);
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

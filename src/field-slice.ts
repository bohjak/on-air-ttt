// TODO: rename to gameSlice or something
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// TODO: not sure this is the best way to do this
export enum GameStage {
  Init = "Init",
  Progress = "Progress",
  Tie = "Tie",
  Win = "Win",
}

export enum CellState {
  Empty = "Empty",
  X = "X",
  O = "O",
}

export type Player = CellState.X | CellState.O;

export type PossibleWin = number[];

export interface FieldState {
  width: number;
  height: number;
  streak: number;
  cells: CellState[];
  possibleWinsX: PossibleWin[];
  possibleWinsO: PossibleWin[];
  nextPlayer: Player;
  stage: GameStage;
}

const initialState: FieldState = {
  width: 0,
  height: 0,
  streak: 0,
  cells: [],
  possibleWinsX: [],
  possibleWinsO: [],
  nextPlayer: CellState.X,
  stage: GameStage.Init,
};

const createCells = (w: number, h: number): CellState[] => {
  return Array.from({ length: w * h }).fill(CellState.Empty) as CellState[];
};

export const fieldSlice = createSlice({
  name: "field",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<{ w: number; h: number }>) => {
      const { w, h } = action.payload;
      state.width = w;
      state.height = h;
      state.streak = Math.min(w, h); // TODO: get from payload
      state.cells = createCells(w, h);
      state.stage = GameStage.Progress;
    },

    select: (state, action: PayloadAction<{ idx: number }>) => {
      const { idx } = action.payload;
      state.cells[idx] = state.nextPlayer;
    },

    nextPlayer: (state) => {
      // FIXME: store all moves and use a cyclical selection logic for this
      //  — nextPlayer = players[moves.length % players.length], but hopefully better
      state.nextPlayer =
        state.nextPlayer === CellState.X ? CellState.O : CellState.X;
    },

    end: (state, action: PayloadAction<GameStage.Win | GameStage.Tie>) => {
      state.stage = action.payload;
    },

    reset: (state) => {
      state.cells = createCells(state.width, state.height);
      state.possibleWinsX = [];
      state.possibleWinsO = [];
      state.nextPlayer = CellState.X;
      state.stage = GameStage.Progress;
    },
  },
});

export const fieldAction = fieldSlice.actions;
export const fieldReducer = fieldSlice.reducer;

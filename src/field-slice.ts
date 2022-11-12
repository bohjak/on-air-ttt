import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum CellState {
  Empty = "Empty",
  X = "X",
  O = "O",
}

interface FieldState {
  width: number;
  height: number;
  cells: CellState[];
}

const initialState: FieldState = {
  width: 0,
  height: 0,
  cells: [],
};

export const fieldSlice = createSlice({
  name: "field",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<{ w: number; h: number }>) => {
      const { w, h } = action.payload;
      state.width = w;
      state.height = h;
      state.cells = Array.from({ length: w * h }).fill(
        CellState.Empty
      ) as CellState[];
    },
  },
});

export const { init } = fieldSlice.actions;

export const fieldReducer = fieldSlice.reducer;

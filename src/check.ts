// FIXME: this approach doesn't scale well with larger fields — especially if the winning slice is smaller than field dimensions — and the results aren't easily usable by a player AI

import { CellState, GameStage } from "./field-slice";

const isX = (cell: CellState): boolean => cell === CellState.X;
const isO = (cell: CellState): boolean => cell === CellState.O;

export const checkRows = (cells: CellState[]): boolean => {
  const rows: CellState[][] = [];
  for (let i = 1; i <= 3; ++i) {
    rows.push(cells.slice((i - 1) * 3, i * 3));
  }
  return rows.some((row) => row.every(isX) || row.every(isO));
};

export const checkColumns = (cells: CellState[]): boolean => {
  const cols: CellState[][] = [[], [], []];
  for (let i = 0; i < cells.length; ++i) {
    cols[i % 3].push(cells[i]);
  }
  return cols.some((col) => col.every(isX) || col.every(isO));
};

export const checkDiags = (cells: CellState[]): boolean => {
  const diags: CellState[][] = [[], []];
  for (let i = 0; i < cells.length; ++i) {
    if (i % 4 === 0) diags[0].push(cells[i]);
    if (i % 2 === 0 && i % 8 !== 0) diags[1].push(cells[i]);
  }
  return diags.some((diag) => diag.every(isX) || diag.every(isO));
};

export const checkEndCondition = (
  cells: CellState[]
): GameStage.Tie | GameStage.Win | null => {
  if (checkRows(cells) || checkColumns(cells) || checkDiags(cells)) {
    return GameStage.Win;
  }
  if (cells.every((cell) => cell !== CellState.Empty)) return GameStage.Tie;
  return null;
};

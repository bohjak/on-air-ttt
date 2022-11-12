import React from "react";
import { CellState, fieldAction, FieldState, GameStage } from "./field-slice";
import { AppDispatch, RootState, useDispatch, useSelector } from "./store";

// FIXME: this is all dumb and the state should be stored completely differentely

const isX = (cell: CellState): boolean => cell === CellState.X;
const isO = (cell: CellState): boolean => cell === CellState.O;

const checkRows = (cells: FieldState["cells"]): boolean => {
  const rows: CellState[][] = [];
  for (let i = 1; i <= 3; ++i) {
    rows.push(cells.slice((i - 1) * 3, i * 3));
  }
  if (rows.some((row) => row.every(isX) || row.every(isO))) return true;
  return false;
};
const checkColumns = (cells: FieldState["cells"]): boolean => {
  const cols: CellState[][] = [[], [], []];
  for (let i = 0; i < cells.length; ++i) {
    cols[i % 3].push(cells[i]);
  }
  if (cols.some((col) => col.every(isX) || col.every(isO))) return true;
  return false;
};
const checkDiags = (cells: FieldState["cells"]): boolean => {
  // FIXME: all the other check functions are awful, but this one takes the cake;
  const diags: CellState[][] = [[], []];
  for (let i = 0; i < cells.length; ++i) {
    if (i % 4 === 0) diags[0].push(cells[i]);
  }
  diags[1].push(cells[2]);
  diags[1].push(cells[4]);
  diags[1].push(cells[6]);
  if (diags.some((diag) => diag.every(isX) || diag.every(isO))) return true;
  return false;
};

const checkEndCondition = (
  cells: FieldState["cells"]
): GameStage.Tie | GameStage.Win | null => {
  if (checkRows(cells) || checkColumns(cells) || checkDiags(cells)) {
    return GameStage.Win;
  }
  if (cells.every((cell) => cell !== CellState.Empty)) return GameStage.Tie;
  return null;
};

const makeMove =
  (idx: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    let field: FieldState;
    field = getState().field;
    if (field.stage != GameStage.Progress) return;
    if (idx < 0 || idx >= field.cells.length) {
      // TODO: replace with a better error handling system
      console.error(
        `selected cell's index is out of bounds: ${idx}, cells length: ${field.cells.length}`
      );
      return;
    }
    if (field.cells[idx] !== CellState.Empty) {
      return;
    }
    dispatch(fieldAction.select({ idx }));

    field = getState().field;
    const res = checkEndCondition(field.cells);
    if (res != null) {
      dispatch(fieldAction.end(res));
    } else {
      dispatch(fieldAction.nextPlayer());
    }
  };

export const Field: React.FC = () => {
  const dispatch = useDispatch();
  const field = useSelector(({ field }) => field);
  const cells = field.cells.map((cellState, i) => (
    <div
      key={i}
      className={`cell ${cellState.toLowerCase()}`}
      onClick={() => dispatch(makeMove(i))}
    ></div>
  ));
  return <div className="field">{cells}</div>;
};

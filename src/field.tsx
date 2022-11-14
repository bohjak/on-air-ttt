import React from "react";
import { checkEndCondition } from "./check";
import { CellState, fieldAction, FieldState, GameStage } from "./field-slice";
import { AppDispatch, RootState, useDispatch, useSelector } from "./store";

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

    /* dispatch(movesActions.move(idx)); */

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
  const renderCell = (cell: CellState, i: number) => (
    <div
      key={i}
      className={`cell ${cell.toLowerCase()} ${field.stage.toLowerCase()}-${field.nextPlayer.toLowerCase()}`}
      onClick={() => dispatch(makeMove(i))}
    ></div>
  );
  const cells = field.cells.map(renderCell);
  return (
    <div
      className={`field ${
        field.stage === GameStage.Progress && field.nextPlayer.toLowerCase()
      }`}
    >
      {cells}
    </div>
  );
};

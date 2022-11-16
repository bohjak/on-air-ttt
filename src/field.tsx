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

const Cell: React.FC<{
  idx: number;
}> = ({ idx }) => {
  const dispatch = useDispatch();
  const state = useSelector(({ field }) => field.cells[idx]);
  const blur = useSelector(
    ({ field }) =>
      field.stage === GameStage.Tie ||
      (field.stage === GameStage.Win && field.nextPlayer !== state)
  );
  return (
    <div
      className={`cell ${state.toLowerCase()} ${blur && "blur"}`}
      onClick={() => dispatch(makeMove(idx))}
    ></div>
  );
};

export const Field: React.FC = () => {
  const cells: JSX.Element[] = [];
  for (let i = 0; i < 9; ++i) {
    cells.push(<Cell key={i} idx={i} />);
  }
  return <div className={`field`}>{cells}</div>;
};

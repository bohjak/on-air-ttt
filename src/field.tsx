import React from "react";
import { CellState } from "./field-slice";
import { useSelector } from "./store";

export const Field: React.FC = () => {
  const field = useSelector(({ field }) => field);
  const cells = field.cells.map((cellState, i) => (
    <div
      key={i}
      className={`cell ${cellState === CellState.Empty ? "empty" : "filled"}`}
    ></div>
  ));
  return <div className="field">{cells}</div>;
};

import React from "react";
import { Field } from "./field";
import { fieldAction } from "./field-slice";
import { movesActions } from "./moves-slice";
import { useDispatch } from "./store";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  React.useEffect(function initField() {
    dispatch(fieldAction.init({ w: 3, h: 3 }));
    dispatch(movesActions.init({ w: 3, h: 3 }));
  });

  return (
    <div>
      {/* <h1>Tick Tack Toe</h1> */}
      <section>
        <Field />
      </section>
      <button onClick={() => dispatch(fieldAction.reset())}>Reset</button>
    </div>
  );
};

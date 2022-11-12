import React from "react";
import { Field } from "./field";
import { init } from "./field-slice";
import { useDispatch } from "./store";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  React.useEffect(function initField() {
    dispatch(init({ w: 3, h: 3 }));
  });

  return (
    <div>
      <h1>Tick Tack Toe</h1>
      <section>
        <Field />
      </section>
    </div>
  );
};

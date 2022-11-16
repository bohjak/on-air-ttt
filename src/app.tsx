import React from "react";
import { Field } from "./field";
import { fieldAction, GameStage } from "./field-slice";
import { Logo } from "./logo";
import { useDispatch, useSelector } from "./store";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const stage = useSelector(({ field }) => field.stage === GameStage.Init);
  const initField = () => {
    dispatch(fieldAction.init({ w: 3, h: 3 }));
  };

  return (
    <section className="content">
      {stage ? (
        <Logo onClick={initField} />
      ) : (
        <div className="gameWrapper">
          <Field />
          <button
            className="reset"
            onClick={() => dispatch(fieldAction.reset())}
          >
            <span>Reset</span>
          </button>
        </div>
      )}
    </section>
  );
};

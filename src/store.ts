import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from "react-redux";
import { fieldReducer } from "./field-slice";
import { movesReducer } from "./moves-slice";

export const store = configureStore({
  reducer: {
    field: fieldReducer,
    moves: movesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;

export type AppDispatch = typeof store.dispatch;
export const useDispatch = () => _useDispatch<AppDispatch>();

import { useRxReducer, useRxState } from "@azlabsjs/rx-hooks";
import { type Observable } from "rxjs";
import {
  type DispatchType,
  type ReducerComponentType,
  type SetStateType,
  type StateComponentType
} from "./types";

/**
 * Creates a component type providing useRxState(...)  implementation
 * through state$ and setState$ properties that holds a reference to the
 * component state and a function to modify the state
 *
 * @param _default
 */
export function State<TState>(_default: TState) {
  const [state, setState] = useRxState(_default);
  return <T extends new (...args: any[]) => StateComponentType<TState>>(
    constructor: T
  ) => {
    class DecoratedClass extends constructor {
      public override readonly state$: Observable<TState> = state;
      public override readonly setState$: SetStateType<TState> = setState;
    }
    return DecoratedClass;
  };
}

/**
 * Creates a component type providing useRxReducer(...)  implementation
 * through state$ and dispatch$ properties that holds a reference to the
 * component state and a function to modify the state
 */
export function Reducer<TState, ActionType = any>(
  reducer: (state: TState, action: ActionType) => TState,
  initial: TState,
  _init?: (_initial: unknown) => TState
) {
  const [state, disptach] = useRxReducer(reducer, initial, _init);
  return <
    T extends new (...args: any[]) => ReducerComponentType<TState, ActionType>
  >(
    constructor: T
  ) => {
    class DecoratedClass extends constructor {
      public override readonly state$: Observable<TState> = state;
      public override readonly dispatch$: DispatchType<ActionType> = disptach;
    }
    return DecoratedClass;
  };
}

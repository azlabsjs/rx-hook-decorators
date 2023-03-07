import { useRxReducer, useRxState } from '@azlabsjs/rx-hooks';
import { Observable } from 'rxjs';
import {
  DispatchType,
  ReducerComponentType,
  SetStateType,
  StateComponentType,
} from './types';

/**
 * Creates a component type providing useRxState(...)  implementation
 * through state$ and setState$ properties that holds a reference to the
 * component state and a function to modify the state
 *
 * @param _default
 */
export function State<TState>(_default: TState) {
  return <T extends new (...args: any[]) => StateComponentType<TState>>(
    constructor: T
  ) => {
    class DecoratedClass extends constructor {
      public override readonly state$!: Observable<TState>;
      public override readonly setState$!: SetStateType<TState>;

      /**
       * Creates class instance with required arguments
       */
      constructor(...args: any[]) {
        super(...args);
        const [state, setState] = useRxState(_default);
        this.state$ = state;
        this.setState$ = setState;
      }
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
  return <
    T extends new (...args: any[]) => ReducerComponentType<TState, ActionType>
  >(
    constructor: T
  ) => {
    class DecoratedClass extends constructor {
      public override readonly state$!: Observable<TState>;
      public override readonly dispatch$!: DispatchType<ActionType>;

      /**
       * Creates class instance with required arguments
       */
      constructor(...args: any[]) {
        super(...args);
        const [state, disptach] = useRxReducer(reducer, initial, _init);
        this.state$ = state;
        this.dispatch$ = disptach;
      }
    }
    return DecoratedClass;
  };
}

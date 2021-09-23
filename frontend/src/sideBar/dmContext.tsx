import React, { useReducer, createContext, useContext, Dispatch } from "react";

export type DM = {
	id: number;
	message: string;
}

type Action =
	| {type: "LOAD"; DMList: DM[]}
	| {type: "ADD"; DM: DM};

function DMReducer(state: DM[], action: Action) {
  switch (action.type) {
    case "LOAD":
      state = action.DMList;
      return state;
    case "ADD":
      return state.concat(action.DM);
  	default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

const DMStateContext = createContext<DM[] | undefined>(undefined);
const DMDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export function DMProvider({children}: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(DMReducer, []);

  return (
    <DMStateContext.Provider value={state}>
      <DMDispatchContext.Provider value={dispatch}>
        {children}
      </DMDispatchContext.Provider>
    </DMStateContext.Provider>
  );
}

export function useDMState() {
  const context = useContext(DMStateContext);
  if (!context) {
    throw new Error("Cannot find DMProvider");
  }
  return context;
}

export function useDMDispatch() {
  const context = useContext(DMDispatchContext);
  if (!context) {
    throw new Error("Cannot find DMProvider");
  }
  return context;
}
import React, { useReducer, createContext, useContext, Dispatch, useRef } from "react";

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
const DMRefContext = createContext<React.MutableRefObject<HTMLLIElement | null> | undefined>(undefined);

export function DMProvider({children}: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(DMReducer, []);
  const DMRef = useRef<HTMLLIElement | null>(null);

  return (
    <DMStateContext.Provider value={state}>
      <DMDispatchContext.Provider value={dispatch}>
        <DMRefContext.Provider value={DMRef}>
	      	{children}
		    </DMRefContext.Provider>
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

export function useDMRef() {
	const context = useContext(DMRefContext);
	if (!context) {
	  throw new Error("Cannot find DMProvider");
	}
	return context;
}
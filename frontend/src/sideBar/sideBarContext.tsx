import React, { useReducer, createContext, useContext, Dispatch, useRef, MutableRefObject } from "react";

const testUsers: User[] = [
	{
	  id: 1,
	  nickname: 'abc12',
	  alert: false
	},
	{
	  id: 2,
	  nickname: 'def34',
	  alert: false
	},
	{
	  id: 3,
	  nickname: 'ghi56',
	  alert: false
	},
	{
	  id: 4,
	  nickname: 'jkl78',
	  alert: false
	}
];

export type User = {
	id: number;
	nickname: string;
	alert: boolean;
}

type Action =
	| {type: "CREATE"; user: User}
	| {type: "ALERT"; sender: number}
	| {type: "READ"; sender: number}
	| {type: "BAN"; id: number};

function SideBarReducer(state: User[], action: Action) {
  switch (action.type) {
    case "CREATE":
      return state.concat(action.user);
    case "ALERT":
      return state.map(user =>
    	user.id === action.sender ? { ...user, alert: true } : user);
	case "READ":
      return state.map(user =>
    	user.id === action.sender ? { ...user, alert: false } : user);
    case "BAN":
    	return state.filter(user => user.id !== action.id);
  	default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

const SideBarStateContext = createContext<User[] | undefined>(undefined);
const DMwithContext = createContext<MutableRefObject<User> | undefined>(undefined);
const SideBarDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export function SideBarProvider({children}: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(SideBarReducer, testUsers);
  const DMwith = useRef<User>({id: 0, nickname: '', alert: false});

  return (
    <SideBarStateContext.Provider value={state}>
      <SideBarDispatchContext.Provider value={dispatch}>
	    <DMwithContext.Provider value={DMwith}>
	    	{children}
		</DMwithContext.Provider>
      </SideBarDispatchContext.Provider>
    </SideBarStateContext.Provider>
  );
}

export function useSideBarState() {
  const context = useContext(SideBarStateContext);
  if (!context) {
    throw new Error("Cannot find DMProvider");
  }
  return context;
}

export function useSideBarDispatch() {
  const context = useContext(SideBarDispatchContext);
  if (!context) {
    throw new Error("Cannot find DMProvider");
  }
  return context;
}

export function useDMwith() {
	const context = useContext(DMwithContext);
	if (!context) {
	  throw new Error("Cannot find DMProvider");
	}
	return context;
  }
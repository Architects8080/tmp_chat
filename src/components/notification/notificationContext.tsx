import React, { useReducer, createContext, useContext, Dispatch } from "react";

const testNoti: Notification[] = [
	{
		title: "test1",
		description: "polarbear 님의 친구 신청입니다. 수락하시겠습니까?",
		acceptCallback: () => {},
		rejectCallback: () => {}
	},
	{
		title: "test2",
		description: "polarbear 님의 친구 신청입니다. 수락하시겠습니까?",
		acceptCallback: () => {},
		rejectCallback: () => {}
	},
	{
		title: "test3",
		description: "polarbear 님의 채팅방 초대입니다. 수락하시겠습니까?",
		acceptCallback: () => {},
		rejectCallback: () => {}
	}
];

export type Notification = {
	title: string;
	description: string;
	acceptCallback: () => void;
	rejectCallback: () => void;
}

type Action =
	| {type: "LOAD"; NotiList: Notification[]}
	| {type: "ADD"; Notification: Notification};

function NotificationReducer(state: Notification[], action: Action) {
  switch (action.type) {
    case "LOAD":
      state = action.NotiList;
      return state;
    case "ADD":
      return state.concat(action.Notification);
  	default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

const NotiStateContext = createContext<Notification[] | undefined>(undefined);
const NotiDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export function NotificationProvider({children}: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(NotificationReducer, testNoti);
  return (
    <NotiStateContext.Provider value={state}>
      <NotiDispatchContext.Provider value={dispatch}>
        {children}
      </NotiDispatchContext.Provider>
    </NotiStateContext.Provider>
  );
}

export function useNotiState() {
  const context = useContext(NotiStateContext);
  if (!context) {
    throw new Error("Cannot find NotificationProvider");
  }
  return context;
}

export function useNotiDispatch() {
  const context = useContext(NotiDispatchContext);
  if (!context) {
    throw new Error("Cannot find NotificationProvider");
  }
  return context;
}
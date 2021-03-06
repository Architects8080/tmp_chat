import React from "react";
import { io } from "../../../socket/socket";
import DefaultDropdownItem from "../itemTemplate/default/item";

type props = {
  gameId: number;
};

const ObserveGameItem = (prop: props) => {
  const handleObserveGame = () => {
    io.emit("observe", [prop.gameId]); //TODO
  };

  return (
    <DefaultDropdownItem
      title="게임 관전하기"
      color="black"
      callback={handleObserveGame}
    />
  );
}

export default ObserveGameItem;

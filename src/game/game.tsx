import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { io } from "../socket/socket";
import { GameInfo } from "./gameType";
import Pong from "./pong/pong";

function Game() {
  const { id } = useParams<{ id: string }>();
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

  useEffect(() => {
    console.log(`id : `, id);
    io.on("update", (roomID, updateInfo: GameInfo) => {
      if (roomID == id) {
        setGameInfo(updateInfo);
      }
    });
  }, []);

  return (
    <React.Fragment>
      {/* its game room! game room id : {id} */}
      { gameInfo ? 
        <Pong
          roomID={id}
          gameInfo={gameInfo}
        ></Pong> : ""
      }
    </React.Fragment>
  );
}

export default Game;

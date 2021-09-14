import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { io } from "../socket/socket";
import { GameInfo } from "./gameType";
import Pong from "./pong/pong";

function Game() {
  const { id } = useParams<{ id: string }>();

  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  var temp: GameInfo | null = null;

  var isGetPlayerInfo = false;
  const [playerInfo, setPlayerInfo] = useState<{ [key: string]: any }>({
    player1: {},
    player2: {},
  });

  const getPlayerInfo = async (playerId: number): Promise<any> => {
    return axios.get(
      process.env.REACT_APP_SERVER_ADDRESS + "/user/" + playerId,
      { withCredentials: true }
    );
  };

  useEffect(() => {
    io.on("update", async (roomID, updateInfo: GameInfo) => {
      if (roomID == id) {
        temp = updateInfo;
        setGameInfo(updateInfo);
      }
      if (!isGetPlayerInfo && temp) {
        isGetPlayerInfo = true; //to call api once
        const player1Data = await getPlayerInfo(temp.player1.id);
        const player2Data = await getPlayerInfo(temp.player2.id);
        playerInfo["player1"] = player1Data.data;
        playerInfo["player2"] = player2Data.data;
      }
    });
  }, []);

  return (
    <React.Fragment>
      {gameInfo ? (
        <div>
          {/* {console.log(playerInfo['player1'].avatar)} */}
          <img
            src={playerInfo["player1"].avatar}
            alt="cannot display"
            width={80}
          />
          {playerInfo["player1"].nickname}'s score : {gameInfo.player1.score}
          <img
            src={playerInfo["player2"].avatar}
            alt="cannot display"
            width={80}
          />
          {playerInfo["player2"].nickname}'s score : {gameInfo.player2.score}
          <Pong roomID={id} gameInfo={gameInfo}></Pong>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default Game;

import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { io } from "../../socket/socket";
import { ModalManager } from "../sidebar/sidebarType";
import snackbar from "../snackbar/snackbar";
import GameInviteModal from "./game/gameInviteModal";
import GameSettingModal from "./game/gameSettingModal";

const GameModalListener = ({modalHandler} : {modalHandler: ModalManager}) => {
  const acceptMessage = `곧 게임이 시작되니 준비하십시오.`;
  const rejectMessage = `상대방이 게임을 거절했습니다.`;
  const [inviteUserInfo, setInviteUserInfo] = useState({
    nickname: "",
    avatar: "",
    gameId: 0,
    isLadder: false,
  });
  const [gameId, setGameId] = useState(0);

  useEffect(() => {
    io.on("invite", (inviteUserNickname, inviteUserAvatar, gameId, isLadder) => {
      setInviteUserInfo({
        nickname: inviteUserNickname,
        avatar: inviteUserAvatar,
        gameId: gameId,
        isLadder: isLadder,
      });
      modalHandler.handleModalOpen('gameInvite');
    });

    io.on("ready", (gameId) => {
      snackbar.success(acceptMessage);
      setGameId(gameId);
    });

    io.on("cancel", (gameId) => {
      snackbar.error(rejectMessage);
    });
  }, []);

  if (gameId != 0) return <Redirect to={{ pathname: "/game/" + gameId }} />;

  return(
    <GameInviteModal
      inviteInfo={inviteUserInfo}
      open={modalHandler.isModalOpen.gameInvite}
      close={() => {modalHandler.handleModalClose("gameInvite");

      if (modalHandler.setWaiting)
        modalHandler.setWaiting(false);
      }}
    />
  );
};

export default GameModalListener;
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { io } from "../../socket/socket";
import { modalHandler } from "../sideBar/sideBarType";
import snackbar from "../snackbar/snackbar";
import GameInviteModal from "./game/gameInviteModal";
import GameSettingModal from "./game/gameSettingModal";

const GameModalListener = ({modalHandler} : {modalHandler: modalHandler}) => {
  const acceptMessage = `곧 게임이 시작되니 준비하십시오.`;
  const rejectMessage = `상대방이 게임을 거절했습니다.`;
  const [inviteUserInfo, setInviteUserInfo] = useState({
    nickname: "",
    avatar: "",
    roomID: 0,
  });
  const [roomID, setRoomID] = useState(0);

  useEffect(() => {
    io.on("invite", (inviteUserNickname, inviteUserAvatar, roomID) => {
      setInviteUserInfo({
        nickname: inviteUserNickname,
        avatar: inviteUserAvatar,
        roomID: roomID,
      });
      modalHandler.handleModalOpen('gameSetting');
    });

    io.on("ready", (roomID) => {
      snackbar.success(acceptMessage);
      setRoomID(roomID);
    });

    io.on("cancel", (roomID) => {
      snackbar.error(rejectMessage);
    });
  }, []);

  if (roomID != 0) return <Redirect to={{ pathname: "/game/" + roomID }} />;

  return(
    <GameInviteModal
      inviteInfo={inviteUserInfo}
      open={modalHandler.isModalOpen.gameSetting}
      close={() => modalHandler.handleModalClose("gameSetting")}
    />
  );
};

export default GameModalListener;
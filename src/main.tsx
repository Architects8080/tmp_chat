import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import GameInviteModal from "./game/modal/gameInviteModal";
import GameSettingModal from "./game/modal/gameSettingModal";
import ShowSnackbar from "./game/snackbar/snackbar";
import { io } from "./socket/socket";

function Main() {
  const acceptMessage = `곧 게임이 시작되니 준비하십시오.`;
  const rejectMessage = `상대방이 게임을 거절했습니다.`;

  const [isGameInviteModalOpen, setGameInviteModalOpen] = useState(false);
  const [isGameSettingModalOpen, setGameSettingModalOpen] = useState(false);
  const [inviteUserInfo, setInviteUserInfo] = useState({
    nickname: "",
    avater: "",
    roomID: 0,
  });
  const [roomID, setRoomID] = useState(0);

  const openGameSettingModal = () => {
    setGameSettingModalOpen(true);
  };

  const closeGameSettingModal = () => {
    setGameSettingModalOpen(false);
  };

  const openGameInviteModal = () => {
    setGameInviteModalOpen(true);
  };

  const closeGameInviteModal = () => {
    setGameInviteModalOpen(false);
  };

  useEffect(() => {
    io.on("invite", (inviteUserNickname, inviteUserAvater, roomID) => {
      setInviteUserInfo({
        nickname: inviteUserNickname,
        avater: inviteUserAvater,
        roomID: roomID,
      });
      openGameInviteModal();
    });

    io.on("ready", (roomID) => {
      ShowSnackbar.success(acceptMessage);
      setRoomID(roomID);
    });

    io.on("cancel", (roomID) => {
      ShowSnackbar.error(rejectMessage);
    });
  }, []);

  var targetUserID = 68874; //change to another 'id' in DB
  const handleCustomMatch = () => {
    openGameSettingModal();
    // io.emit("invite", [targetUserID]);
  };

  if (roomID != 0) return <Redirect to={{ pathname: "/game/" + roomID }} />;

  return (
    <div>
      <button onClick={handleCustomMatch}>Custom Match(Invite)</button>
      <GameSettingModal
        open={isGameSettingModalOpen}
        close={closeGameSettingModal}
        header="게임 설정"
        targetUserId={68874}
      ></GameSettingModal>
      <GameInviteModal
        inviteInfo={inviteUserInfo}
        open={isGameInviteModalOpen}
        close={closeGameInviteModal}
        header="게임 참가"
      ></GameInviteModal>
    </div>
  );
}

export default Main;

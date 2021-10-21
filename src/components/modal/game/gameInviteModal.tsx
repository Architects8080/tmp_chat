import React from "react";
import "./gameModal.scss";
import { io } from "../../../socket/socket";

type inviteInfo = {
  nickname: string;
  avatar: string;
  roomID: number;
  isLadder: boolean;
};

type ModalProps = {
  open: any;
  close: any;
  inviteInfo: inviteInfo;
};

function GameInviteModal(prop: ModalProps) {
  const handleAccept = () => {
    io.emit("accept", [prop.inviteInfo.roomID]);

    prop.close();
  };

  const handleReject = () => {
    io.emit("cancel", [prop.inviteInfo.roomID]);

    prop.close();
  };

  return (
    <div className={prop.open ? "open-modal modal" : "modal"}>
      {prop.open ? (
        <section>
          <div className="modal-title">
            게임 참가
            <img
              className="close"
              alt="close"
              src="/icons/modal/close.svg"
              onClick={handleReject} />
          </div>

          <div className="modal-content center">
            <img src={prop.inviteInfo.avatar} className="rounded-avatar" />
          </div>

          <div className="modal-content center">{prop.inviteInfo.nickname}</div>

            {prop.inviteInfo.isLadder == true ? 
              <div className="game-invite">
                {prop.inviteInfo.nickname}님과의 대결이 성사되었습니다.
                <br /> 
                <br />
                게임을 진행하시겠습니까?
              </div>
              :
              <div className="game-invite">
                {prop.inviteInfo.nickname}님의 게임 신청이 도착했습니다.
                <br /> 
                <br />
                게임 신청을 수락하시겠습니까?
              </div>
            }

          <div className="game-invite-submit">
            <button className="accept" onClick={handleAccept}>
              수락
            </button>
            <button className="reject" onClick={handleReject}>
              거절
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default GameInviteModal;

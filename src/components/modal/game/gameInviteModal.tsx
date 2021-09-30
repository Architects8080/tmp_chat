import React from "react";
import "./modal.css";
import { io } from "../../../socket/socket";
import { useState } from "react";
import { useEffect } from "react";

type inviteInfo = {
  nickname: string;
  avater: string;
  roomID: number;
};

type ModalProps = {
  open: any;
  close: any;
  header: any;
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
    <div className={prop.open ? "openModal modal" : "modal"}>
      {prop.open ? (
        <section>
          <div className="modal-title">
            {prop.header}
            <button className="modal-close" onClick={handleReject}>
              {" "}
              X{" "}
            </button>
          </div>

          {/* 1번째 subtitle */}
          {/* from Server get ImageURL*/}
          <div className="modal-content center">
            <div className="image-cropper">
              <img src={prop.inviteInfo.avater} className="rounded" />
            </div>
          </div>

          {/* 2번째 subtitle */}
          {/* from Server get nick */}
          <div className="modal-content center">{prop.inviteInfo.nickname}</div>

          {/* 3번째 subtitle */}
          <div className="game-invite">
            {prop.inviteInfo.nickname}님의 게임 신청이 도착했습니다.
            <br />
            <br />
            게임 신청을 수락하시겠습니까?
          </div>
          <div className="gameInvite-submit">
            <button className="accept" onClick={handleAccept}>
              {" "}
              수락
            </button>
            <button className="reject" onClick={handleReject}>
              {" "}
              거절
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default GameInviteModal;

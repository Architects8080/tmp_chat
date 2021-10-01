import React from "react";
import "./gameModal.scss";
import { io } from "../../../socket/socket";
import { useState } from "react";
import { useEffect } from "react";
import { score, winnerProfile } from "./gameResultModalType";

type ModalProps = {
  open: any;
  close: any;
  header: any;
  score: score;
  winnerProfile: winnerProfile;
};

function GameResultModal(prop: ModalProps) {
  const handleClose = () => {
    //redirect to main
    prop.close();
  };

  return (
    <div className={prop.open ? "openModal modal" : "modal"}>
      {prop.open ? (
        <section>
          <div className="modal-title">
            {prop.header}
            <button className="modal-close" onClick={handleClose}>
              {" "}
              X{" "}
            </button>
          </div>

          {/* 1번째 subtitle */}
          {/* from Server get ImageURL*/}
          <div className="modal-content center">
            <h3>👑Winner👑</h3>
            <div className="image-cropper">
              <img src={prop.winnerProfile.avatar} className="rounded" />
            </div>
          </div>

          {/* 2번째 subtitle */}
          {/* from Server get nick */}
          <div className="modal-content center">
            {prop.winnerProfile.nickname}
          </div>

          {/* 3번째 subtitle */}
          <div className="game-invite">
            스코어 {prop.score.winnerScore} : {prop.score.loserScore}으로 게임이
            종료되었습니다.
            <br />
            <br />
          </div>
          <div className="gameResult-submit">
            <button className="accept" onClick={handleClose}>
              {" "}
              메인으로 돌아가기
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default GameResultModal;

import React from "react";
import "./gameModal.scss";
import { io } from "../../../socket/socket";
import { useState } from "react";
import { useEffect } from "react";
import { score, winnerProfile } from "./gameResultModalType";

type ModalProps = {
  open: any;
  close: any;
  score: score;
  winnerProfile: winnerProfile;
};

function GameResultModal(prop: ModalProps) {
  const handleClose = () => {
    prop.close();
  };

  return (
    <div className={prop.open ? "open-modal modal" : "modal"}>
      {prop.open ? (
        <section>
          <div className="modal-title">
            게임 결과
            <img
              className="close"
              alt="close"
              src="/icons/modal/close.svg"
              onClick={handleClose} />
          </div>

          <div className="modal-content center">
            <h3>👑Winner👑</h3>
            <img src={prop.winnerProfile.avatar} className="rounded-avatar" />
          </div>

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
          <div className="game-result-submit">
            <button className="accept" onClick={handleClose}>
              메인으로 돌아가기
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default GameResultModal;

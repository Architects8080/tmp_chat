import React from "react";
import "./gameModal.scss";
import { score, winnerProfile } from "./gameResultModalType";

type ModalProps = {
  open: any;
  close: any;
  score: score;
  winnerProfile: winnerProfile;
};

const GameResultModal = (prop: ModalProps) => {
  const handleClose = () => {
    prop.close();
  };

  return (
    <div className={prop.open ? "open-modal modal" : "modal"}>
      {prop.open ? (
        <section>
          <div className="modal-title">
            ๊ฒ์ ๊ฒฐ๊ณผ
            <img
              className="close"
              alt="close"
              src="/icons/modal/close.svg"
              onClick={handleClose} />
          </div>

          <div className="modal-content center">
            <h3>๐Winner๐</h3>
            <img src={prop.winnerProfile.avatar} className="rounded-avatar" />
          </div>

          <div className="modal-content center">
            {prop.winnerProfile.nickname}
          </div>

          {/* 3๋ฒ์งธ subtitle */}
          <div className="game-invite">
            ์ค์ฝ์ด {prop.score.winnerScore} : {prop.score.loserScore}์ผ๋ก ๊ฒ์์ด
            ์ข๋ฃ๋์์ต๋๋ค.
            <br />
            <br />
          </div>
          <div className="game-result-submit">
            <button className="accept" onClick={handleClose}>
              ๋ฉ์ธ์ผ๋ก ๋์๊ฐ๊ธฐ
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default GameResultModal;

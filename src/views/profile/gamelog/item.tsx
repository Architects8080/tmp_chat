import React from "react";
import "./item.scss";

type matchUserInfo = {
  isLeft: boolean;
  score: number;
  nickname: string;
  ladderRank: number;
  ladderPoint: number;
  ladderIncrease: number;
};

type matchInfo = {
  gameType: number;
  startAt: NodeJS.Timer;
  endAt: NodeJS.Timer;
  gameTime: number;
};

type gameLogItemProps = {
  matchInfo: matchInfo;
  leftUser: matchUserInfo;
  rightUser: matchUserInfo;
};

// prop: gameLogItemProps | null
function GameLogItem() {
  //raw Info? or retailed Info?
  return (
    <div className="gamelog-wrap">
      {/* margin-bottom */}
      <div className="gamelog-item">
        <div className="gamelog win">
          {" "}
          {/* gameLog lose*/}
          <div className="gamestats">
            <div className="gameinfo">Custom</div>
            <div className="timestamp">42 minutes ago</div>
            <div className="gameresult win">Victory</div> {/* gameResult lose*/}
            <div className="gamelength">12m 42s</div>
          </div>
        </div>

        <div className="detail">
          <div className="leftside">
            <div className="userinfo">
              <div className="nickname">chlee</div>
              <div className="ladderinfo">
                <div className="rank">Ladder Rank: #1</div>
                <div className="point">Ladder Point : 4221 (+21)</div>
              </div>
            </div>
            <img
              className="user-avater"
              alt="user-avater"
              src="https://cdn.intra.42.fr/users/chlee.png"
            />
          </div>

          <div className="score">2 : 4</div>

          <div className="rightside">
            <img
              className="user-avater"
              alt="user-avater"
              src="https://cdn.intra.42.fr/users/yhan.jpg"
            />
            <div className="userinfo">
              <div className="nickname">yhan</div>
              <div className="ladderinfo">
                <div className="rank">Ladder Rank: #1</div>
                <div className="point">Ladder Point : 4221 (+21)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameLogItem;

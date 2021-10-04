import React, { useState } from "react";
import AchievementItem from "../../components/achievement/achievement";
import EmptyPageInfo from "../../components/emptyPage/empty";
import Header from "../../components/header/header";
import SideBar from "../../components/sideBar/sideBar";
import { sidebarProperty } from "../../components/sideBar/sideBarType";
import GameLogItem from "./gamelog/item";
import "./profile.scss";

function Profile() {
  const [isEmpty, setIsEmpty] = useState(false);

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <SideBar title={sidebarProperty.friendList}/>
        <div className="profile-wrap">
          <div className="profile-header">
            <div className="profile-info">
              {/* show info from server */}
              <img
                className="user-avatar"
                alt="user-avatar"
                src="https://cdn.intra.42.fr/users/chlee.png"
              />
              <div className="profile-description">
                <div className="profile-nickname">chlee</div>
                <div className="profile-gameInfo">
                  <div className="ladder-rank">
                    Ladder Rank : #1 (0.1% of top)
                  </div>
                  <div className="ladder-point">Ladder Point : 42</div>
                  <div className="win-ratio-title">42G 40W 2L</div>
                  <div className="win-ratio">Win ratio 95.2%</div>
                </div>
              </div>
            </div>

            <div className="profile-side">
              <div className="profile-searchbar">
                {/* keyevent */}
                <img
                  className="search-icon"
                  alt="search-icon"
                  src="/icons/searchbar/search.svg"
                />
                <input
                  className="search-nickname"
                  type="text"
                  placeholder={"search"}
                />
              </div>
              <div className="achievement-list">
                {/* achievement icons */}
                <AchievementItem title={"승리 10회"} isAchieve={false} />
                <AchievementItem title={"패배 10회"} isAchieve={false} />
                <AchievementItem title={"OTP 등록"} isAchieve={false} />
                <AchievementItem title={"채팅방 첫 접속"} isAchieve={false} />
                <AchievementItem title={"친구 100명 달성"} isAchieve={false} />
              </div>
            </div>
          </div>

          {isEmpty ? (
            <EmptyPageInfo
              description={`전적이 존재하지 않습니다.\n다른 플레이어와 게임을 진행해보세요!`}
            />
          ) : (
            <div className="gameLogList">
              {" "}
              {/* margin-top */}
              <GameLogItem />
              <GameLogItem />
              <GameLogItem />
              <GameLogItem />
              <GameLogItem />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;

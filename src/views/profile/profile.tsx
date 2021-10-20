import { Match } from "@testing-library/dom";
import axios from "axios";
import { userInfo } from "os";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import AchievementItem from "../../components/achievement/achievement";
import EmptyPageInfo from "../../components/emptyPage/empty";
import Header from "../../components/header/header";
import GameModalListener from "../../components/modal/gameModalListener";
import ModalHandler from "../../components/modal/modalhandler";
import SideBar from "../../components/sideBar/sideBar";
import { sidebarProperty } from "../../components/sideBar/sideBarType";
import snackbar from "../../components/snackbar/snackbar";
import GameLogItem from "./gamelog/item";
import "./profile.scss";
import { Achievement, MatchRatio, User } from "./profileType";

function Profile() {
  const modalHandler = ModalHandler();
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [topRate, setTopRate] = useState<string>("100");
  const [matchList, setMatchList] = useState<Match[] | null>(null);
  const [achievedList, setAchievedList] = useState<Achievement[] | null>(null);
  const achievementTitle = ['10회 승리', '20회 승리', '10전 달성', '20전 달성', 'OTP 등록'];

  const [winRatio, setWinRatio] = useState<MatchRatio | null>(null);
  const [search, setSearch] = useState("");

  const searchUser = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || search === "") return;

    axios
      .get(`http://localhost:5000/user/search/${search}`, {
        withCredentials: true,
      })
      .then((res) => {
        window.location.href = `http://localhost:3000/profile/${res.data.id}`;
      })
      .catch((err) => {
        snackbar.error("유저가 존재하지 않습니다.");
      });
  };

  // var gameLog;
  useEffect(() => {
    var win = 0;
    var total = 0;

    axios
    .all([
      axios.get("http://localhost:5000/user/", { withCredentials: true }),
      axios.get("http://localhost:5000/user/" + id, { withCredentials: true }),
      axios.get("http://localhost:5000/match/user/" + id, { withCredentials: true }),
      axios.get("http://localhost:5000/achievement/" + id, {withCredentials: true}),
    ])
    .then(
      axios.spread((userList, userInfo, matchList, achievementList) => { //achievementList
        setUser(userInfo.data);
        setTopRate(((userInfo.data.ladderLevel) / userList.data.length).toFixed(2).toString());
        setMatchList(matchList.data);
        setAchievedList(achievementList.data);
        matchList.data.map((match: any) => {
          if (match.players[0].userId == userInfo.data.id && match.players[0].isWinner == true ||
              match.players[0].userId != userInfo.data.id && match.players[0].isWinner == false)
            win++;
          total++;
        });

        setWinRatio({win: win, total: total, lose: total - win});
      })
    )
    .catch((err) => {
      window.location.href = "http://localhost:3000/main";
    });

  }, []);

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <SideBar
          title={sidebarProperty.friendList}
          roomId={0}
          modalHandler={modalHandler}
        />
        <div className="profile-wrap">
          <div className="profile-header">
            {user && winRatio ? (
              <div className="profile-info">
                <img
                  className="user-avatar"
                  alt="user-avatar"
                  src={user.avatar}
                />
                <div className="profile-description">
                  <div className="profile-nickname">{user.nickname}</div>
                  <div className="profile-gameInfo">
                    <div className="ladder-rank">
                      Ladder Rank : #{user.ladderLevel} ({topRate}% of top)
                    </div>
                    <div className="ladder-point">
                      Ladder Point : {user.ladderPoint}
                    </div>
                    <div className="win-ratio-title">
                      {winRatio.total}G {winRatio.win}W {winRatio.lose}L
                    </div>
                    <div className="win-ratio">
                      Win ratio{" "}
                      {((winRatio.win / winRatio.total) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="profile-side">
              <div className="profile-searchbar">
                <img
                  className="search-icon"
                  alt="search-icon"
                  src="/icons/searchbar/search.svg"
                />
                <input
                  className="search-nickname"
                  type="text"
                  placeholder={"search"}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={searchUser}
                />
              </div>
              <div className="achievement-list">
                { achievementTitle.map((title, index) => {
                    if (achievedList && achievedList.length != 0 && achievedList.find(achievement => achievement.id == index + 1))
                      return <AchievementItem title={title} isAchieve={true} />
                    else
                      return <AchievementItem title={title} isAchieve={false} />
                  })
                }
              </div>
            </div>
          </div>

          {!matchList || matchList.length == 0 ? (
            <EmptyPageInfo
              description={`전적이 존재하지 않습니다.\n다른 플레이어와 게임을 진행해보세요!`}
            />
          ) : (
            <div className="gameLogList">
              {user &&
                matchList.map((match: any) => {
                  match.targetId = user.id;
                  return <GameLogItem {...match} />;
                })}
            </div>
          )}
        </div>
      </div>
      <GameModalListener modalHandler={modalHandler} />
    </>
  );
}

export default Profile;

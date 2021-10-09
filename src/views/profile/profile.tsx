import axios from "axios";
import { userInfo } from "os";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import AchievementItem from "../../components/achievement/achievement";
import EmptyPageInfo from "../../components/emptyPage/empty";
import Header from "../../components/header/header";
import ModalHandler from "../../components/modal/modalhandler";
import SideBar from "../../components/sideBar/sideBar";
import { sidebarProperty } from "../../components/sideBar/sideBarType";
import snackbar from "../../components/snackbar/snackbar";
import GameLogItem from "./gamelog/item";
import "./profile.scss";

type User = {
  id: number;
  nickname: string;
  intraLogin: string;
  avatar: string;
  status: number;
  ladderPoint: number;
  ladderLevel: number;
}

type Match = {
  id: number;
  gameType: number;
  startAt: Date;
  endAt: Date;
  gameTime: number;
  players: MatchPlayer[];
  targetId: number;
}

type MatchPlayer = {
  match: Match;
  matchId: number;
  user: User;
  userId: number;
  score: number;
  isLeft: boolean;
  isWinner: boolean;
  ladderPoint: number;
  ladderIncrease: number;
}

type MatchRatio = {
  win: number;
  lose: number;
  total: number;
}

function Profile() {
  const modalHandler = ModalHandler();
  const [isEmpty, setIsEmpty] = useState(false);

  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [matchList, setMatchList] = useState<Match[] | null>(null);
  const [achievementInfo, setAchievementInfo] = useState(null);
  const [topRate, setTopRate] = useState<string>("100");

  const [winRatio, setWinRatio] = useState<MatchRatio | null>(null);
  // const matchInfo;
  // const achievementInfo;

  const [search, setSearch] = useState("");

  const searchUser = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter' || search === '')
			return;
    
    //TODO
    //axios.get(server_address/user/{nickname_to_search}) => get id
    //window.location.href = "http://localhost:3000/profile/" + id;
	}

  // var gameLog;
  useEffect(() => {
    var win = 0;
    var total = 0;

    axios
    .all([
      axios.get("http://localhost:5000/user/", { withCredentials: true }),
      axios.get("http://localhost:5000/user/" + id, { withCredentials: true }),
      axios.get("http://localhost:5000/match/user/" + id, { withCredentials: true }),
      //axios.get("http://localhost:5000/achievement/" + id, {withCredentials: true}),
    ])
    .then(
      axios.spread((userList, userInfo, matchList) => { //achievementList

        console.log(`userList : `, userList.data);
        console.log(`userInfo : `, userInfo.data);
        console.log(`matchList : `, matchList.data);
        setUser(userInfo.data);
        setTopRate(((userInfo.data.ladderLevel) / userList.data.length).toFixed(2).toString());
        setMatchList(matchList.data);

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
      // console.log(err);
      // window.location.href = "http://localhost:3000/main";
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
            {user && winRatio ?
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
                    <div className="ladder-point">Ladder Point : {user.ladderPoint}</div>
                    <div className="win-ratio-title">{winRatio.total}G {winRatio.win}W {winRatio.lose}L</div>
                    <div className="win-ratio">Win ratio {(winRatio.win / winRatio.total * 100).toFixed(2)}%</div>
                  </div>
                </div>
              {/* show info from server */}
              </div>
            : ""}

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
                  onChange={e => setSearch(e.target.value)}
                  onKeyPress={searchUser}
                />
              </div>
              <div className="achievement-list">
                {/* TODO : get API & setting*/}
                <AchievementItem title={"승리 10회"} isAchieve={false} />
                <AchievementItem title={"패배 10회"} isAchieve={false} />
                <AchievementItem title={"OTP 등록"} isAchieve={false} />
                <AchievementItem title={"채팅방 첫 접속"} isAchieve={false} />
                <AchievementItem title={"친구 100명 달성"} isAchieve={false} />
              </div>
            </div>
          </div>

          {!matchList || matchList.length == 0 ?
              <EmptyPageInfo
                description={`전적이 존재하지 않습니다.\n다른 플레이어와 게임을 진행해보세요!`}
              />
            :
              <div className="gameLogList">
                {user && matchList.map((match: any) => {
                  match.targetId = user.id;
                  return (<GameLogItem {...match}/>);
                })}
              </div>
          }
        </div>
      </div>
    </>
  );
}

export default Profile;

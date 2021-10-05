import React, { useState } from "react";
import Button from "../../components/button/button";
import EmptyPageInfo from "../../components/emptyPage/empty";
import Header from "../../components/header/header";
import ChatroomCreateModal from "../../components/modal/chatroom/create/chatroomCreateModal";
import SideBar from "../../components/sideBar/sideBar";
import ChatroomItem from "./chatroomItem/item";
import "./main.scss";
import { sidebarProperty } from "../../components/sideBar/sideBarType";
import ModalHandler from "../../components/modal/modalhandler";

enum ChatroomCategory {
  AllChatroomList,
  JoinedChatroomList,
}

function Main() {
  const modalHandler = ModalHandler();
  const [chatroomCategory, setChatroomCategory] = useState(
    ChatroomCategory.AllChatroomList
  );

  const changeChatroomList = (category: ChatroomCategory) => {
    //io.emit : by category
    //io.on   : get Chatrooms object
    return () => {
      setChatroomCategory(category);
    };
  };

  var tempAllChatroomList = [
    {
      roomId: 42,
      title: "Libft 평가자 모십니다",
      memberCount: 42,
      isProtected: true,
    },
  ];

  var tempJoinedChatroomList = [
    {
      roomId: 42,
      title: "트랜센던스 팀원구함",
      memberCount: 42,
      isProtected: false,
    },
  ];

  // to test empty info
  // tempAllChatroomList = [];
  // tempJoinedChatroomList = [];

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <SideBar
          title={sidebarProperty.friendList}
          roomId={1}
          modalHandler={modalHandler}
        />
        <div className="main-wrap">
          <div className="button-list">
            <div className="button-left-side">
              {/* to make a non-focusable element focusable */}
              <div className="focusable-button" tabIndex={1}>
                <Button
                  title="전체 채팅방"
                  onClick={changeChatroomList(ChatroomCategory.AllChatroomList)}
                />
              </div>
              <div className="focusable-button" tabIndex={1}>
                <Button
                  title="참여중인 채팅방"
                  onClick={changeChatroomList(
                    ChatroomCategory.JoinedChatroomList
                  )}
                />
              </div>
            </div>
            <div className="button-right-side">
              <Button title="게임 찾기" onClick={() => {}} />
              <Button
                title="채팅방 만들기"
                onClick={() => modalHandler.handleModalOpen("chatroomCreate")}
              />
            </div>
          </div>

          {chatroomCategory === ChatroomCategory.AllChatroomList &&
          tempAllChatroomList.length === 0 ? (
            <EmptyPageInfo
              description={`공개 채팅방이 존재하지 않습니다.\n'채팅방 만들기' 버튼으로 채팅방을 생성해보세요!`}
            />
          ) : chatroomCategory === ChatroomCategory.JoinedChatroomList &&
            tempJoinedChatroomList.length === 0 ? (
            <EmptyPageInfo
              description={`현재 참여중인 채팅방이 없습니다.\n전체 채팅방 목록에서 참가해보세요!`}
            />
          ) : (
            <div className="chatroom-list">
              {chatroomCategory === ChatroomCategory.AllChatroomList
                ? tempAllChatroomList.map((item) => (
                    <ChatroomItem
                      roomId={item.roomId}
                      title={item.title}
                      memberCount={item.memberCount}
                      isProtected={item.isProtected}
                    />
                  ))
                : tempJoinedChatroomList.map((item) => (
                    <ChatroomItem
                      roomId={item.roomId}
                      title={item.title}
                      memberCount={item.memberCount}
                      isProtected={item.isProtected}
                    />
                  ))}
            </div>
          )}
        </div>
      </div>
      {modalHandler.isModalOpen.chatroomCreate ? (
        <ChatroomCreateModal
          open={modalHandler.isModalOpen.chatroomCreate}
          close={() => modalHandler.handleModalClose("chatroomCreate")}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Main;

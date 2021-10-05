import React, { useState } from "react";
import Button from "../../components/button/button";
import EmptyPageInfo from "../../components/emptyPage/empty";
import Header from "../../components/header/header";
import ChatroomCreateModal from "../../components/modal/chatroom/create/chatroomCreateModal";
import SideBar from "../../components/sideBar/sideBar";
import ChatroomItem, { chatroomItemProps } from "./chatroomItem/item";
import "./main.scss";
import ChatroomDefaultDropdownList from "../../components/dropdown/dropdownList/chatroomDefault";
import ChatroomAdminDropdownList from "../../components/dropdown/dropdownList/chatroomAdmin";
import ChatroomOwnerDropdownList from "../../components/dropdown/dropdownList/chatroomOwner";
import FriendDropdownList from "../../components/dropdown/dropdownList/friend";
import HeaderDropdownList from "../../components/dropdown/dropdownList/header";
import OTPModal from "../../components/modal/otp/otpModal";
import axios from "axios";
import { useEffect } from "react";

enum ChatroomCategory {
  AllChatroomList,
  JoinedChatroomList,
}

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState({
    addFriend: false,
    chatroomInvite: false,
    chatroomCreate: false,
    chatroomSetting: false,
    enterPassword: false,
    otp: false,
  });

  const handleModalOpen = (key: string) => {
    setIsModalOpen({
      ...isModalOpen,
      [key]: true,
    });
  };

  const handleModalClose = (key: string) => {
    setIsModalOpen({
      ...isModalOpen,
      [key]: false,
    });
  };

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

  const [channels, setChannels] = useState<chatroomItemProps[] | null>(null);
  const [myChannels, setMyChannels] = useState<chatroomItemProps[] | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response = await axios.get(`http://localhost:5000/channel`, { withCredentials: true });
				setChannels(response.data);
        response = await axios.get(`http://localhost:5000/channel/me`, { withCredentials: true });
        setMyChannels(response.data);
			}
			catch (e) { console.log(e); }
		};
		fetchData();
	}, []);

  if (!channels) {
		return (
			<div>Loading..</div>
		)
	}
  // to test empty info
  // tempAllChatroomList = [];
  // tempJoinedChatroomList = [];

  return (
    <>
      <Header isLoggedIn={true} />
      {/* <ChatroomOwnerDropdownList/> */}

      {/* <ChatroomDefaultDropdownList/>
      <ChatroomAdminDropdownList/>
      <FriendDropdownList/>
      <HeaderDropdownList/> */}
      <div className="page">
        <SideBar/>
        <div className="content">
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
                onClick={() => handleModalOpen("chatroomCreate")}
              />
            </div>
          </div>

          {(chatroomCategory === ChatroomCategory.AllChatroomList && !channels) 
            ? <EmptyPageInfo description={`공개 채팅방이 존재하지 않습니다.\n'채팅방 만들기' 버튼으로 채팅방을 생성해보세요!`}/>
            : (chatroomCategory === ChatroomCategory.JoinedChatroomList && !myChannels)
              ? <EmptyPageInfo description={`현재 참여중인 채팅방이 없습니다.\n전체 채팅방 목록에서 참가해보세요!`}/> 
              : <div className="chatroom-list">
                  {chatroomCategory === ChatroomCategory.AllChatroomList 
                    ? channels.map(item => (
                        <ChatroomItem 
                        channel = {item} 
                        key = {item.roomId}/>
                      ))
                    // : myChannels.map(item => (
                    //     <ChatroomItem roomId={item.roomId} title={item.title} memberCount={item.memberCount} isProtected={item.isProtected}/>
                    //   ))
                       : myChannels ? myChannels.map(item => (
                          <ChatroomItem 
                          channel = {item} 
                          key = {item.roomId}/>
                        )) : null
                  }
                </div>
          }
        </div>
      </div>
      {isModalOpen.chatroomCreate ? (
        <ChatroomCreateModal
          open={isModalOpen.chatroomCreate}
          close={() => handleModalClose("chatroomCreate")}
        ></ChatroomCreateModal>
      ) : (
        ""
      )}
    </>
  );
}

export default Main;

import React, { useState, useEffect } from "react";
import Button from "../../components/button/button";
import EmptyPageInfo from "../../components/emptyPage/empty";
import Header from "../../components/header/header";
import ChatroomCreateModal from "../../components/modal/chatroom/create/chatroomCreateModal";
import ChatroomItem, { chatroomItemProps } from "./chatroomItem/item";
import "./main.scss";
import ModalHandler from "../../components/modal/modalhandler";
import axios from "axios";
import GameModalListener from "../../components/modal/gameModalListener";
import { io, ioChannel } from "../../socket/socket";
import FriendSidebar from "../../components/sidebar/friendSidebar";
import { modalHandler } from "../../components/sidebar/sidebarType";

enum ChannelCategory {
  ALL_CHANNEL_LIST,
  MY_CHANNEL_LIST,
}

const Main = () => {
  const modalHandler = ModalHandler();
  const [isWaiting, setIsWaiting] = useState(false);
  const modalListener: modalHandler = {
    handleModalClose: modalHandler.handleModalClose,
    handleModalOpen: modalHandler.handleModalOpen,
    isModalOpen: modalHandler.isModalOpen,
    setWaiting: setIsWaiting,
  }

  const [category, setCategory] = useState(
    ChannelCategory.ALL_CHANNEL_LIST
  );

  const handleAddWaiting = () => {
    setIsWaiting(true);
    io.emit('joinQueue');
  }

  const handleRemoveWaiting = () => {
    setIsWaiting(false);
    io.emit('leaveQueue');
  }

  const changeCategory = (category: ChannelCategory) => {
    return () => {
      setCategory(category);
    };
  };

  const [channels, setChannels] = useState<chatroomItemProps[] | null>(null);
  const [myChannels, setMyChannels] = useState<chatroomItemProps[] | null>(null);

  const getAllChannel = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/channel`);
      console.log(`getAllChannels : `, response.data);
      if (response.data.length != 0)
        setChannels(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getMyChannel = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/channel/me`);
      console.log(`getMyChannel : `, response.data);
      if (response.data.length != 0)
        setMyChannels(response.data);
    } catch (error) {
      console.log(error);
    }
  }

	useEffect(() => {
		getAllChannel();
    getMyChannel();
    ioChannel.on('updateChannel', async () => {
      if (category == ChannelCategory.ALL_CHANNEL_LIST)
        getAllChannel();
      else
        getMyChannel();
    })
	}, [category]);


  return (
    <>
      <Header isLoggedIn={true} />
      <div className="page">
        <FriendSidebar
          roomId={0}
          modalHandler={modalHandler}
        />
        <div className="main-wrap">
          <div className="button-list">
            <div className="button-left-side">
              {/* to make a non-focusable element focusable */}
              <div className="focusable-button" tabIndex={1}>
                <Button
                  title="전체 채팅방"
                  onClick={changeCategory(ChannelCategory.ALL_CHANNEL_LIST)}
                />
              </div>
              <div className="focusable-button" tabIndex={1}>
                <Button
                  title="참여중인 채팅방"
                  onClick={changeCategory(ChannelCategory.MY_CHANNEL_LIST)}
                />
              </div>
            </div>
            <div className="button-right-side">
              {
                isWaiting ? <Button title="매칭 취소하기" onClick={handleRemoveWaiting} />
                : <Button title="게임 찾기" onClick={handleAddWaiting} />
              }
              
              <Button
                title="채팅방 만들기"
                onClick={() => modalHandler.handleModalOpen("chatroomCreate")}
              />
            </div>
          </div>

          {(category === ChannelCategory.ALL_CHANNEL_LIST && !channels)
            ? <EmptyPageInfo description={`공개 채팅방이 존재하지 않습니다.\n'채팅방 만들기' 버튼으로 채팅방을 생성해보세요!`}/>
            : (category === ChannelCategory.MY_CHANNEL_LIST && !myChannels)
              ? <EmptyPageInfo description={`현재 참여중인 채팅방이 없습니다.\n전체 채팅방 목록에서 참가해보세요!`}/> 
              : <div className="chatroom-list">
                  {category === ChannelCategory.ALL_CHANNEL_LIST && channels
                    ? channels.map(item => (
                        <ChatroomItem channel = {item} />
                      ))
                       : myChannels ? myChannels.map(item => (
                          <ChatroomItem channel = {item} />
                        )) : null
                  }
                </div>
          }
        </div>
      </div>
      <ChatroomCreateModal
        open={modalHandler.isModalOpen.chatroomCreate}
        close={() => modalHandler.handleModalClose("chatroomCreate")}
      />
      <GameModalListener modalHandler={modalListener}/>
    </>
  );
}

export default Main;

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ioCommunity } from "../../socket/socket";
import { User } from "../../views/profile/profileType";
import NotificationItem from "../dropdown/itemTemplate/notification/item";
import "./dropdown.scss";

//List를 Main에서 불러오면, 리스트 유무에 따른 icon img 변경
//Button을 누르면 Dropdown open.

type DropdownProps = {
  isActive: boolean;
  nicknameLength: number;
  updateIcon: (count: number) => void;
};

enum NotificationType {
  FRIEND = 0,
  CHANNEL,
}

type Notification = {
  id: number;
  senderId: number;
  receiverId: number;
  //채널 초대: channelId
  //친구 요청: senderId
  sender: User;
  targetId: number;
  type: NotificationType;
};

type NotificationItemProp = {
  id: number;
  title: string;
  description: string;
  acceptCallback: (id: number) => void;
  rejectCallback: (id: number) => void;
};

const NotificationOverlay = (prop: DropdownProps) => {
  const [notiList, setNotiList] = useState<NotificationItemProp[]>([]);

  useEffect(() => {
    prop.updateIcon(notiList.length);
  }, [notiList]);

  const getTitleFromNotification = (noti: Notification) => {
    switch (noti.type) {
      case NotificationType.FRIEND:
        return "친구 요청";
      case NotificationType.CHANNEL:
        return "채팅방 초대";
    }
  };

  const getDescriptionFromNotification = (noti: Notification) => {
    switch (noti.type) {
      case NotificationType.FRIEND:
        return `${noti.sender.nickname}님의 친구 요청입니다. 수락하시겠습니까?`;
      case NotificationType.CHANNEL:
        return `${noti.sender.nickname}님의 채팅방 초대 요청입니다. 수락하시겠습니까?`;
    }
  };

  const acceptCallback = async (id: number) => {
    await axios.post(
      `${process.env.REACT_APP_SERVER_ADDRESS}/notification/accept/${id}`,
    );
    //TODO
    //notiList에서 해당 id 찾아서 type이 channel이면 targetid로 redirection
    setNotiList((notiList) => {
      return notiList.filter((noti) => {
        return noti.id != id;
      });
    });

    //Redirect

  };

  const rejectCallback = async (id: number) => {
    await axios.delete(
      `${process.env.REACT_APP_SERVER_ADDRESS}/notification/${id}`,
    );
    setNotiList((notiList) => {
      return notiList.filter((noti) => {
        return noti.id != id;
      });
    });
  };

  const notificationToProps = (noti: Notification) => {
    return {
      id: noti.id,
      title: getTitleFromNotification(noti),
      description: getDescriptionFromNotification(noti),
      acceptCallback: acceptCallback,
      rejectCallback: rejectCallback,
    };
  };

  useEffect(() => {
    fetchNoti(); // notification 목록 불러오기

    // noti 수신
    ioCommunity.on("notificationReceive", async (noti: Notification) => {
      setNotiList((notiList) => [...notiList, notificationToProps(noti)]);
    });
  }, []);

  const fetchNoti = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/notification`, {
        withCredentials: true,
      })
      .then((response) => {
        const newNotiList = response.data.map((noti: Notification) => {
          return notificationToProps(noti);
        });
        setNotiList(newNotiList);
      })
      .catch((e) => {
        console.log(`[fetchNotiList] ${e}`);
      });
  };

  return (
    <div
      className="notification-wrap"
      style={{ right: 40 + 48 + 50 + prop.nicknameLength * 10.9 }}
    >
      <div className={`dropdown ${prop.isActive ? "active" : "inactive"}`}>
        {notiList.map((noti) => (
          <NotificationItem
            key={noti.id}
            title={noti.title}
            description={noti.description}
            acceptCallback={() => {
              acceptCallback(noti.id);
            }}
            rejectCallback={() => {
              rejectCallback(noti.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
export default NotificationOverlay;

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ioCommunity } from "../../socket/socket";
import NotificationItem from "../dropdown/itemTemplate/notification/item";
import "./dropdown.scss";

//List를 Main에서 불러오면, 리스트 유무에 따른 icon img 변경
//Button을 누르면 Dropdown open.

type DropdownProps = {
  isActive: boolean;
  nicknameLength: number;
  updateIcon: () => void;
};

type Notification = {
  key: number;
	title: string;
	description: string;
  acceptCallback: () => void;
	rejectCallback: () => void;
}

enum NotiType {
  Friend = 0,
  Channel
}

function NotificationOverlay(prop: DropdownProps) {
  const [notiList, setNotiList] = useState<Notification[]>([]);
  const key = useRef<number>(0);

  useEffect(() => {
    fetchNoti(); // notification 목록 불러오기

    // 친구 요청 수신
    ioCommunity.on("friendRequestToClient",
    async (id: number, nickname: string) => {
      const nowKey = key.current;
      setNotiList(notiList => [...notiList, {
        key: key.current,
        title: "친구 요청",
        description: `${nickname}님의 친구 요청입니다. 수락하시겠습니까?`,
        acceptCallback: () => {
          prop.updateIcon();
          setNotiList(notiList => notiList.filter(item => item.key !== nowKey));
          ioCommunity.emit("friendAcceptToServer", id);
        },
        rejectCallback: () => {
          prop.updateIcon();
          setNotiList(notiList => notiList.filter(item => item.key !== nowKey));
          ioCommunity.emit("friendRejectToServer", id);
        }
      }])
      key.current += 1;
    });
  }, []);

  const fetchNoti = () => {
    axios.get(
      `${process.env.REACT_APP_SERVER_ADDRESS}/community/notification`,
      { withCredentials: true }
    )
    .then ((response) => {
      response.data.map((noti: any) => {
        const title = noti.type === NotiType.Friend ? "친구 요청" : "채널 초대";
        axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS}/user/${noti.senderID}`,
          { withCredentials: true }
        )
        .then((user) => {
          const nowKey = key.current;
          setNotiList(notiList => [...notiList, {
            key: key.current,
            title: title,
            description: `${user.data.nickname}님의 ${title}입니다. 수락하시겠습니까?`,
            acceptCallback: () => {
              prop.updateIcon();
              setNotiList(notiList => notiList.filter(item => item.key !== nowKey));
              if (noti.type === NotiType.Friend)
                ioCommunity.emit("friendAcceptToServer", noti.senderID);  //TODO 유저 아이디
              //TODO else if (noti.type === NotiType.Channel) 채팅 초대 수락
            },
            rejectCallback: () => {
              prop.updateIcon();
              setNotiList(notiList => notiList.filter(item => item.key !== nowKey));
              if (noti.type === NotiType.Friend)
                ioCommunity.emit("friendRejectToServer", noti.senderID); //TODO 유저 아이디
              //TODO else if (noti.type === NotiType.Channel) 채팅 초대 수락
            }
          }])
        })
        key.current += 1;
      });
    })
    .catch (e => { console.log(`[fetchNotiList] ${e}`) });
  }

  return (
    <div className="notification-wrap" style={{right: (40 + 48 + 50 + prop.nicknameLength * 10.9)}}>
      <div className={`dropdown ${prop.isActive ? "active" : "inactive"}`}>
        {notiList.map(noti => (
          <NotificationItem
            key={noti.key}
            title={noti.title}
            description={noti.description}
            acceptCallback={noti.acceptCallback}
            rejectCallback={noti.rejectCallback}
          />
        ))}
      </div>
    </div>
  );
}
export default NotificationOverlay;

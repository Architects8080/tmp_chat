import React, { useCallback, useEffect, useState } from "react";
import { io } from "../../socket/socket";
import {
  chatroomPermission,
  dropdownMenuInfo,
  sidebarProperty,
  status,
  userItemProps,
} from "./sideBarType";
import UserItem from "./userTemplate/user";

type sidebarItemProps = {
  itemType: sidebarProperty;
  itemInfo: userItemProps;
  contextMenuHandler: any;
  roomId: number; //only chatroomId or 0
  userId: number;
  targetId: number;
  // some more..
};

function SidebarItem(prop: sidebarItemProps) {
  const handleDropdown = (e: React.MouseEvent) => {
    if (e.type === "contextmenu") {
      if (prop.itemType === sidebarProperty.friendList) {
        //userId는 client로 서버에서 체크할 수 있으므로 생략하는게 맞지 않을까?
        io.emit("dropdown/friend", prop.userId, prop.targetId);
      }
      if (prop.itemType === sidebarProperty.chatMemberList) {
        //roomId를 넘겨주는게 맞나..
        //서버에서 그냥 userId가 속한 chatroom을 찾아서 권한을 체크하는게 빠를려나?
        io.emit("dropdown/chatroom", prop.roomId, prop.userId, prop.targetId);
      }

      io.on("dropdownMenuInfo", (dropdownMenuInfo: dropdownMenuInfo) => {
        dropdownMenuInfo.roomId = prop.roomId; //gameroom or chatroom or 0(null)
        dropdownMenuInfo.userId = prop.userId; //이거도 서버에서 리턴..?
        dropdownMenuInfo.targetId = prop.targetId; //이거도 서버에서?
        prop.contextMenuHandler(e, dropdownMenuInfo);
      });

      //서버 연동 전에는 아래 tempInfo의 값들을 바꿔가며 테스트하면 됩니다.
      var tempInfo = {
        roomId: 42,
        userId: 42,
        targetId: prop.targetId,

        // permission: undefined,
        permission: chatroomPermission.owner,

        // Default Menu
        isInGame: false,
        isBlocked: false, //friend

        // chatroom Menu
        isFriend: true,
        isBannable: true, //admin
        isMuted: false, //admin
        isAdmin: false, //owner
      };
      prop.contextMenuHandler(e, tempInfo);
    }
  };

  return (
    <>
      <div onContextMenu={handleDropdown}>
        <UserItem {...prop.itemInfo} />
      </div>
    </>
  );
}

export default SidebarItem;

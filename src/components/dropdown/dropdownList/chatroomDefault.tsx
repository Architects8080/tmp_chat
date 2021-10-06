import React from "react";
import AddFriendItem from "../dropdownItem/chatroom/addFriend";
import InviteGameItem from "../dropdownItem/inviteGame";
import ObserveGameItem from "../dropdownItem/observeGame";
import ViewProfileItem from "../dropdownItem/viewProfile";
import "./dropdownList.scss";
import { dropdownListProps } from "./dropdownListType";

function ChatroomDefaultDropdownList(prop: dropdownListProps) {
  const info = prop.dropdownListInfo;
  const position = { top: prop.anchorPoint.y, left: prop.anchorPoint.x };
  {
    console.log("chatroom default", prop);
  }

  return (
    <div className="dropdown-list-wrap" style={position}>
      <ViewProfileItem targetId={info.targetId} />
      {info.targetId === info.userId ? (
        ""
      ) : (
        <React.Fragment>
          {!info.isFriend ? <AddFriendItem targetId={info.targetId} /> : ""}
          {info.isInGame ? (
            <ObserveGameItem roomId={info.roomId} />
          ) : (
            <InviteGameItem
              targetId={info.targetId}
              modalHandler={prop.modalHandler}
            />
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default ChatroomDefaultDropdownList;

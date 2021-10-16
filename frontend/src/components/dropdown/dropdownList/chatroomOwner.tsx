import React from "react";
import AddFriendItem from "../dropdownItem/chatroom/addFriend";
import BanUserItem from "../dropdownItem/chatroom/admin/ban";
import MuteUserItem from "../dropdownItem/chatroom/admin/mute";
import UnmuteUserItem from "../dropdownItem/chatroom/admin/unmute";
import AddAdminItem from "../dropdownItem/chatroom/owner/addAdmin";
import RemoveAdminItem from "../dropdownItem/chatroom/owner/removeAdmin";
import InviteGameItem from "../dropdownItem/inviteGame";
import ObserveGameItem from "../dropdownItem/observeGame";
import ViewProfileItem from "../dropdownItem/viewProfile";

import "./dropdownList.scss";
import { dropdownListProps } from "./dropdownListType";

function ChatroomOwnerDropdownList(prop: dropdownListProps) {
  const info = prop.dropdownListInfo;
  const position = { top: prop.anchorPoint.y, left: prop.anchorPoint.x };

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

          {/* showing below all dropdown menu because owner's permission is best */}
          {!info.isAdmin ? (
            <AddAdminItem roomId={info.roomId} targetId={info.targetId} />
          ) : (
            <RemoveAdminItem roomId={info.roomId} targetId={info.targetId} />
          )}
          {info.isBannable != undefined && info.isBannable ? (
            <BanUserItem roomId={info.roomId} targetId={info.targetId} />
          ) : (
            ""
          )}
          {info.isMuted != undefined && info.isMuted ? (
            <UnmuteUserItem roomId={info.roomId} targetId={info.targetId} />
          ) : (
            <MuteUserItem roomId={info.roomId} targetId={info.targetId} />
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default ChatroomOwnerDropdownList;

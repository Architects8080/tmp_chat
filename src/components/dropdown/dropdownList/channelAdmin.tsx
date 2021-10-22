import React, { useEffect, useState } from "react";
import AddFriendItem from "../dropdownItem/channel/addFriend";
import BanUserItem from "../dropdownItem/channel/admin/ban";
import MuteUserItem from "../dropdownItem/channel/admin/mute";
import UnmuteUserItem from "../dropdownItem/channel/admin/unmute";
import InviteGameItem from "../dropdownItem/inviteGame";
import ObserveGameItem from "../dropdownItem/observeGame";
import ViewProfileItem from "../dropdownItem/viewProfile";
import "./dropdownList.scss";
import { DropdownListType } from "./dropdownListType";

const ChannelAdminDropdownList = (prop: DropdownListType) => {
  const info = prop.dropdownListInfo;
  const position = { top: prop.anchorPoint.y, left: prop.anchorPoint.x };

  return (
    <div className="dropdown-list-wrap" style={position}>
      <ViewProfileItem targetId={info.targetId} />
      {info.targetId === info.userId ? (
        ""
      ) : (
        <React.Fragment>
          {!info.isFriend ? <AddFriendItem targetId={info.targetId} /> : ""};
          {info.isInGame ? (
            <ObserveGameItem roomId={info.roomId} />
          ) : (
            <InviteGameItem
              targetId={info.targetId}
              modalHandler={prop.modalHandler}
            />
          )}
          {/* showing only other's permission is member */}
          {info.isBannable != undefined && info.isBannable ? (
            <BanUserItem roomId={info.roomId} targetId={info.targetId} />
          ) : (
            ""
          )}
          {/* showing only other's permission is member or admin */}
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

export default ChannelAdminDropdownList;

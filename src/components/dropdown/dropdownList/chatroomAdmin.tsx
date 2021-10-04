import AddFriendItem from "../dropdownItem/chatroom/addFriend";
import BanUserItem from "../dropdownItem/chatroom/admin/ban";
import MuteUserItem from "../dropdownItem/chatroom/admin/mute";
import UnmuteUserItem from "../dropdownItem/chatroom/admin/unmute";
import InviteGameItem from "../dropdownItem/inviteGame";
import ObserveGameItem from "../dropdownItem/observeGame";
import ViewProfileItem from "../dropdownItem/viewProfile";
import "./dropdownList.scss";

function ChatroomAdminDropdownList(anchorPoint: any) { //

  const position = {top: anchorPoint.y, left: anchorPoint.x}
  console.log(anchorPoint);
  return (
    <>
      <div className="dropdown-list-wrap" style={position}>
        <ViewProfileItem />
        <AddFriendItem />
        <InviteGameItem />
        <ObserveGameItem />

        <BanUserItem />
        <MuteUserItem />
        <UnmuteUserItem />
      </div> 
    </>
  );
}

export default ChatroomAdminDropdownList;

import AddFriendItem from "../dropdownItem/chatroom/addFriend";
import BanUserItem from "../dropdownItem/chatroom/admin/ban";
import MuteUserItem from "../dropdownItem/chatroom/admin/mute";
import UnmuteUserItem from "../dropdownItem/chatroom/admin/unmute";
import AddAdminITem from "../dropdownItem/chatroom/owner/addAdmin";
import RemoveAdminItem from "../dropdownItem/chatroom/owner/removeAdmin";
import InviteGameItem from "../dropdownItem/inviteGame";
import ObserveGameItem from "../dropdownItem/observeGame";
import ViewProfileItem from "../dropdownItem/viewProfile";

import './dropdownList.scss';
function ChatroomOwnerDropdownList() {
  return (
    <div className="dropdown-list-wrap">
      <ViewProfileItem/>
      <AddFriendItem/>
      <InviteGameItem/>
      <ObserveGameItem/>

      <AddAdminITem/>
      <RemoveAdminItem/>

      <BanUserItem/>
      <MuteUserItem/>
      <UnmuteUserItem/>
    </div>
  );
}

export default ChatroomOwnerDropdownList;

import AddFriendItem from "../dropdownItem/chatroom/addFriend";
import InviteGameItem from "../dropdownItem/inviteGame";
import ObserveGameItem from "../dropdownItem/observeGame";
import ViewProfileItem from "../dropdownItem/viewProfile";
import "./dropdownList.scss";

function ChatroomDefaultDropdownList() {

  return (
    <>
        <div className="dropdown-list-wrap">
          <ViewProfileItem />
          <AddFriendItem />
          <InviteGameItem />
          <ObserveGameItem />
        </div>
    </>
  );
}

export default ChatroomDefaultDropdownList;

import BlockDMItem from "../dropdownItem/friend/blockDM";
import UnblockDMItem from "../dropdownItem/friend/unblockDM";
import ObserveGameItem from "../dropdownItem/observeGame";
import InviteGameItem from "../dropdownItem/inviteGame";
import ViewProfileItem from "../dropdownItem/viewProfile";
import './dropdownList.scss';


function FriendDropdownList() {
  return (
    <div className="dropdown-list-wrap">
      <ViewProfileItem/>
      <InviteGameItem/>
      <ObserveGameItem/>
      <BlockDMItem/>
      <UnblockDMItem/>
    </div>
  );
}

export default FriendDropdownList;

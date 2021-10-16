import { ioCommunity } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

function DeleteFriendItem(prop: props) {
  const handleDeleteFriend = async () => {
    ioCommunity.emit("relationDeleteToServer", {
      otherID: prop.targetId,
      isFriendly: true
    });
  };

  return (
    <DefaultDropdownItem
      title="친구 끊기"
      color="red"
      callback={handleDeleteFriend}
    />
  );
}

export default DeleteFriendItem;

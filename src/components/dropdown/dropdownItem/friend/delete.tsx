import axios from "axios";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

function DeleteFriendItem(prop: props) {
  const handleDeleteFriend = async () => {
    await axios.delete(
      `${process.env.REACT_APP_SERVER_ADDRESS}/friend/${prop.targetId}`
    );
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

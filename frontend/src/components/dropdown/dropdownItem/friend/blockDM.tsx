import { ioCommunity } from "../../../../socket/socket";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

function BlockDMItem(prop: props) {
  const handleBlockDM = () => {
    ioCommunity.emit("requestToServer", {
      otherID: prop.targetId,
      isFriendly: false
    });
  };

  return (
    <DefaultDropdownItem
      title="DM 차단하기 (Block)"
      color="red"
      callback={handleBlockDM}
    />
  );
}

export default BlockDMItem;

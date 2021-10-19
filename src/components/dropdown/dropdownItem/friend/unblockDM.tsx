import axios from "axios";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type props = {
  targetId: number;
};

function UnblockDMItem(prop: props) {
  const handleUnblockDM = async () => {
    await axios.delete(
      `${process.env.REACT_APP_SERVER_ADDRESS}/block/${prop.targetId}`
    );
  };

  return (
    <DefaultDropdownItem
      title="DM 차단 해제하기"
      color="black"
      callback={handleUnblockDM}
    />
  );
}

export default UnblockDMItem;

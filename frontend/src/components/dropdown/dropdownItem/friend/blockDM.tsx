import axios from "axios";
import DefaultDropdownItem from "../../itemTemplate/default/item";

type ItemProps = {
  targetId: number;
};

const BlockDMItem = (prop: ItemProps) => {
  const handleBlockDM = async () => {
    await axios.post(
      `${process.env.REACT_APP_SERVER_ADDRESS}/block/${prop.targetId}`
    );
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

import React from "react";
import DefaultDropdownItem from "../itemTemplate/default/item";

type props = {
  targetId: number;
};

const ViewProfileItem = (prop: props) => {
  return (
    <>
      <DefaultDropdownItem
        title="프로필 보기"
        color="black"
        callback={() => {
          window.location.href = `${process.env.REACT_APP_CLIENT_ADDRESS}/profile/${prop.targetId}`;
        }}
      />
    </>
  );
}

export default ViewProfileItem;

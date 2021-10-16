import React from "react";
import DefaultDropdownItem from "../itemTemplate/default/item";

type props = {
  targetId: number;
};

function ViewProfileItem(prop: props) {
  return (
    <>
      <DefaultDropdownItem
        title="프로필 보기"
        color="black"
        callback={() => {
          window.location.href =
            "http://localhost:3000/profile/" + prop.targetId;
        }}
      />
    </>
  );
}

export default ViewProfileItem;

import React from 'react';
import DefaultDropdownItem from '../itemTemplate/default/item';

function ViewProfileItem() {
  return (
    <>
      <DefaultDropdownItem title="프로필 보기" color="black" callback={()=>{window.location.href="http://localhost:3000/profile"}}/>
    </>
  );
}

export default ViewProfileItem;

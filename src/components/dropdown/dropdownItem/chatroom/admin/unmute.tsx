import React from 'react';
import DefaultDropdownItem from '../../../itemTemplate/default/item';

function UnmuteUserItem() {
  return (
    <DefaultDropdownItem title="이 방에서 차단 해제하기 (Mute)" color="red" callback={()=>{}}/>
  );
}

export default UnmuteUserItem;

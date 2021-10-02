import React from 'react';
import DefaultDropdownItem from '../../../itemTemplate/default/item';

function MuteUserItem() {
  return (
    <DefaultDropdownItem title="이 방에서 차단하기 (Mute)" color="red" callback={()=>{}}/>
  );
}

export default MuteUserItem;

import React from 'react';
import DefaultDropdownItem from '../../itemTemplate/default/item';

function SettingItem() {
  return (
    <DefaultDropdownItem title="환경 설정" color="black" callback={()=>{window.location.href = "http://localhost:3000/setting"}}/>
  );
}

export default SettingItem;

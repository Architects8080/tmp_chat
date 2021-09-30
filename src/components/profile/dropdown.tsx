import React from 'react';
import './dropdown.scss';
import ProfileMenuItem from './Item/item';

type DropdownProps = {
  isActive: boolean;
};

function ProfileMenu(prop: DropdownProps) {

  return (
    <div className="profile-menu-wrap">
      <div className={`dropdown ${prop.isActive ? 'active' : 'inactive'}`}>
        <ProfileMenuItem title="프로필 보기" onClick={()=>{window.location.href = "http://localhost:3000/profile"}}/>
        <ProfileMenuItem title="환경 설정" onClick={()=>{window.location.href = "http://localhost:3000/setting"}}/>
      </div>
    </div>
  );
}

export default ProfileMenu;

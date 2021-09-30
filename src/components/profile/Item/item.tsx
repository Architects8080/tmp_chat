import React from 'react';
import './item.scss';

type profileMenuItemProps = {
  title: string,
  onClick: any,
};

function ProfileMenuItem(prop: profileMenuItemProps) {
  return (
    <div className="menu" onClick={prop.onClick}>{prop.title}</div>
  );
}

export default ProfileMenuItem;

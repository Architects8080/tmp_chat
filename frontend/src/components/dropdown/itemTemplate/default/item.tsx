import React from "react";
import "./item.scss";

type DefaultDropdownItemProps = {
  title: string;
  color: string;
  callback: any;
};

const DefaultDropdownItem = (prop: DefaultDropdownItemProps) => {
  return (
    <div className="dropdownItem-wrap" onClick={prop.callback}>
      <div className={`dropdownItem-title ${prop.color}`}>{prop.title}</div>
    </div>
  );
}

export default DefaultDropdownItem;

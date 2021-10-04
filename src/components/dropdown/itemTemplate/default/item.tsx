import React from "react";
import "./item.scss";

type dropdownItemTemplateProps = {
  title: string;
  color: string; //??
  callback: any;
};

function DefaultDropdownItem(prop: dropdownItemTemplateProps) {
  return (
    <div className="dropdownItem-wrap" onClick={prop.callback}>
      <div className={`dropdownItem-title ${prop.color}`}>{prop.title}</div>
    </div>
  );
}

export default DefaultDropdownItem;

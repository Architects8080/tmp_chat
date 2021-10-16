import React from "react";
import "./button.scss";

type ButtonProp = {
  title: string;
  onClick: any;
};

function Button(prop: ButtonProp) {
  return (
    <div className="button" onClick={prop.onClick}>
      <div className="button-title">{prop.title}</div>
    </div>
  );
}

export default Button;

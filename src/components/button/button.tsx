import React from "react";
import "./button.scss";

type ButtonProps = {
  title: string;
  onClick: any;
};

const Button = (prop: ButtonProps) => {
  return (
    <div className="button" onClick={prop.onClick}>
      <div className="button-title">{prop.title}</div>
    </div>
  );
}

export default Button;

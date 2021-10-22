import React from "react";
import "./radio.scss";

type RadioButtonProps = {
  name: string;
  label: string;
  value: any;
  isChecked: boolean;
  handleChange: any;
};

const RadioButton = (prop: RadioButtonProps) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.currentTarget;
    prop.handleChange(id); // Send back id to radio group for comparison
  };

  return (
    <div className="radio">
      <input
        type="radio"
        className="custom-radio"
        name={prop.name}
        id={prop.value} // htmlFor targets this id.
        checked={prop.isChecked}
        onChange={handleRadioChange}
      />
      <label htmlFor={prop.value}>
        <span>{prop.label}</span>
      </label>
    </div>
  );
}

export default RadioButton;

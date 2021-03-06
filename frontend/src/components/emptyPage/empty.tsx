import React from "react";
import "./empty.scss";

type EmptyPageInfoProps = {
  description: string;
};

const EmptyPageInfo = (prop: EmptyPageInfoProps) => {
  return (
    <div className="empty-info">
      <img
        className="empty-warning"
        alt="empty-warning"
        src="/icons/emptyPage/warning.svg"
      />
      <pre className="empty-description">{prop.description}</pre>
    </div>
  );
}

export default EmptyPageInfo;

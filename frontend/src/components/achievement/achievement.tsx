import React from "react";
import "./achievement.scss";
import Tooltip from "@mui/material/Tooltip";

type AchievementItemProps = {
  title: string;
  isAchieve: boolean;
};

const AchievementItem = (prop: AchievementItemProps) => {
  return (
    <Tooltip title={prop.title} placement="top">
      <img
        className="achievement-item"
        alt="achievement-item"
        src={
          "/icons/achievement/" + (prop.isAchieve ? "true.svg" : "false.svg")
        }
      />
    </Tooltip>
  );
}

export default AchievementItem;

import React, { useCallback, useEffect, useState } from "react";
import { sidebarProperty, status, userItemProps } from "./sideBarType";
import UserItem from "./userTemplate/user";

type sidebarItemProps = {
  itemType: sidebarProperty;
  itemInfo: userItemProps;
  contextMenuHandler: any;
  // some more..
}

function SidebarItem(prop: sidebarItemProps) {

  const handleDropdown = (e: React.MouseEvent) => {
    if (e.type === "contextmenu") {
      //socket io
      const result = "temp";
      prop.contextMenuHandler(e, result);
    }
  }

  return (
    <>
      <div onContextMenu={handleDropdown}> 
        <UserItem {...prop.itemInfo}/>
      </div>
    </>
  );
}

export default SidebarItem;
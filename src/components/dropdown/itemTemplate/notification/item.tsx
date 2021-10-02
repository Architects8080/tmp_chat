import React from 'react';
import './item.scss';

type notificationItemProp = {
  title: string;
  description: string;
  acceptCallback: any;
  rejectCallback: any;
}

function NotificationItem(prop: notificationItemProp) {
  return (
    <div className="notification-item">
      <div className="notification-item-box">
        <div className="title">{prop.title}</div>
        <div className="description">{prop.description}</div>
      </div>
      <div className="notification-item-button accept">
        <img className="checkbutton" alt="checkbutton" src="/icons/dropdown/checkbutton/accept.svg" onClick={prop.acceptCallback}/>
      </div>
      <div className="notification-item-button reject">
        <img className="checkbutton" alt="checkbutton" src="/icons/dropdown/checkbutton/reject.svg" onClick={prop.rejectCallback}/>
      </div>
    </div>
  );
}

export default NotificationItem;

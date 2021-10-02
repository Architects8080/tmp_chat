import React from 'react';
import './item.scss';

function NotificationItem() {

  const Title = "친구 신청"
  const Explain = "polarbear 님의 친구 신청입니다."
  const handleAcceptEvent = () => {
    console.log(`accept click!!`)
  }

  const handleRejectEvent = () => {
    console.log(`reject click!!`)
  }

  return (
    <div className="notification-item">
      <div className="notification-item-box">
        <div className="title">{Title}</div>
        <div className="explain">{Explain}<br/>수락하시겠습니까?</div>
      </div>
      <div className="notification-item-button accept">
        <img className="checkbutton" alt="checkbutton" src="/icons/dropdown/checkbutton/accept.svg" onClick={handleAcceptEvent}/>
      </div>
      <div className="notification-item-button reject">
        <img className="checkbutton" alt="checkbutton" src="/icons/dropdown/checkbutton/reject.svg" onClick={handleRejectEvent}/>
      </div>
    </div>
  );
}

export default NotificationItem;

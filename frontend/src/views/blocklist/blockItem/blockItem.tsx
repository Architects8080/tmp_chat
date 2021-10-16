import './blockItem.scss';

type prop = {
  avatar: string,
  nickname: string,
}

const BlockItem = ({prop} : {prop: prop}) => {

  const handleUnblockFriend = () => {
    //TODO
  }

  const handleDeleteFriend = () => {
    //TODO
  }

  return (
    <>
      <div className="blockitem">
        <img className="avatar" src={prop.avatar} alt="cannot loaded avatar" />
        <div className="nickname">{prop.nickname}</div>
        <div className="unblock-button" onClick={handleUnblockFriend}>차단 해제하기</div>
        <div className="delete-friend-button" onClick={handleDeleteFriend}>친구 끊기</div>
      </div>
    </>
  )
}

export default BlockItem;
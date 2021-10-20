import axios from 'axios';
import './blockItem.scss';

type prop = {
  id: number,
  avatar: string,
  nickname: string,
  deleteItem: (id: number) => void,
}

const BlockItem = (prop: prop) => {

  const handleUnblockFriend = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_ADDRESS}/block/${prop.id}`);
      prop.deleteItem(prop.id);
    } catch (e) {
      console.log(e);
    }
  }

  const handleDeleteFriend = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_ADDRESS}/friend/${prop.id}`);
    } catch (e) {
      console.log(e);
    }
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
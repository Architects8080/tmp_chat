import axios from "axios";
import { useEffect, useState } from "react";
import EmptyPageInfo from "../../components/emptyPage/empty";
import Header from "../../components/header/header";
import BlockItem from "./blockItem/blockItem";
import './blocklist.scss';

type BlockInfo = {
  avatar: string,
  nickname: string,
}

const BlockList = () => {

  const [blockList, setBlockList] = useState<BlockInfo[]>([]);

  useEffect(() => {
    axios.get(process.env.REACT_ENV_SERVER_ADDRESS + '/blocklist', {withCredentials: true})
    .then(res => {
      setBlockList(res.data);
    })
    .catch(err => {})

    //TEST
    setBlockList([
      {avatar: "https://cdn.intra.42.fr/users/yhan.jpg", nickname: "block_test"},
      {avatar: "https://cdn.intra.42.fr/users/chlee.png", nickname: "test"},
      {avatar: "https://cdn.intra.42.fr/users/ina.jpg", nickname: "ina"},
      {avatar: "https://cdn.intra.42.fr/users/ina.jpg", nickname: "ina"},
      {avatar: "https://cdn.intra.42.fr/users/ina.jpg", nickname: "ina"},
      {avatar: "https://cdn.intra.42.fr/users/ina.jpg", nickname: "ina"},
      {avatar: "https://cdn.intra.42.fr/users/ina.jpg", nickname: "ina"},
    ])
  }, []);

  return (
    <>
      <Header isLoggedIn={true}/>
      <div className="blocklist-page">
        <div className="blocklist-title">차단 목록</div>
        <div className="blocklist">
          {
            blockList.length !== 0 ? blockList.map((item) => {
              return <BlockItem prop={item}/>
            }) 
            : <EmptyPageInfo description="차단한 유저가 없습니다"/>
          }
        </div>
      </div>
    </>
  );
}

export default BlockList;
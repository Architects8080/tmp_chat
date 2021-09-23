import React, { useEffect, useState, useRef } from 'react';
import './sideBar.scss';
import axios from 'axios';
import { useDMwith, User, useSideBarDispatch } from './sideBarContext';
import { DM, useDMDispatch, useDMState } from './dmContext';

const testUser = 69097;

type DMProps = {
	socket: any,
	friend: User,
	closeDM: () => void;
};

function DirectMessage({socket, friend, closeDM}: DMProps) {
	const DMList = useDMState();
	const DMDispatch = useDMDispatch();
	const friendDispatch = useSideBarDispatch();
	const [message, setMessage] = useState<string>('');
	const DMwith = useDMwith();
	const DMRef = useRef<HTMLLIElement | null>(null);

	const testSendMessageToMe = () => {
		const newDM = {
			userID: 2,
			friendID: testUser,
			message: "user2로부터 온 메시지",
		};
		socket.emit('dmToServer', newDM);
		setMessage('');
	}

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

	const fetchDMList = async (userID: number, friendID: number) => {
		try {
			let newDMList: DM[] = [];
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_ADDRESS}/dm?userID=${userID}&friendID=${friendID}`
			);
			response.data.map((dm: any) => newDMList.push({
				id: (dm.isSender) ? dm.userID : dm.friendID,
				message: dm.dm.message
			}));
			DMDispatch({type: "LOAD", DMList: newDMList});
			DMRef.current?.scrollIntoView();
		} catch (e) {
			console.log(`[DMError] ${e}`);
		}
	};
	useEffect(() => { fetchDMList(testUser, friend.id) }, [friend]);

	const sendDM = () => {
		console.log(`send to: ${friend.id}`);
		const newDM = {
			userID: testUser,
			friendID: friend.id,
			message: message,
		};
		socket.emit('dmToServer', newDM);
		setMessage('');
	}

	const receiveDM = (newDM: DM) => {
		if (newDM.id === DMwith.current.id || newDM.id === testUser) {
			DMDispatch({type: "ADD", DM: newDM});
			DMRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
		else
			friendDispatch({type: "ALERT", sender: newDM.id});
	}
	useEffect(() => {
		socket.on('dmToClient', (newDM: DM) => { receiveDM(newDM) });
	}, []);

	return (
		<div className="DM">
			<div className="DM-header">
				<span>DM from @{friend.nickname}</span>
				<button onClick={closeDM}>닫기</button>
			</div>
			<ul>
				{DMList.map(DM => (
				<li ref={DMRef}><span>{DM.id} : </span>{DM.message}</li>
				))}
			</ul>
			<input
			  placeholder="메시지를 입력해주세요"
			  type="text"
			  onChange={onChange}
			  value={message}
			/>
			<button onClick={sendDM}>전송</button>
			<button onClick={testSendMessageToMe}>친구전송</button>
		</div>
	);
}

export default DirectMessage;
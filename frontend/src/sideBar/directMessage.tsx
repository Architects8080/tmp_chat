import React, { useEffect, useState, useRef } from 'react';
import './sideBar.scss';
import axios from 'axios';
import { User } from './sideBarContext';
import { DM, useDMDispatch, useDMRef, useDMState } from './dmContext';

const testUser = 69097;

type DMProps = {
	socket: any,
	friend: User,
	closeDM: () => void;
};

function DirectMessage({socket, friend, closeDM}: DMProps) {
	const DMList = useDMState();
	const DMDispatch = useDMDispatch();
	const [message, setMessage] = useState<string>('');
	let DMRef = useDMRef();

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

	return (
		<div className="DM">
			<div className="DM-header">
				<div className="profile small"></div>
				<h3>{friend.nickname}</h3>
				<button onClick={closeDM}>
					<img src="icons/dm/close.svg"/>
				</button>
			</div>
			<ul>
				{DMList.map(DM => (
					DM.id === testUser ? (
						<li className="dm-message my-dm" ref={DMRef}>
							<div className="dm-user">{DM.id}</div>
							<div className="dm-text">{DM.message}</div>
						</li>
					):(
						<li className="dm-message other-dm" ref={DMRef}>
							<div className="profile small"></div>
							<div>
								<div className="dm-user">{DM.id}</div>
								<div className="dm-text">{DM.message}</div>
							</div>
						</li>
					)
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
import React, { useEffect, useRef, useState } from 'react';
import './sideBar.scss';
import SocketIO from 'socket.io-client';
import { useDMwith, User, useSideBarDispatch, useSideBarState } from './sideBarContext';
import DirectMessage from './directMessage';
import { DM, useDMDispatch, useDMRef } from './dmContext';

const testUser = 69097;

const socket = SocketIO('http://localhost:4500/dm', {
	withCredentials: true,
});

function SideBar() {
	const friends = useSideBarState();
	const friendDispatch = useSideBarDispatch();
	const DMDispatch = useDMDispatch();
	const [DMopen, setDMOpen] = useState<boolean>(false);
	const [friend, setFriend] = useState<User>({id: 0, nickname: '', alert: false});
	const DMwith = useDMwith();
	const DMRef = useDMRef();
	const timerRef = useRef<NodeJS.Timeout>();

	const openDM = (e: React.MouseEvent<HTMLLIElement>) => {
		DMwith.current = friends.filter(user => user.id === e.currentTarget.value)[0];
		setFriend(DMwith.current);
		if (timerRef.current) {
			friendDispatch({type: "READ", sender: DMwith.current.id});
			clearTimeout(timerRef.current);
		}
		if (!DMopen) setDMOpen(true);
	}
	const closeDM = () => setDMOpen(false);

	const receiveDM = (newDM: DM) => {
		if (newDM.id === DMwith.current.id || newDM.id === testUser) {
			DMDispatch({type: "ADD", DM: newDM});
			DMRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
		else {
			friendDispatch({type: "ALERT", sender: newDM.id});
			setTimeout(() => {
				friendDispatch({type: "READ", sender: newDM.id});
			}, 1200);
		}
	}
	useEffect(() => {
		socket.on('dmToClient', (newDM: DM) => { receiveDM(newDM) });
	}, []);

	return (
		<aside>
			<div className="sidebar-header">
				<h3>친구 목록</h3>
				<button><img src="icons/sideBar/invite.svg"/></button>
			</div>
			<ul className="friend-list">
				{friends.map(user => (
					<li value={user.id} onClick={openDM}>
						{user.alert && (
							<span className="alert-overlay"></span>
						)}
						<div className="profile medium"></div>
						<div>{user.nickname}</div>
					</li>
				))}
			</ul>
			{DMopen && (
				<DirectMessage
					socket={socket}
					friend={friend}
					closeDM={closeDM}
				/>
			)}
		</aside>
	);
}

export default SideBar;
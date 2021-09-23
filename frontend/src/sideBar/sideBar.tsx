import React, { useState } from 'react';
import './sideBar.scss';
import SocketIO from 'socket.io-client';
import { useDMwith, User, useSideBarDispatch, useSideBarState } from './sideBarContext';
import DirectMessage from './directMessage';

const socket = SocketIO('http://localhost:4500/dm', {
	withCredentials: true,
});

function SideBar() {
	const friends = useSideBarState();
	const friendDispatch = useSideBarDispatch();
	const [DMopen, setDMOpen] = useState<boolean>(false);
	const [friend, setFriend] = useState<User>({id: 0, nickname: '', alert: false});
	const DMwith = useDMwith();

	const openDM = (e: React.MouseEvent<HTMLLIElement>) => {
		DMwith.current = friends.filter(user => user.id === e.currentTarget.value)[0];
		setFriend(DMwith.current);
		if (DMwith.current.alert)
			friendDispatch({type: "READ", sender: DMwith.current.id});
		if (!DMopen) setDMOpen(true);
	}
	const closeDM = () => setDMOpen(false);

	return (
		<aside>
			<div className="friendList">
				<div>친구 목록</div>
				<ul>
					{friends.map(user => (
						<li value={user.id} onClick={openDM}>
							{user.nickname} {user.alert && (<div id="alert"/>)}
						</li>
					))}
				</ul>
			</div>
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
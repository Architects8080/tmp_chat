import React from 'react';
import './sideBar.scss';


function SideBar() {
	return (
		<aside>
			<div className="friendList">
				<div>친구 목록</div>
				<ul>
					{/* {friends.map(user => (
						<li value={user.id} onClick={openDM}>
							{user.nickname} {user.alert && (<div id="alert"/>)}
						</li>
					))} */}
				</ul>
			</div>
		</aside>
	);
}

export default SideBar;

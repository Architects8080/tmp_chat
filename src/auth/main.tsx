import React, { useEffect, useState } from 'react';
import { io } from './socket';

function Main() {

	// const [isInvite, setIsInvite] = useState(false);

	io.on('invite', (userID, roomID) => {
		console.log(`data : `, userID, roomID);
		//modal on

	});

	io.on('ready', (roomID) => {
		//accept snackbar on
		//redirect
	})

	io.on('cancel', () => {
		//reject snackbar on

	})

	var targetUserID = 1;
	const handleCustomMatch = () => {
		io.emit('invite', [targetUserID])
	}


	return (
		<div>
			<button onClick={handleCustomMatch}>Custom Match</button>
		</div>
	);
}

export default Main;
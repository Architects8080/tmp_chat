import { Snackbar } from '@material-ui/core';
import { useSnackbar, VariantType } from 'notistack';
import React from 'react';
import { useState } from 'react';
import GameSnackbar from '../snackbar/gameSnackbar';
import GameInviteModal from './gameInviteModal';
import GameSettingModal from './gameSettingModal';

// type User = {
// 	nickname: string,
// 	avater: string
// }

type snackbarProp = {
	variant: VariantType,
	message: string,
}

function Game() {

	// snackbar part
	const { enqueueSnackbar } = useSnackbar();
	const acceptMessage = `곧 게임이 시작되니 준비하십시오.`;
	const rejectMessage = `상대방이 게임을 거절했습니다.`;

	const showSnackbar = (prop: snackbarProp) => {
		enqueueSnackbar(prop.message, {
			variant: prop.variant,
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'right',
			},
		})
	}

	const acceptGameInvite = () => {
		showSnackbar({message: acceptMessage, variant: "success"});
	}

	const rejectGameInvite = () => {
		showSnackbar({message: rejectMessage, variant: "error"});
	}

	// modal part
	const [isGameSettingModalOpen, setGameSettingModalOpen] = useState(false);
	const [isGameInviteModalOpen, setGameInviteModalOpen] = useState(false);

	const openGameSettingModal = () => {
		setGameSettingModalOpen(true);
	}

	const closeGameSettingModal = () => {
		setGameSettingModalOpen(false);
	}

	const openGameInviteModal = () => {
		setGameInviteModalOpen(true);
	}

	const closeGameInviteModal = () => {
		setGameInviteModalOpen(false);
	}

	return (
		<React.Fragment>
			<button onClick={openGameSettingModal}>modal open</button>
			<GameSettingModal open={isGameSettingModalOpen} close={closeGameSettingModal}  header="게임 설정">
			</GameSettingModal>

			{/* from Server send */}
			<button onClick={openGameInviteModal}>modal open</button>
			<GameInviteModal open={isGameInviteModalOpen} 
							close={closeGameInviteModal} 
							header="게임 참가" 
							user={{nickname: "chlee", avater: "https://cdn.intra.42.fr/users/small_chlee.png"}}
							accept={acceptGameInvite}
							reject={rejectGameInvite}>
			</GameInviteModal>

			{/* accept / reject check and from sending server result. */}
			{/* message="test" severity="info" */}
			{/* <GameSnackbar /> */}

		</React.Fragment>
	);

}

export default Game;        


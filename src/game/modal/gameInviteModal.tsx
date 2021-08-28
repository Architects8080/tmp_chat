import React from 'react';
import "./modal.css";

type User = {
	nickname: string,
	avater: string,
}

type ModalProps = {
	open: any;
	close: any;
	header: any;
	user: User;
	accept: any,
	reject: any,
	children: React.ReactNode;
}

function GameInviteModal(prop: ModalProps) {
	const handleAccept = () => {
		//server send
		console.log(`${prop.user.nickname}님이 accept 버튼을 눌렀습니다.`);

		//server response
		prop.accept();
		close();
	}

	const handleReject = (event: React.MouseEvent) => {
		// server send
		console.log(`${prop.user.nickname}님이 reject 버튼을 눌렀습니다.`);

		// server response
		prop.reject();
		close();
	}

	return (
		<div className={ prop.open ? 'openModal modal' : 'modal'}>
			{ prop.open ? (
				<section>
					<div className="modal-title">
						{prop.header}
						<button className="modal-close" onClick={close}> X </button>
					</div>

					{/* 1번째 subtitle */}
					{/* from Server get ImageURL*/}
					<div className="modal-content center">
						<div className="image-cropper">
							<img src={prop.user.avater} className="rounded"/> 
						</div>
					</div>

					{/* 2번째 subtitle */}
					{/* from Server get nick */}
					<div className="modal-content center">
						{prop.user.nickname}
					</div>

					{/* 3번째 subtitle */}
					<div className="game-invite">
						{prop.user.nickname}님의 게임 신청이 도착했습니다.<br/><br/>
							게임 신청을 수락하시겠습니까?
					</div>
					<div className="gameInvite-submit">
						<button className="accept" onClick={handleAccept}> 수락</button>
						<button className="reject" onClick={handleReject}> 거절</button>
					</div>
				</section>
			) : null}
		</div>
	);

}

export default GameInviteModal;
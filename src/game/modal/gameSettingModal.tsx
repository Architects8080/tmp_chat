import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import "./modal.css";
import useDetectOutsideClick from './useDetectOutsideClick';

type ModalProps = {
	open: any;
	close: any;
	header: any;
	children: React.ReactNode;
}

// type Submit = {
// 	mapIdx: number;
// 	isObstacle: boolean;
// }

function GameSettingModal(prop: ModalProps) {

	const imgURL: string[] = [
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfA4HU79bnFZF2GXuPt-G-8aW-lA7HtIvWKlrbPdvRqZUsoQSzn_K9II6tX1Xff_5A_Bo&usqp=CAU",
		"https://rembound.com/files/pong-flash-demo.png",
		"https://www.imaginarycloud.com/blog/content/images/2019/02/Pong.jpg",
		"https://raw.githubusercontent.com/godotengine/godot-demo-projects/3.2-57baf0a/2d/pong/screenshots/pong.png"
	];

	const dropdownRef = useRef(null);
	const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
	const [currentImageIdx, setcurrentImageIdx] = useState(0);

	const [isSelect, setIsSelect] = useState(false);
	const [buttonText, setButtonText] = useState("맵 선택");

	var isChecked = false;

	useEffect(() => {
		setButtonText("맵 선택");
		setIsSelect(false);
		setcurrentImageIdx(0);
	}, []);

	const onClick = (label: string) => {
		return (event: React.MouseEvent) => {
			setButtonText(label);
			if (label != "맵 선택")
				setIsSelect(true);
			setIsActive(!isActive);
			event.preventDefault();
		}
	}

	const handlePreviewEvent = (idx: number) => {
		return (event: React.MouseEvent) => {
			setcurrentImageIdx(idx);
			event.preventDefault();
		}
	}

	const handleRollBackEvent = () => {
		if (!isSelect)
			setcurrentImageIdx(0);
	}

	const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
		isChecked = e.target.checked;
		console.log(`isChecked`, isChecked);
	}

	const handleSubmit = (event: React.MouseEvent) => {
		console.log(`user submit!`);
		console.log(`1. map idx ? : `, currentImageIdx);
		console.log(`2. is Obstacle? : `, isChecked);
		// server send
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
					<div className="explain">
						커스텀 게임을 진행하기 전에 맵, 장애물 여부를 선택해주세요.
					</div>
					{/* 1번째 subtitle */}
					<div className="modal-content">
						<div className="title">
							맵 선택 & 미리보기
						</div>
						<img src={imgURL[currentImageIdx]}/> 
					</div>

					{/* 2번째 subtitle */}
					<div className="modal-content">
						<div className="menu-container">
							<button onClick={onClick(buttonText)} className="menu-trigger">
								{buttonText}
							</button>
							<nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
								<ul>
									<li><a href="#" onMouseEnter={handlePreviewEvent(1)} 
													onMouseOut={handleRollBackEvent}
													onClick={onClick("1972 pong")}>1972 pong</a>
									</li>
									<li><a href="#" onMouseEnter={handlePreviewEvent(2)} 
													onMouseOut={handleRollBackEvent}
													onClick={onClick("인채가 만든맵")}>인채가 만든맵</a>
									</li>
									<li><a href="#" onMouseEnter={handlePreviewEvent(3)} 
													onMouseOut={handleRollBackEvent}
													onClick={onClick("chlee가 만든맵")}>chlee가 만든맵</a>
									</li>
								</ul>
							</nav>
						</div>
						{/* {children} */}
					</div>

					{/* 3번째 subtitle */}
					<div className="modal-content">
						<div className="title">
							장애물 여부
						</div>
						<input type="checkbox" id="obstacle" onChange={handleChangeEvent}/>
					</div>
					<div className="gameSettingmodal-submit">
						<button className="close" onClick={handleSubmit}> submit</button>
					</div>
				</section>
			) : null}
		</div>
	);

}

export default GameSettingModal;
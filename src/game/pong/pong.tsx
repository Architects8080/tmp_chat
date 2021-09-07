import React, { KeyboardEvent } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { io } from '../../socket/socket';
import { GameInfo } from '../gameType';
import './pong.css';

type PongProps = {
  roomID: string;
  gameInfo: GameInfo
}

function Pong({roomID, gameInfo}: PongProps) {

  // console.log(`RoomID, `, roomID, `Pong GameInfo : `, gameInfo);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [coord, setcoord] = useState({x: 320, y: 580});
	const [speed, setspeed] = useState({dx: 4, dy: -2});
  const [test, setTest] = useState(0);
	const time = useRef(0);

  const moveUpSpeed = 7;
  const moveDownSpeed = -7;
  const keyDownEvent = useCallback(e => {
    if (e.key === "ArrowUp" || e.key === "w"){
      console.log("keydown arrowUP")
      io.emit("move", [roomID, moveUpSpeed]);
    }
    if (e.key === "ArrowDown" || e.key === "s"){
      io.emit("move", [roomID, moveDownSpeed]);
    }
  }, []);

	const ballRadius = 10;
  const paddleHeight = 75;
  const paddleWidth = 10;

  const [paddleY, setPaddleY] = useState((600 - paddleHeight) / 2);

  // console.log(paddleY);
	useEffect(() => {
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas)
			return;

		const ctx = canvas.getContext("2d");
		if (!ctx)
			return ;

		const timer = setInterval(() => {
			draw();
      setTest(time.current += 1);
    }, 10);

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			setcoord({x: coord.x + speed.dx, y: coord.y + speed.dy});
			drawball();

			if (coord.x + speed.dx > canvas.width-ballRadius || coord.x + speed.dx < ballRadius) {
				speed.dx = -speed.dx ;
			}
			
			if (coord.y + speed.dy > canvas.height-ballRadius || coord.y + speed.dy < ballRadius) {
				speed.dy = -speed.dy;
			}
			// console.log(`x : ${coord.x}, y : ${coord.y}`)
		}

		const drawball = () => {
			ctx.beginPath();
			ctx.arc(gameInfo.ball.x, gameInfo.ball.y, ballRadius, 0, Math.PI*2);
			ctx.fillStyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
		}

    const drawpaddle = () => {
      ctx.beginPath();
      ctx.rect(gameInfo.player1.position.x, gameInfo.player1.position.y, paddleWidth, paddleHeight);
      ctx.rect(gameInfo.player2.position.x, gameInfo.player2.position.y, paddleWidth, paddleHeight);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    drawpaddle();

    window.addEventListener("keydown", keyDownEvent);
		return () => clearInterval(timer);
	}, [test]);

	return (
		<>
			<canvas ref={canvasRef} height={600} width={800} className="canvas"/>
		</>
  );
}

export default Pong;

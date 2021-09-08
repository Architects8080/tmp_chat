import React, { KeyboardEvent } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { io } from "../../socket/socket";
import { GameInfo } from "../gameType";
import "./pong.css";

type PongProps = {
  roomID: string;
  gameInfo: GameInfo;
};

function Pong({ roomID, gameInfo }: PongProps) {
  console.log(`RoomID, `, roomID, `Pong GameInfo : `, gameInfo);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moveUpSpeed = 7;
  const moveDownSpeed = -7;

  const [test, setTest] = useState(0);
  const time = useRef(0);

  const keyDownEvent = useCallback((e) => {
    if (e.key === "ArrowUp" || e.key === "w") {
      io.emit("move", [roomID, moveUpSpeed]);
    }
    if (e.key === "ArrowDown" || e.key === "s") {
      io.emit("move", [roomID, moveDownSpeed]);
    }
  }, []);

  const ballRadius = 10;
  const paddleHeight = 75;
  const paddleWidth = 10;

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const timer = setInterval(() => {
      draw();
      setTest((time.current += 1));
    }, 10);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log(gameInfo.ball.position);
      drawball();
    };

    const drawball = () => {
      ctx.beginPath();
      ctx.arc(
        gameInfo.ball.position.x,
        gameInfo.ball.position.y,
        ballRadius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    };

    const drawpaddle = () => {
      ctx.beginPath();
      ctx.rect(
        gameInfo.player1.position.x,
        gameInfo.player1.position.y,
        paddleWidth,
        paddleHeight
      );
      ctx.rect(
        gameInfo.player2.position.x,
        gameInfo.player2.position.y,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    };

    drawpaddle();

    window.addEventListener("keydown", keyDownEvent);
    return () => clearInterval(timer);
  }, [test]);

  return (
    <>
      <canvas ref={canvasRef} height={600} width={800} className="canvas" />
    </>
  );
}

export default Pong;

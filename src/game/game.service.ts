import { Injectable } from '@nestjs/common';
import { GamePlayer } from './data/game-player.data';
import { GameStatus } from './data/game-status.data';
import { GameInfo } from './data/gameinfo.data';
import { GameRoom } from './data/gameroom.data';
import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
  constructor(private gameRepository: GameRepository) {}

  //default value
  canvasWidth = 800;
  canvasHeight = 600;
  ballRadius = 10;

  paddleWidth = 10;
  paddleHeight = 75;

  private gameLoop(
    room: GameRoom,
    onUpdate: (gameInfo: GameInfo) => any,
    onFinish?,
  ) {
    return () => {
      const ballPosition = room.gameInfo.ball.position;
      const ballVector = room.gameInfo.ball.vector;

      //ball move
      // console.log(room.gameInfo.ball.position);
      if (
        ballPosition.x + ballVector.dx > this.canvasWidth - this.ballRadius ||
        ballPosition.x + ballVector.dx < this.ballRadius
      )
        ballVector.dx = -ballVector.dx;
      if (
        ballPosition.y + ballVector.dy > this.canvasHeight - this.ballRadius ||
        ballPosition.y + ballVector.dy < this.ballRadius
      )
        ballVector.dy = -ballVector.dy;

      room.gameInfo.ball.position = {
        x: ballPosition.x + ballVector.dx,
        y: ballPosition.y + ballVector.dy,
      };

      //paddle collision check
      if (
        ballPosition.x + ballVector.dx <
          room.gameInfo.player1.position.x + this.paddleWidth + 5 &&
        ballPosition.y + ballVector.dy > room.gameInfo.player1.position.y &&
        ballPosition.y + ballVector.dy <
          room.gameInfo.player1.position.y + this.paddleHeight
      )
        ballVector.dx = -ballVector.dx;

      if (
        ballPosition.x + ballVector.dx > room.gameInfo.player2.position.x - 5 &&
        ballPosition.y + ballVector.dy > room.gameInfo.player2.position.y &&
        ballPosition.y + ballVector.dy <
          room.gameInfo.player2.position.y + this.paddleHeight
      )
        ballVector.dx = -ballVector.dx;

      //score check & ball position reset
      if (ballPosition.x <= this.ballRadius + 5) {
        room.gameInfo.player2.score++;
        room.gameInfo.ball.position = {
          x: this.canvasWidth / 2,
          y: this.canvasHeight / 2,
        };
      }
      if (ballPosition.x >= this.canvasWidth - (this.ballRadius + 5)) {
        room.gameInfo.player1.score++;
        room.gameInfo.ball.position = {
          x: this.canvasWidth / 2,
          y: this.canvasHeight / 2,
        };
      }

      onUpdate(room.gameInfo);
      if (room.gameStatus == GameStatus.FINISHED) {
        clearInterval(room.interval);
        onFinish();
        this.gameRepository.saveGameToDB(room.socketRoomId);
        this.gameRepository.deleteGameRoom(room.socketRoomId);
      }
    };
  }

  start(roomId: number, onUpdate: (gameInfo: GameInfo) => any) {
    const gameRoom = this.gameRepository.getGameRoom(roomId);
    const gameInfo = new GameInfo();

    const paddleY = (this.canvasHeight - this.paddleHeight) / 2;

    gameInfo.ball = {
      position: { x: this.canvasWidth / 2, y: this.canvasHeight / 2 },
      vector: { dx: 4, dy: 2 },
    };
    gameInfo.player1 = {
      id: gameRoom.player1.id,
      position: { x: 0 + this.paddleWidth, y: paddleY },
      vector: { dx: 0, dy: 0 },
      score: 0,
    };
    gameInfo.player2 = {
      id: gameRoom.player2.id,
      position: { x: this.canvasWidth - this.paddleWidth * 2, y: paddleY },
      vector: { dx: 0, dy: 0 },
      score: 0,
    };
    gameRoom.gameInfo = gameInfo;
    gameRoom.gameStatus = GameStatus.STARTED;
    gameRoom.interval = setInterval(this.gameLoop(gameRoom, onUpdate), 10);
  }

  private movePlayer(gamePlayer: GamePlayer, moveInfo: any) {
    console.log(gamePlayer.id, 'move!!');
    gamePlayer.position.y += moveInfo;
  }

  move(roomId: number, playerId: number, moveInfo: any) {
    const gameRoom = this.gameRepository.getGameRoom(roomId);

    if (!gameRoom || gameRoom.gameStatus != GameStatus.STARTED) return;
    if (gameRoom.player1.id == playerId)
      this.movePlayer(gameRoom.gameInfo.player1, moveInfo);
    if (gameRoom.player2.id == playerId)
      this.movePlayer(gameRoom.gameInfo.player2, moveInfo);
  }
}

import { Injectable } from '@nestjs/common';
import { GamePlayer } from './data/game-player.data';
import { GameStatus } from './data/game-status.data';
import { GameInfo } from './data/gameinfo.data';
import { GameRoom } from './data/gameroom.data';
import { GameObject } from './data/object.data';
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

  maxPaddleSpeed = 30;

  private resetPosCenter(obj: GameObject) {
    obj.position.x = this.canvasWidth / 2;
    obj.position.y = this.canvasHeight / 2;
  }

  private moveBall(gameInfo: GameInfo) {
    const ballPosition = gameInfo.ball.position;
    const ballVector = gameInfo.ball.vector;

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

    gameInfo.ball.position = {
      x: ballPosition.x + ballVector.dx,
      y: ballPosition.y + ballVector.dy,
    };
    return gameInfo;
  }

  private movePlayer(gameInfo: GameInfo) {
    const move = (player: GamePlayer) => {
      const pos = player.position;
      const vec = player.vector;
      const sign = vec.dy < 0 ? -0.1 : 0.1;

      pos.y += vec.dy;
      if (pos.y + vec.dy < 0) {
        pos.y = 0;
        vec.dy = 0;
      }
      if (pos.y + vec.dy + this.paddleHeight > this.canvasHeight) {
        pos.y = this.canvasHeight - this.paddleHeight;
        vec.dy = 0;
      }
      if (vec.dy != 0) vec.dy -= sign;
    };
    move(gameInfo.player1);
    move(gameInfo.player2);
  }

  private checkCollision(gameInfo: GameInfo) {
    const ballPosition = gameInfo.ball.position;
    const ballVector = gameInfo.ball.vector;
    const player1 = gameInfo.player1;
    const player2 = gameInfo.player2;

    if (
      ballPosition.x + ballVector.dx <
        player1.position.x + this.paddleWidth + 5 &&
      ballPosition.y + ballVector.dy > gameInfo.player1.position.y &&
      ballPosition.y + ballVector.dy < player1.position.y + this.paddleHeight
    )
      ballVector.dx = -ballVector.dx;

    if (
      ballPosition.x + ballVector.dx > player2.position.x - 5 &&
      ballPosition.y + ballVector.dy > player2.position.y &&
      ballPosition.y + ballVector.dy < player2.position.y + this.paddleHeight
    )
      ballVector.dx = -ballVector.dx;
  }

  private checkGoal(gameInfo: GameInfo) {
    const ballPosition = gameInfo.ball.position;
    const player1 = gameInfo.player1;
    const player2 = gameInfo.player2;

    if (ballPosition.x <= this.ballRadius + 5) {
      player2.score++;
      this.resetPosCenter(gameInfo.ball);
    }
    if (ballPosition.x >= this.canvasWidth - (this.ballRadius + 5)) {
      player1.score++;
      this.resetPosCenter(gameInfo.ball);
    }
  }

  isGameFinished(gameInfo: GameInfo) {
    return gameInfo.player1.score > 3 || gameInfo.player2.score > 3;
  }

  private gameLoop(
    room: GameRoom,
    onUpdate: (gameInfo: GameInfo) => any,
    onFinish: (gameInfo: GameInfo) => any,
  ) {
    return async () => {
      const gameInfo = room.gameInfo;

      this.movePlayer(gameInfo);
      this.moveBall(gameInfo);
      this.checkCollision(gameInfo);
      this.checkGoal(gameInfo);
      onUpdate(room.gameInfo);
      if (
        this.isGameFinished(gameInfo) ||
        room.gameStatus == GameStatus.FINISHED
      ) {
        room.gameStatus = GameStatus.FINISHED;
        room.gameInfo.endAt = new Date();
        clearInterval(room.interval);
        await this.gameRepository.saveGameToDB(room.socketRoomId);
        onFinish(room.gameInfo);
        this.gameRepository.deleteGameRoom(room.socketRoomId);
      }
    };
  }

  start(
    roomId: number,
    onUpdate: (gameInfo: GameInfo) => any,
    onFinish: (gameInfo: GameInfo) => any,
  ) {
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
    gameRoom.gameType = 0;
    gameRoom.gameStatus = GameStatus.STARTED;
    gameRoom.interval = setInterval(
      this.gameLoop(gameRoom, onUpdate, onFinish),
      10,
    );
  }

  private forcePlayer(gamePlayer: GamePlayer, moveInfo: any) {
    gamePlayer.vector.dy += moveInfo;
    if (gamePlayer.vector.dy > this.maxPaddleSpeed)
      gamePlayer.vector.dy = this.maxPaddleSpeed;
    if (-gamePlayer.vector.dy > this.maxPaddleSpeed)
      gamePlayer.vector.dy = -this.maxPaddleSpeed;
  }

  move(roomId: number, playerId: number, moveInfo: any) {
    const gameRoom = this.gameRepository.getGameRoom(roomId);

    if (!gameRoom || gameRoom.gameStatus != GameStatus.STARTED) return;
    if (gameRoom.player1.id == playerId)
      this.forcePlayer(gameRoom.gameInfo.player1, moveInfo);
    if (gameRoom.player2.id == playerId)
      this.forcePlayer(gameRoom.gameInfo.player2, moveInfo);
  }
}

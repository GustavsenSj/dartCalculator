import { Component, OnInit } from '@angular/core';
import { GameMode, GameModeService } from 'src/app/services/game-mode.service';
import { Player, PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.css'],
})
export class DartBoardComponent implements OnInit {
  players: Player[] = [];
  throws: number = 0;
  throwScore: number[] = [];
  playerId: number = 1;
  gameSettings!: GameMode;
  totalRoundScore: number = 0;

  constructor(
    private playerService: PlayerService,
    private gameModeService: GameModeService
  ) {}
  ngOnInit() {
    this.playerService.players$.subscribe((players) => {
      this.players = players;
    });
    this.gameModeService.gameMode$.subscribe((gameMode) => {
      this.gameSettings = gameMode;
    });
  }
  getClickedElementID(event: MouseEvent) {
    let score = 0;
    let multiplier = 1;
    const clickedElement = event.target as HTMLElement;
    if (clickedElement instanceof SVGElement) {
      const clickedId = clickedElement.getAttribute('id');
      if (clickedId) {
        if (clickedId.includes('x')) {
          let points = clickedId.slice(0, clickedId.indexOf('x'));
          multiplier = parseInt(
            clickedId.slice(clickedId.indexOf('x') + 1, clickedId.length)
          );
          score = parseInt(points) * multiplier;
        } else {
          score = parseInt(clickedId);
        }
        if (clickedId === 'frame_2') {
          score = 0;
        }
        if (!isNaN(score) && this.throws < 3) {
          console.log(multiplier, 'multiplier');
          // Check if first trow is/needs to be a double or triple
          if (this.playerService.getPlayerById(this.playerId)?.points === 0) {
            if (
              this.gameSettings.doubleIn &&
              !this.playerService.getPlayerById(this.playerId)?.hasDoubleIn
            ) {
              if (multiplier === 2) {
                this.playerService.updatePlayerDoubleIn(this.playerId, true);
              } else {
                score = 0;
              }
            } else if (
              this.gameSettings.tripleIn &&
              !this.playerService.getPlayerById(this.playerId)?.hasTripleIn
            ) {
              if (multiplier === 3) {
                this.playerService.updatePlayerTripleIn(this.playerId, true);
              } else {
                score = 0;
              }
            }
          } else if (
            this.playerService.getPlayerPoints(this.playerId) - score ===
            0
          ) {
            if (
              this.gameSettings.doubleOut &&
              !this.playerService.getPlayerById(this.playerId)?.hasDoubleOut
            ) {
              if (multiplier === 2) {
                this.playerService.updatePlayerDoubleOut(this.playerId, true);
              } else {
                score = 0;
                this.throws = 3;
              }
            } else if (
              this.gameSettings.tripleOut &&
              !this.playerService.getPlayerById(this.playerId)?.hasTripleOut
            ) {
              if (multiplier === 3) {
                this.playerService.updatePlayerTripleOut(this.playerId, true);
              } else {
                score = 0;
                this.throws = 3;
              }
            }
          }
          if (
            this.gameModeService.getPointsToWin() -
              this.playerService.getPlayerPoints(this.playerId) -
              score -
              this.totalRoundScore <
            2
          ) {
            score = 0;
            while (this.throwScore.length < 2) {
              this.throwScore.push(0);
            }

            this.throws = 2;
          } else if (
            this.gameModeService.getPointsToWin() -
              this.playerService.getPlayerPoints(this.playerId) -
              score -
              this.totalRoundScore ===
            0
          ) {
            alert('You won!');
          }

          console.log(this.playerService.getPlayerById(this.playerId));

          this.throwScore[this.throws] = score;
          this.totalRoundScore += score;
          this.throws++;
        }
      }
    }
  }

  updatePlayerScore(pointsToAdd: number) {
    this.playerService.updatePlayerPoints(this.playerId, pointsToAdd);

    if (this.playerId < this.players.length) {
      this.playerId++;
    } else {
      this.playerId = 1;
    }
    this.throwScore = [];
    this.throws = 0;
    this.totalRoundScore = 0;
  }

  redoScoreOf(event: MouseEvent) {
    const clickedElement = (event.target as HTMLElement).closest('[id]');
    if (clickedElement) {
      const clickedId = clickedElement.getAttribute('id');
      if (clickedId) {
        this.throwScore.splice(parseInt(clickedId), 1);
        this.throws--;
      }
    }
  }
  submitScore() {
    const sum = this.throwScore.reduce((total, num) => total + num, 0);
    this.updatePlayerScore(sum);
  }
}

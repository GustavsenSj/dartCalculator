import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameModeService {
  private readonly _gameMode: BehaviorSubject<GameMode> =
    new BehaviorSubject<GameMode>({
      pointsToWin: 501,
      doubleIn: false,
      doubleOut: false,
      tripleIn: false,
      tripleOut: false,
    });
  get gameMode$(): Observable<GameMode> {
    return this._gameMode.asObservable();
  }

  getPointsToWin(): number {
    return this._gameMode.getValue().pointsToWin;
  }

  setPointsToWin(pointsToWin: number): void {
    const currentGameMode = this._gameMode.getValue();
    currentGameMode.pointsToWin = pointsToWin;
    this._gameMode.next(currentGameMode);
  }

  setDoubleIn(doubleIn: boolean): void {
    const currentGameMode = this._gameMode.getValue();
    currentGameMode.doubleIn = doubleIn;
    currentGameMode.tripleIn = !doubleIn;
    this._gameMode.next(currentGameMode);
  }

  setDoubleOut(doubleOut: boolean): void {
    const currentGameMode = this._gameMode.getValue();
    currentGameMode.doubleOut = doubleOut;
    currentGameMode.tripleOut = !doubleOut;
    this._gameMode.next(currentGameMode);
  }

  setTripleIn(tripleIn: boolean): void {
    const currentGameMode = this._gameMode.getValue();
    currentGameMode.tripleIn = tripleIn;
    currentGameMode.doubleIn = !tripleIn;
    this._gameMode.next(currentGameMode);
  }

  setTripleOut(tripleOut: boolean): void {
    const currentGameMode = this._gameMode.getValue();
    currentGameMode.tripleOut = tripleOut;
    currentGameMode.doubleOut = !tripleOut;
    this._gameMode.next(currentGameMode);
  }

  setMode(mode: GameMode): void {
    this._gameMode.next(mode);
  }
}

export type GameMode = {
  pointsToWin: number;
  doubleIn: boolean;
  doubleOut: boolean;
  tripleIn: boolean;
  tripleOut: boolean;
};

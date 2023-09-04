import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly _players$: BehaviorSubject<Player[]> = new BehaviorSubject<
    Player[]
  >([]);

  get players$(): Observable<Player[]> {
    return this._players$.asObservable();
  }

  addPlayer(player: Player): void {
    const currentPlayers = this._players$.getValue();

    currentPlayers.push(player);

    this._players$.next(currentPlayers);
  }
  getPlayerById(id: number): Player | undefined {
    const currentPlayers = this._players$.getValue();

    return currentPlayers.find((player) => player.id === id);
  }
  getPlayerPoints(id: number): number {
    const currentPlayers = this._players$.getValue();
    const player = currentPlayers.find((player) => player.id === id);
    if (player) {
      return player.points;
    } else {
      return 0;
    }
  }

  updatePlayerDoubleIn(id: number, hasHit: boolean) {
    const currentPlayers = this._players$.getValue();
    const playerToUpdate = currentPlayers.find((player) => player.id === id);
    if (playerToUpdate) {
      playerToUpdate.hasDoubleIn = hasHit;
      this._players$.next(currentPlayers);
    }
  }

  updatePlayerDoubleOut(id: number, hasHit: boolean) {
    const currentPlayers = this._players$.getValue();
    const playerToUpdate = currentPlayers.find((player) => player.id === id);
    if (playerToUpdate) {
      playerToUpdate.hasDoubleOut = hasHit;
      this._players$.next(currentPlayers);
    }
  }

  updatePlayerTripleIn(id: number, hasHit: boolean) {
    const currentPlayers = this._players$.getValue();
    const playerToUpdate = currentPlayers.find((player) => player.id === id);
    if (playerToUpdate) {
      playerToUpdate.hasTripleIn = hasHit;
      this._players$.next(currentPlayers);
    }
  }

  updatePlayerTripleOut(id: number, hasHit: boolean) {
    const currentPlayers = this._players$.getValue();
    const playerToUpdate = currentPlayers.find((player) => player.id === id);
    if (playerToUpdate) {
      playerToUpdate.hasTripleOut = hasHit;
      this._players$.next(currentPlayers);
    }
  }

  updatePlayerPoints(id: number, pointsToAdd: number): boolean {
    const currentPlayers = this._players$.getValue();
    const playerToUpdate = currentPlayers.find((player) => player.id === id);

    if (playerToUpdate) {
      // Ensure points are not negative
      if (playerToUpdate.points + pointsToAdd >= 0) {
        playerToUpdate.points += pointsToAdd;
        this._players$.next(currentPlayers);
        return true; // Successful update
      } else {
        return false; // Points would become negative
      }
    } else {
      return false; // Player with given ID not found
    }
  }
}

export type Player = {
  id: number;
  name: String;
  points: number;
  hasDoubleIn: boolean;
  hasDoubleOut: boolean;
  hasTripleIn: boolean;
  hasTripleOut: boolean;
};

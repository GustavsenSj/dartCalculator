import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { GameModeService, GameMode } from 'src/app/services/game-mode.service';
import { PlayerService, Player } from 'src/app/services/player.service';

@Component({
  selector: 'app-dart',
  templateUrl: './dart.page.html',
  styleUrls: ['./dart.page.css'],
})
export class DartPage implements OnInit {
  createdPlayers: boolean = false;
  ready: boolean = false;
  players: Player[] = [];
  newPlayerName: string = '';
  playerId: number = 0;
  gameMode: GameMode = {
    pointsToWin: 501,
    doubleIn: false,
    doubleOut: false,
    tripleIn: false,
    tripleOut: false,
  };
  gameSettingsForm: FormGroup = new FormGroup({});

  constructor(
    private playerService: PlayerService,
    private gameModeService: GameModeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.gameSettingsForm = this.formBuilder.group({
      pointsToWin: [501, Validators.required],
      doubleIn: [false],
      doubleOut: [false],
      tripleIn: [false],
      tripleOut: [false],
    });
    // Add event listeners to checkboxes
    this.gameSettingsForm.get('doubleIn')?.valueChanges.subscribe((value) => {
      if (value) {
        this.gameSettingsForm.get('tripleIn')?.setValue(false);
      }
    });

    this.gameSettingsForm.get('tripleIn')?.valueChanges.subscribe((value) => {
      if (value) {
        this.gameSettingsForm.get('doubleIn')?.setValue(false);
      }
    });

    this.gameSettingsForm.get('doubleOut')?.valueChanges.subscribe((value) => {
      if (value) {
        this.gameSettingsForm.get('tripleOut')?.setValue(false);
      }
    });

    this.gameSettingsForm.get('tripleOut')?.valueChanges.subscribe((value) => {
      if (value) {
        this.gameSettingsForm.get('doubleOut')?.setValue(false);
      }
    });

    this.playerService.players$.subscribe((players) => {
      this.players = players;
    });
    this.gameModeService.gameMode$.subscribe((gameMode) => {
      this.gameMode = gameMode;
    });
  }

  setReady() {
    let gameSettings = this.gameSettingsForm.value;
    this.gameModeService.setMode(gameSettings);
    this.ready = true;
  }

  createPlayer() {
    const newPlayer: Player = {
      id: this.setId(),
      name: this.newPlayerName,
      points: 0,
      hasDoubleIn: false,
      hasDoubleOut: false,
      hasTripleIn: false,
      hasTripleOut: false,
    };

    this.playerService.addPlayer(newPlayer);

    // Reset form fields
    this.newPlayerName = '';
  }

  setId(): number {
    this.playerId++;
    return this.playerId;
  }
  toGameSettings() {
    this.createdPlayers = true;
  }
}

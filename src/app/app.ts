import { Component, OnInit, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Game } from './models/game';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private gameService = inject(GameService);

  games = signal<Game[]>([]);

  game: Game = this.emptyGame();

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe(games => this.games.set(games));
  }

  saveGame(gameForm: NgForm): void {
    if (gameForm.invalid) {
      return;
    }

    // Si el juego tiene id estamos editando (PUT), si no es un alta (POST)
    const request = this.game.id
      ? this.gameService.updateGame(this.game)
      : this.gameService.createGame(this.game);

    request.subscribe(() => {
      this.loadGames();
      this.clearForm(gameForm);
    });
  }

  editGame(game: Game): void {
    this.game = { ...game };
  }

  cancelEdit(gameForm: NgForm): void {
    this.clearForm(gameForm);
  }

  private clearForm(gameForm: NgForm): void {
    this.game = this.emptyGame();
    gameForm.resetForm(this.game);
  }

  private emptyGame(): Game {
    return { title: '', genre: '', platform: '', price: 0, stock: 0 };
  }
}

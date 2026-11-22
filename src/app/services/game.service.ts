import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from '../models/game';

@Injectable({ providedIn: 'root' })
export class GameService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/games';

  getGames() {
    return this.http.get<Game[]>(this.apiUrl);
  }

  createGame(game: Game) {
    return this.http.post<Game>(this.apiUrl, game);
  }

  updateGame(game: Game) {
    return this.http.put<Game>(`${this.apiUrl}/${game.id}`, game);
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Game } from './models/game';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private gameService = inject(GameService);

  games = signal<Game[]>([]);

  // id del juego que se está editando (undefined = alta nueva)
  editingId = signal<number | undefined>(undefined);

  // Mensaje tras guardar (éxito o error de la API)
  message = signal<{ type: 'ok' | 'error'; text: string } | null>(null);

  // El modelo del formulario ahora se declara en TypeScript
  gameForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(40)],
    }),
    genre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    platform: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01), Validators.max(100)],
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(999),
        Validators.pattern(/^\d+$/),
      ],
    }),
  });

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe((games) => this.games.set(games));
  }

  guardar(form: FormGroupDirective): void {
    this.gameForm.markAllAsTouched();

    if (this.gameForm.invalid) {
      return; // no se contacta con JSON Server
    }

    const game: Game = this.gameForm.getRawValue();
    const id = this.editingId();

    // Si hay id estamos editando (PUT), si no es un alta (POST)
    const request = id
      ? this.gameService.updateGame({ ...game, id })
      : this.gameService.createGame(game);

    request.subscribe({
      next: (saved) => {
        this.loadGames();
        this.resetear(form);
        this.message.set({
          type: 'ok',
          text: id ? `"${saved.title}" actualizado.` : `"${saved.title}" creado correctamente.`,
        });
      },
      error: () => {
        // Se conservan los valores y el estado del formulario
        this.message.set({
          type: 'error',
          text: 'No se ha podido guardar. ¿Está arrancada la API con npm run api?',
        });
      },
    });
  }

  editGame(game: Game): void {
    this.editingId.set(game.id);
    this.message.set(null);
    this.gameForm.patchValue(game);
  }

  limpiar(form: FormGroupDirective): void {
    this.resetear(form);
    this.message.set(null);
  }

  private resetear(form: FormGroupDirective): void {
    this.editingId.set(undefined);
    form.resetForm(); // limpia controles y submitted (nonNullable vuelve a los valores iniciales)
  }
}

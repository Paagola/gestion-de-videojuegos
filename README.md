# Gestión de videojuegos

Práctica de Angular con formularios Template-Driven, validación en la plantilla y JSON Server como API.

## Cómo arrancarlo

```bash
npm install
npm run api   # JSON Server en http://localhost:3000/games
npm start     # Angular en http://localhost:4200
```

Hay que tener las dos terminales abiertas a la vez.

## Estructura

```
src/app/
├── models/game.ts           # interfaz Game
├── services/game.service.ts # GET, POST y PUT contra JSON Server
├── app.ts                   # lógica del formulario (guardar, editar, cancelar)
├── app.html                 # formulario, mensajes de validación y listado
└── app.css
db.json                      # datos de la API
```

## Cuestiones finales

**1. ¿Qué proporciona FormsModule?**
Las directivas de los formularios Template-Driven: `ngModel`, `ngForm`, `ngSubmit` y los validadores `required`, `minlength`, `min`, `max`...

**2. ¿Qué función tiene `[(ngModel)]`?**
Hace el two-way data binding: lo que se escribe en el input va al modelo y lo que cambia en el modelo se ve en el input.

**3. ¿Por qué es necesario utilizar `name`?**
Porque `ngForm` registra cada control con su `name`. Sin él, Angular no puede añadir el control al formulario y da error.

**4. ¿Qué representa `#gameForm="ngForm"`?**
Una referencia al formulario completo, con la que podemos consultar su estado (`valid`, `dirty`...) y pasarlo a `saveGame()`.

**5. ¿Qué representa `#title="ngModel"`?**
Una referencia al control del título, para consultar su estado y sus errores.

**6. ¿Qué diferencia existe entre valid e invalid?**
`valid` es true si el campo cumple todas las reglas; `invalid` es true si hay al menos un error. Son lo contrario uno del otro.

**7. ¿Qué diferencia existe entre pristine y dirty?**
`pristine` significa que el usuario no ha cambiado el valor todavía; `dirty` que sí lo ha cambiado.

**8. ¿Qué diferencia existe entre untouched y touched?**
`untouched` significa que el usuario no ha entrado y salido del campo; `touched` que ya ha salido de él (blur).

**9. ¿Qué información contiene errors?**
Un objeto con los errores activos, por ejemplo `{ minlength: { requiredLength: 3, actualLength: 2 } }`. Si no hay errores es `null`.

**10. ¿Por qué utilizamos `invalid && (dirty || touched)` para mostrar errores?**
Para no llenar de errores un formulario recién abierto. Solo los mostramos cuando el campo está mal y el usuario ya ha interactuado con él.

**11. ¿Por qué los mensajes desaparecen automáticamente al corregir un dato?**
Porque al cambiar el valor Angular vuelve a ejecutar los validadores, `errors` cambia y los `@if` de la plantilla se vuelven a evaluar.

**12. ¿Por qué el botón puede habilitarse automáticamente cuando cambia el formulario?**
Porque está enlazado con `[disabled]="gameForm.invalid"`, y ese valor se recalcula cada vez que cambia algún control.

**13. ¿Qué ventaja tiene utilizar ngSubmit frente a escuchar únicamente el click de un botón?**
`ngSubmit` recoge cualquier forma de enviar el formulario (botón o pulsar Enter), marca el formulario como `submitted` y evita que la página se recargue.

**14. ¿Qué operación HTTP se utiliza para crear un videojuego?**
POST `/games`.

**15. ¿Qué operación se utiliza para actualizarlo?**
PUT `/games/:id`.

**16. ¿Por qué utilizamos `gameForm.resetForm()` después de guardar?**
Porque vaciar solo el objeto no devuelve los controles a `pristine` y `untouched`, y seguirían saliendo los mensajes de error. `resetForm()` limpia los valores y también el estado.

**17. ¿Qué diferencia existe entre la validación reactiva de esta actividad y los Reactive Forms?**
Aquí "reactiva" quiere decir que la interfaz reacciona sola al estado del formulario, pero el formulario se define en el HTML con `ngModel`. En Reactive Forms el formulario se define en TypeScript con `FormGroup`, `FormControl` y `Validators`.

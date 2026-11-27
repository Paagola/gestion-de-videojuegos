# Gestión de videojuegos

Práctica de Angular con JSON Server como API.

- Rama `main`: versión original con formularios Template-Driven (`FormsModule`, `ngModel`, `ngForm`).
- Rama `refactor/reactive-forms`: el mismo formulario migrado a Reactive Forms (`ReactiveFormsModule`, `FormGroup`, `FormControl`, `Validators`).

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
├── app.ts                   # FormGroup del formulario y lógica (guardar, editar, limpiar)
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

## Migración a Reactive Forms

| Antes (template-driven)          | Ahora (reactive)                                 |
| -------------------------------- | ------------------------------------------------ |
| `[(ngModel)]="game.title"`       | `formControlName="title"`                        |
| `#gameForm="ngForm"`             | `[formGroup]="gameForm"` + `#form="ngForm"`      |
| `title.invalid` (`#title="ngModel"`) | `gameForm.controls.title.invalid`            |
| `required`, `minlength` en el HTML | `Validators` en TypeScript                     |
| `saveGame(gameForm: NgForm)`     | `guardar(form: FormGroupDirective)`              |

- Los errores se muestran con `invalid && (touched || form.submitted)`, así salen al salir del campo o al pulsar Guardar.
- El botón Guardar ya no se desactiva: si el formulario es inválido, `guardar()` hace `return` y no se manda ninguna petición.
- Después de un POST/PUT correcto se llama a `form.resetForm()`, que vuelve a los valores iniciales (por `nonNullable`) y pone `submitted` a `false`. Si la petición falla, se conservan los datos.
- `GameService` y la interfaz `Game` no se han tocado.

### Despliegue en Vercel

- Build Command: `npm run build`
- Output Directory: `dist/gestion-videojuegos/browser`
- No se usa Router, así que no hace falta `vercel.json`.
- En la URL de Vercel el formulario y las validaciones funcionan, pero guardar falla porque la API está en `localhost:3000`, que es el ordenador del alumno y no un servidor público. El POST se comprueba en local.

### Autoevaluación

**¿Dónde se encuentra ahora la fuente de verdad de los valores del formulario?**
En el `FormGroup` `gameForm` del componente (TypeScript). Antes estaba en el objeto `game` enlazado con `ngModel`; ahora los valores se leen con `gameForm.getRawValue()`.

**¿Por qué formControlName no necesita `[(ngModel)]`?**
Porque el control ya existe en el `FormGroup`. `formControlName` busca el `FormControl` con ese nombre dentro del `[formGroup]` y lo conecta con el input en los dos sentidos, así que no hace falta un objeto aparte ni el atributo `name`.

**¿Qué diferencia hay entre invalid, touched y dirty?**
`invalid` es que el valor no cumple alguna validación; `touched` es que el usuario ha entrado y salido del campo; `dirty` es que el usuario ha cambiado el valor. Uno habla de las reglas y los otros dos de la interacción del usuario.

**¿Qué aportan Git, la Pull Request y el despliegue Preview antes de fusionar main?**
La rama permite hacer el cambio sin romper la versión de `main`. La Pull Request deja ver todos los cambios juntos y revisarlos antes de fusionar. El Preview de Vercel permite probar la versión nueva en una URL real mientras producción sigue con `main`.

import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../core/services/pokemon.service';
import { TipoService } from '../../core/services/tipo.service';
import { Tipo } from '../../core/models/models';

@Component({
  selector: 'app-pokemon-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">

      <div class="page-header">
        <a routerLink="/tipos" class="btn">← Volver</a>
        <h1>{{ esEdicion() ? 'Editar Pokémon' : 'Nuevo Pokémon' }}</h1>
      </div>

      <div class="form-card card">

        <!-- Mensaje éxito -->
        @if (mensajeExito()) {
          <div class="alert-success">✅ {{ mensajeExito() }}</div>
        }

        <!-- Mensaje error -->
        @if (mensajeError()) {
          <div class="alert-error">⚠️ {{ mensajeError() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <!-- Nombre -->
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input
              id="nombre"
              class="form-control"
              type="text"
              formControlName="nombre"
              placeholder="Ej: Pikachu"
            />
            @if (f['nombre'].invalid && f['nombre'].touched) {
              <span class="error-msg">
                @if (f['nombre'].errors?.['required']) { El nombre es obligatorio. }
                @if (f['nombre'].errors?.['minlength']) { Mínimo 2 caracteres. }
                @if (f['nombre'].errors?.['maxlength']) { Máximo 50 caracteres. }
              </span>
            }
          </div>

          <!-- Número Pokédex -->
          <div class="form-group">
            <label for="numero">Número Pokédex *</label>
            <input
              id="numero"
              class="form-control"
              type="number"
              formControlName="numero"
              placeholder="Ej: 25"
              min="1"
              max="9999"
            />
            @if (f['numero'].invalid && f['numero'].touched) {
              <span class="error-msg">
                @if (f['numero'].errors?.['required']) { El número es obligatorio. }
                @if (f['numero'].errors?.['min']) { Debe ser mayor que 0. }
                @if (f['numero'].errors?.['max']) { Máximo 9999. }
              </span>
            }
          </div>

          <!-- Tipo -->
          <div class="form-group">
            <label for="tipoId">Tipo *</label>
            <select id="tipoId" class="form-control" formControlName="tipoId">
              <option value="">-- Selecciona un tipo --</option>
              @for (tipo of tipos(); track tipo.id) {
                <option [value]="tipo.id">{{ tipo.nombre }}</option>
              }
            </select>
            @if (f['tipoId'].invalid && f['tipoId'].touched) {
              <span class="error-msg">Debes seleccionar un tipo.</span>
            }
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label for="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              class="form-control"
              formControlName="descripcion"
              placeholder="Descripción breve del Pokémon..."
              rows="3"
            ></textarea>
            @if (f['descripcion'].invalid && f['descripcion'].touched) {
              <span class="error-msg">
                @if (f['descripcion'].errors?.['required']) { La descripción es obligatoria. }
                @if (f['descripcion'].errors?.['maxlength']) { Máximo 300 caracteres. }
              </span>
            }
          </div>

          <!-- URL Imagen -->
          <div class="form-group">
            <label for="imagenUrl">URL imagen <span class="text-hint">(opcional)</span></label>
            <input
              id="imagenUrl"
              class="form-control"
              type="text"
              formControlName="imagenUrl"
              placeholder="https://... o déjalo vacío para usar sprite automático"
            />
            <span class="field-hint">
              Si lo dejas vacío se usará el sprite oficial de PokeAPI según el número.
            </span>
          </div>

          <!-- Preview imagen -->
          @if (previewUrl()) {
            <div class="img-preview">
              <img [src]="previewUrl()!" alt="Preview" (error)="previewUrl.set(null)" />
              <span class="text-hint" style="font-size:12px;">Preview</span>
            </div>
          }

          <!-- Botones -->
          <div class="form-actions">
            <a routerLink="/tipos" class="btn">Cancelar</a>
            <button
              type="submit"
              class="btn btn-accent"
              [disabled]="form.invalid || enviando()"
            >
              {{ enviando() ? 'Guardando...' : (esEdicion() ? 'Guardar cambios' : 'Crear Pokémon') }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-card {
      max-width: 560px;
    }

    .alert-success {
      background: #1b3a1b;
      border: 1px solid #2e7d32;
      border-radius: var(--radius-md);
      color: #a5d6a7;
      padding: 12px 16px;
      margin-bottom: 1.25rem;
    }

    .alert-error {
      background: #4a1010;
      border: 1px solid #7a2020;
      border-radius: var(--radius-md);
      color: #ff8a80;
      padding: 12px 16px;
      margin-bottom: 1.25rem;
    }

    .field-hint {
      font-size: 12px;
      color: var(--color-hint);
      margin-top: 3px;
    }

    .img-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      margin-bottom: 1rem;
      padding: 12px;
      background: var(--color-surface2);
      border: 1px solid var(--color-border2);
      border-radius: var(--radius-md);
      width: fit-content;
    }

    .img-preview img {
      width: 80px;
      height: 80px;
      object-fit: contain;
      image-rendering: pixelated;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }

    button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    select.form-control {
      cursor: pointer;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }
  `]
})
export class PokemonFormComponent implements OnInit {
  private fb             = inject(FormBuilder);
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private pokemonService = inject(PokemonService);
  private tipoService    = inject(TipoService);

  // === Signals ===
  tipos        = signal<Tipo[]>([]);
  enviando     = signal(false);
  esEdicion    = signal(false);
  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);
  previewUrl   = signal<string | null>(null);

  pokemonId: number | null = null;

  // === Formulario reactivo ===
  form = this.fb.group({
    nombre:      ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    numero:      [null as number | null, [Validators.required, Validators.min(1), Validators.max(9999)]],
    tipoId:      ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    imagenUrl:   ['']
  });

  // Getter para acceder fácilmente a los controles en el template
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.cargarTipos();
    this.escucharCambioImagen();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion.set(true);
      this.pokemonId = Number(id);
      this.cargarPokemon(this.pokemonId);
    }
  }

  cargarTipos(): void {
    this.tipoService.getAll().subscribe({
      next: (data) => this.tipos.set(data),
      error: () => this.mensajeError.set('No se pudieron cargar los tipos.')
    });
  }

  cargarPokemon(id: number): void {
    this.pokemonService.getById(id).subscribe({
      next: (poke) => {
        this.form.patchValue({
          nombre:      poke.nombre,
          numero:      poke.numero,
          tipoId:      String(poke.tipoId),
          descripcion: poke.descripcion,
          imagenUrl:   poke.imagenUrl || ''
        });
      },
      error: () => this.mensajeError.set('No se pudo cargar el Pokémon.')
    });
  }

  escucharCambioImagen(): void {
    this.form.get('imagenUrl')!.valueChanges.subscribe(url => {
      this.previewUrl.set(url && url.trim().length > 0 ? url : null);
    });
    this.form.get('numero')!.valueChanges.subscribe(num => {
      const url = this.form.get('imagenUrl')!.value;
      if (!url && num) {
        this.previewUrl.set(
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${num}.png`
        );
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.mensajeExito.set(null);
    this.mensajeError.set(null);

    const payload = {
      nombre:      this.form.value.nombre!,
      numero:      this.form.value.numero!,
      tipoId:      Number(this.form.value.tipoId),
      descripcion: this.form.value.descripcion!,
      imagenUrl:   this.form.value.imagenUrl || ''
    };

    const peticion = this.esEdicion()
      ? this.pokemonService.update(this.pokemonId!, payload)
      : this.pokemonService.create(payload);

    peticion.subscribe({
      next: (poke) => {
        this.enviando.set(false);
        this.mensajeExito.set(
          this.esEdicion()
            ? `¡${poke.nombre} actualizado correctamente!`
            : `¡${poke.nombre} creado correctamente!`
        );
        setTimeout(() => this.router.navigate(['/tipos', payload.tipoId]), 1500);
      },
      error: () => {
        this.enviando.set(false);
        this.mensajeError.set('Error al guardar. Comprueba que el backend está activo.');
      }
    });
  }
}

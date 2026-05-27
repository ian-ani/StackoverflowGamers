import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonPayload, Tipo } from '../../core/models/models';
import { PokemonService } from '../../core/services/pokemon.service';
import { TipoService } from '../../core/services/tipo.service';

@Component({
  selector: 'app-pokemon-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">{{ editMode() ? 'Editar registro' : 'Nuevo registro' }}</p>
          <h1>{{ editMode() ? 'Editar Pokemon' : 'Crear Pokemon' }}</h1>
          <p class="lead">Formulario reactivo con validaciones y guardado mediante la API REST de Spring Boot.</p>
        </div>
        <a routerLink="/tipos" class="btn">Volver</a>
      </div>

      <section class="form-layout">
        <form class="panel form-panel" [formGroup]="form" (ngSubmit)="submit()">
          @if (success()) {
            <div class="notice success">{{ success() }}</div>
          }

          @if (error()) {
            <div class="notice error">{{ error() }}</div>
          }

          <div class="form-grid two-cols">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input id="name" class="field" type="text" formControlName="name" placeholder="Charmander" />
              @if (invalid('name')) {
                <span class="error-msg">El nombre es obligatorio y debe tener entre 2 y 50 caracteres.</span>
              }
            </div>

            <div class="form-group">
              <label for="typeId">Tipo</label>
              <select id="typeId" class="field" formControlName="typeId">
                <option [ngValue]="null">Selecciona un tipo</option>
                @for (type of types(); track type.id) {
                  <option [ngValue]="type.id">{{ type.name }}</option>
                }
              </select>
              @if (invalid('typeId')) {
                <span class="error-msg">Debes elegir un tipo.</span>
              }
            </div>

            <div class="form-group">
              <label for="gen">Generacion</label>
              <input id="gen" class="field" type="number" formControlName="gen" min="1" max="9" />
              @if (invalid('gen')) {
                <span class="error-msg">Indica una generacion entre 1 y 9.</span>
              }
            </div>

            <div class="form-group">
              <label for="evolutionLevel">Nivel evolutivo</label>
              <input id="evolutionLevel" class="field" type="number" formControlName="evolutionLevel" min="1" max="3" />
              @if (invalid('evolutionLevel')) {
                <span class="error-msg">Usa un valor entre 1 y 3.</span>
              }
            </div>
          </div>

          <div class="stat-fields">
            <div class="form-group">
              <label for="basePs">PS base</label>
              <input id="basePs" class="field" type="number" formControlName="basePs" min="1" max="255" />
              @if (invalid('basePs')) {
                <span class="error-msg">Valor entre 1 y 255.</span>
              }
            </div>

            <div class="form-group">
              <label for="baseAtk">Ataque base</label>
              <input id="baseAtk" class="field" type="number" formControlName="baseAtk" min="1" max="255" />
              @if (invalid('baseAtk')) {
                <span class="error-msg">Valor entre 1 y 255.</span>
              }
            </div>

            <div class="form-group">
              <label for="baseDef">Defensa base</label>
              <input id="baseDef" class="field" type="number" formControlName="baseDef" min="1" max="255" />
              @if (invalid('baseDef')) {
                <span class="error-msg">Valor entre 1 y 255.</span>
              }
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/tipos" class="btn">Cancelar</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving()">
              {{ saving() ? 'Guardando...' : (editMode() ? 'Guardar cambios' : 'Crear Pokemon') }}
            </button>
          </div>
        </form>

        <aside class="panel preview">
          <p class="eyebrow">Vista previa</p>
          <div class="sprite-stage">
            <img [src]="previewSprite()" [alt]="previewName()" (error)="hideBrokenImage($event)" />
          </div>
          <h2>{{ previewName() }}</h2>
          <span class="type-chip">{{ selectedType()?.name || 'Sin tipo' }}</span>
          <div class="preview-stats">
            <span><strong>{{ form.controls.basePs.value || 0 }}</strong> PS</span>
            <span><strong>{{ form.controls.baseAtk.value || 0 }}</strong> ATK</span>
            <span><strong>{{ form.controls.baseDef.value || 0 }}</strong> DEF</span>
          </div>
        </aside>
      </section>
    </main>
  `,
  styles: [`
    .form-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 20px;
      align-items: start;
    }

    .form-panel,
    .preview {
      padding: 22px;
    }

    .two-cols {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-bottom: 16px;
    }

    .stat-fields {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .notice {
      border-radius: var(--radius);
      padding: 12px 14px;
      margin-bottom: 16px;
      font-weight: 800;
    }

    .notice.success {
      background: #eff9ed;
      border: 2px solid #8cc56f;
      color: #2f6a1f;
    }

    .notice.error {
      background: #fff5f3;
      border: 2px solid #ffb4a8;
      color: #9d2414;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      border-top: 1px solid var(--line);
      margin-top: 22px;
      padding-top: 18px;
    }

    .preview {
      position: sticky;
      top: 96px;
      text-align: center;
    }

    .sprite-stage {
      min-height: 210px;
      display: grid;
      place-items: center;
      border-radius: var(--radius);
      background:
        radial-gradient(circle, rgba(255, 255, 255, 0.85) 0 35%, transparent 36%),
        linear-gradient(135deg, #e8edf2, #f9fafb);
      margin: 14px 0;
    }

    .sprite-stage img {
      width: 138px;
      height: 138px;
      object-fit: contain;
      image-rendering: pixelated;
    }

    .preview h2 {
      margin-bottom: 8px;
      text-transform: capitalize;
    }

    .type-chip {
      display: inline-flex;
      border-radius: 999px;
      background: var(--brand-blue);
      color: #fff;
      padding: 5px 12px;
      font-size: 0.85rem;
      font-weight: 900;
    }

    .preview-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 16px;
    }

    .preview-stats span {
      border-radius: var(--radius);
      background: var(--surface-soft);
      padding: 9px 6px;
      color: var(--muted);
      font-size: 0.78rem;
      font-weight: 800;
    }

    .preview-stats strong {
      display: block;
      color: var(--text);
      font-size: 1rem;
    }

    @media (max-width: 880px) {
      .form-layout {
        grid-template-columns: 1fr;
      }

      .preview {
        position: static;
      }
    }

    @media (max-width: 620px) {
      .two-cols,
      .stat-fields {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PokemonFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);
  private readonly tipoService = inject(TipoService);

  readonly types = signal<Tipo[]>([]);
  readonly saving = signal(false);
  readonly editMode = signal(false);
  readonly success = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly selectedType = computed(() => {
    const typeId = this.form.controls.typeId.value;
    return this.types().find(type => type.id === typeId) ?? null;
  });

  pokemonId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    typeId: [null as number | null, Validators.required],
    gen: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
    evolutionLevel: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
    basePs: [45, [Validators.required, Validators.min(1), Validators.max(255)]],
    baseAtk: [49, [Validators.required, Validators.min(1), Validators.max(255)]],
    baseDef: [49, [Validators.required, Validators.min(1), Validators.max(255)]]
  });

  ngOnInit(): void {
    this.loadTypes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode.set(true);
      this.pokemonId = Number(id);
      this.loadPokemon(this.pokemonId);
    }
  }

  invalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  loadTypes(): void {
    this.tipoService.getAll().subscribe({
      next: types => this.types.set(types),
      error: () => this.error.set('No se pudieron cargar los tipos.')
    });
  }

  loadPokemon(id: number): void {
    this.pokemonService.getById(id).subscribe({
      next: pokemon => {
        this.form.patchValue({
          name: pokemon.name,
          typeId: pokemon.type.id,
          gen: pokemon.gen,
          evolutionLevel: pokemon.evolutionLevel,
          basePs: pokemon.basePs,
          baseAtk: pokemon.baseAtk,
          baseDef: pokemon.baseDef
        });
      },
      error: () => this.error.set('No se pudo cargar el Pokemon.')
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const selectedType = this.types().find(type => type.id === value.typeId)!;
    const payload: PokemonPayload = {
      name: value.name,
      evolutionLevel: value.evolutionLevel,
      baseAtk: value.baseAtk,
      baseDef: value.baseDef,
      basePs: value.basePs,
      gen: value.gen,
      type: selectedType
    };

    this.saving.set(true);
    this.success.set(null);
    this.error.set(null);

    const request = this.editMode()
      ? this.pokemonService.update(this.pokemonId!, payload)
      : this.pokemonService.create(payload);

    request.subscribe({
      next: pokemon => {
        this.saving.set(false);
        this.success.set(`${pokemon.name} se ha guardado correctamente.`);
        setTimeout(() => this.router.navigate(['/tipos', payload.type.id]), 900);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudo guardar. Comprueba que el backend esta activo y que los datos son validos.');
      }
    });
  }

  previewName(): string {
    return this.form.controls.name.value || 'Pokemon';
  }

  previewSprite(): string {
    const known: Record<string, number> = {
      bulbasaur: 1,
      ivysaur: 2,
      venusaur: 3,
      charmander: 4,
      charmeleon: 5,
      charizard: 6,
      squirtle: 7,
      wartortle: 8,
      blastoise: 9
    };
    const key = this.previewName().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${known[key] ?? 25}.png`;
  }

  hideBrokenImage(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}

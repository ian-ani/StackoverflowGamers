import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { Pokemon, Tipo } from '../../core/models/models';
import { PokemonService } from '../../core/services/pokemon.service';
import { TipoService } from '../../core/services/tipo.service';

const SPRITE_BY_NAME: Record<string, number> = {
  charmander: 4,
  charmeleon: 5,
  charizard: 6,
  squirtle: 7,
  wartortle: 8,
  blastoise: 9,
  bulbasaur: 1,
  ivysaur: 2,
  venusaur: 3
};

@Component({
  selector: 'app-tipo-detalle',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <main class="detail-page" [style.--type-color]="type() ? getTypeColor(type()!) : '#607d8b'">
      <div class="page-shell detail-content">
        <a routerLink="/tipos" class="btn back-link">Volver a tipos</a>

        @if (loading()) {
          <div class="panel loading-state">Cargando datos del tipo...</div>
        } @else if (error()) {
          <div class="panel error-state">{{ error() }}</div>
        } @else if (type()) {
          <section class="type-hero">
            <div>
              <p class="eyebrow">Habitat de tipo</p>
              <h1>{{ type()!.name }}</h1>
              <div class="matchups">
                <span class="pill">Fuerte contra {{ type()!.effectiveType }}</span>
                <span class="pill">Debil ante {{ type()!.weakType }}</span>
              </div>
            </div>
            <div class="hero-count">
              <strong>{{ filteredPokemons().length }}</strong>
              <span>Pokemon</span>
            </div>
          </section>

          <section class="toolbar panel">
            <label class="search" aria-label="Buscar Pokemon">
              <input
                class="field"
                type="search"
                placeholder="Buscar Pokemon..."
                [value]="search()"
                (input)="setSearch($event)"
              />
            </label>

            <div class="sort-group" aria-label="Ordenar Pokemon">
              <button type="button" class="btn" [class.btn-yellow]="sort() === 'numero'" (click)="sort.set('numero')">
                Numero
              </button>
              <button type="button" class="btn" [class.btn-yellow]="sort() === 'nombre'" (click)="sort.set('nombre')">
                Nombre
              </button>
            </div>

            <a routerLink="/pokemon/nuevo" class="btn btn-primary">Anadir Pokemon</a>
          </section>

          @if (filteredPokemons().length === 0) {
            <div class="panel empty-state">No hay Pokemon de este tipo con ese filtro.</div>
          } @else {
            <section class="pokemon-grid">
              @for (pokemon of filteredPokemons(); track pokemon.idPokedex) {
                <article class="pokemon-card">
                  <div class="image-stage">
                    <span class="dex-number">N.º {{ pokemon.idPokedex | number:'3.0-0' }}</span>
                    <img
                      [src]="getSprite(pokemon)"
                      [alt]="pokemon.name"
                      (error)="hideBrokenImage($event)"
                    />
                  </div>
                  <div class="card-body">
                    <h2>{{ pokemon.name }}</h2>
                    <span class="type-chip" [style.background]="getTypeColor(pokemon.type)">
                      {{ pokemon.type.name }}
                    </span>
                    <div class="stats">
                      <span><strong>{{ pokemon.basePs }}</strong> PS</span>
                      <span><strong>{{ pokemon.baseAtk }}</strong> ATK</span>
                      <span><strong>{{ pokemon.baseDef }}</strong> DEF</span>
                    </div>
                    <div class="meta">
                      <span>Gen {{ pokemon.gen }}</span>
                      <span>Evolucion {{ pokemon.evolutionLevel }}</span>
                    </div>
                    <div class="actions">
                      <a [routerLink]="['/pokemon', pokemon.idPokedex, 'editar']" class="btn">Editar</a>
                      <button type="button" class="btn btn-danger" (click)="deletePokemon(pokemon)">Borrar</button>
                    </div>
                  </div>
                </article>
              }
            </section>
          }
        }
      </div>
    </main>
  `,
  styles: [`
    .detail-page {
      min-height: calc(100vh - 73px);
      background:
        radial-gradient(circle at 82% 12%, color-mix(in srgb, var(--type-color) 34%, transparent) 0 10rem, transparent 10.2rem),
        radial-gradient(circle at 8% 90%, color-mix(in srgb, var(--type-color) 18%, transparent) 0 14rem, transparent 14.2rem),
        linear-gradient(180deg, color-mix(in srgb, var(--type-color) 24%, #ffffff) 0, #eef2f5 18rem, #e6ebef 100%);
    }

    .detail-content {
      padding-top: 24px;
    }

    .back-link {
      margin-bottom: 18px;
      width: fit-content;
    }

    .type-hero {
      min-height: 250px;
      margin-bottom: 18px;
      border-radius: var(--radius);
      background:
        radial-gradient(circle at 86% 20%, rgba(255, 255, 255, 0.35) 0 44px, transparent 46px),
        radial-gradient(circle at 18% 100%, rgba(255, 255, 255, 0.22) 0 7rem, transparent 7.2rem),
        linear-gradient(135deg, var(--type-color), color-mix(in srgb, var(--type-color) 55%, #263238));
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 22px;
      padding: 30px;
      box-shadow: var(--shadow);
      overflow: hidden;
      position: relative;
    }

    .type-hero::after {
      content: '';
      position: absolute;
      width: 230px;
      aspect-ratio: 1;
      right: -52px;
      bottom: -64px;
      border: 24px solid rgba(255, 255, 255, 0.22);
      border-radius: 50%;
    }

    .type-hero .eyebrow {
      color: #fff;
    }

    .type-hero h1 {
      text-shadow: 0 4px 0 rgba(49, 49, 49, 0.22);
    }

    .matchups {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .hero-count {
      position: relative;
      z-index: 1;
      display: grid;
      justify-items: end;
    }

    .hero-count strong {
      font-size: 4rem;
      line-height: 0.9;
    }

    .hero-count span {
      font-weight: 900;
      text-transform: uppercase;
    }

    .toolbar.panel {
      padding: 16px;
      margin-bottom: 18px;
      border-color: color-mix(in srgb, var(--type-color) 28%, var(--line));
    }

    .search {
      flex: 1 1 280px;
    }

    .sort-group {
      display: flex;
      gap: 8px;
    }

    .pokemon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
    }

    .pokemon-card {
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid color-mix(in srgb, var(--type-color) 26%, var(--line));
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: transform 0.16s, box-shadow 0.16s;
    }

    .pokemon-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 18px 34px rgba(31, 43, 54, 0.18);
    }

    .image-stage {
      min-height: 168px;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle, rgba(255, 255, 255, 0.88) 0 38%, transparent 39%),
        linear-gradient(135deg, color-mix(in srgb, var(--type-color) 18%, #f3f5f7), #dce3ea);
      position: relative;
    }

    .dex-number {
      position: absolute;
      left: 14px;
      top: 12px;
      color: #7b8790;
      font-weight: 900;
    }

    .image-stage img {
      width: 118px;
      height: 118px;
      object-fit: contain;
      image-rendering: pixelated;
    }

    .card-body {
      padding: 16px;
    }

    .card-body h2 {
      font-size: 1.35rem;
      margin-bottom: 8px;
    }

    .type-chip {
      display: inline-flex;
      border-radius: 999px;
      color: #fff;
      padding: 4px 11px;
      font-size: 0.82rem;
      font-weight: 900;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 16px 0 12px;
    }

    .stats span {
      border-radius: var(--radius);
      background: var(--surface-soft);
      padding: 9px 6px;
      color: var(--muted);
      text-align: center;
      font-size: 0.78rem;
      font-weight: 800;
    }

    .stats strong {
      display: block;
      color: var(--text);
      font-size: 1rem;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      color: var(--muted);
      font-size: 0.88rem;
      font-weight: 700;
      margin-bottom: 14px;
    }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    @media (max-width: 680px) {
      .type-hero {
        align-items: flex-start;
        flex-direction: column;
      }

      .hero-count {
        justify-items: start;
      }

      .sort-group,
      .actions {
        width: 100%;
        grid-template-columns: 1fr;
        flex-direction: column;
      }
    }
  `]
})
export class TipoDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tipoService = inject(TipoService);
  private readonly pokemonService = inject(PokemonService);

  readonly type = signal<Tipo | null>(null);
  readonly pokemons = signal<Pokemon[]>([]);
  readonly search = signal('');
  readonly sort = signal<'numero' | 'nombre'>('numero');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filteredPokemons = computed(() => {
    const term = this.normalize(this.search());
    const filtered = this.pokemons().filter(pokemon => this.normalize(pokemon.name).includes(term));
    return [...filtered].sort((a, b) => {
      if (this.sort() === 'numero') {
        return a.idPokedex - b.idPokedex;
      }

      return a.name.localeCompare(b.name);
    });
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadType(id);
  }

  loadType(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      type: this.tipoService.getById(id),
      pokemons: this.pokemonService.getByType(id)
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ type, pokemons }) => {
          this.type.set(type);
          this.pokemons.set(pokemons);
        },
        error: () => this.error.set('No se pudieron cargar los datos. Revisa que el backend este activo.')
      });
  }

  setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  deletePokemon(pokemon: Pokemon): void {
    if (!confirm(`Eliminar a ${pokemon.name}?`)) {
      return;
    }

    this.pokemonService.delete(pokemon.idPokedex).subscribe({
      next: () => this.pokemons.update(list => list.filter(item => item.idPokedex !== pokemon.idPokedex)),
      error: () => alert('No se pudo borrar el Pokemon.')
    });
  }

  getSprite(pokemon: Pokemon): string {
    const spriteId = SPRITE_BY_NAME[this.normalize(pokemon.name)] ?? pokemon.idPokedex;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteId}.png`;
  }

  hideBrokenImage(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  getTypeColor(type: Tipo): string {
    const colors: Record<string, string> = {
      fuego: '#fd7d24',
      agua: '#4592c4',
      planta: '#9bcc50'
    };

    return colors[this.normalize(type.name)] ?? '#607d8b';
  }

  private normalize(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}

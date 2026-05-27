import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { Pokemon, Tipo } from '../../core/models/models';
import { PokemonService } from '../../core/services/pokemon.service';
import { TipoService } from '../../core/services/tipo.service';

const TYPE_COLORS: Record<string, string> = {
  fuego: '#fd7d24',
  agua: '#4592c4',
  planta: '#9bcc50',
  electrico: '#eed535',
  eléctrico: '#eed535',
  psiquico: '#f366b9',
  psíquico: '#f366b9',
  hielo: '#51c4e7',
  dragon: '#7038f8',
  dragón: '#7038f8',
  siniestro: '#707070',
  lucha: '#d56723',
  veneno: '#b97fc9',
  tierra: '#ab9842',
  volador: '#3dc7ef',
  bicho: '#729f3f',
  roca: '#a38c21',
  fantasma: '#7b62a3',
  acero: '#9eb7b8',
  hada: '#fdb9e9',
  normal: '#a4acaf'
};

@Component({
  selector: 'app-tipos-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="home-page">
      <section class="hero-band">
        <div class="page-shell hero">
          <div>
            <p class="eyebrow">Centro de datos Pokemon</p>
            <h1>Pokedex</h1>
            <p class="lead">
              Busca, compara y descubre Pokemon por tipo, fortalezas y debilidades.
            </p>
          </div>
        </div>
      </section>

      <section class="page-shell">
        <div class="page-header">
          <div>
            <p class="eyebrow">Tipos disponibles</p>
            <h2>{{ filteredTypes().length }} categorias</h2>
          </div>
          <label class="search-box" aria-label="Buscar tipo">
            <span aria-hidden="true">Buscar</span>
            <input
              class="field"
              type="search"
              placeholder="Fuego, Agua, Planta..."
              [value]="search()"
              (input)="setSearch($event)"
            />
          </label>
        </div>

        @if (loading()) {
          <div class="panel loading-state">Cargando tipos desde el backend...</div>
        } @else if (error()) {
          <div class="panel error-state">
            <strong>{{ error() }}</strong>
            <button type="button" class="btn" (click)="loadData()">Reintentar</button>
          </div>
        } @else if (filteredTypes().length === 0) {
          <div class="panel empty-state">No hay tipos que coincidan con la busqueda.</div>
        } @else {
          <div class="type-grid">
            @for (type of filteredTypes(); track type.id) {
              <a
                class="type-card"
                [routerLink]="['/tipos', type.id]"
                [style.--type-color]="getTypeColor(type)"
              >
                <div class="type-topline">
                  <span class="pill">{{ countByType(type.id) }} Pokemon</span>
                  <span class="type-number">#{{ type.id }}</span>
                </div>
                <h3>{{ type.name }}</h3>
                <dl>
                  <div>
                    <dt>Fuerte contra</dt>
                    <dd>{{ type.effectiveType }}</dd>
                  </div>
                  <div>
                    <dt>Debil ante</dt>
                    <dd>{{ type.weakType }}</dd>
                  </div>
                </dl>
              </a>
            }
          </div>
        }
      </section>
    </main>
  `,
  styles: [`
    .home-page {
      min-height: calc(100vh - 73px);
      background:
        radial-gradient(circle at 84% 18%, rgba(255, 203, 5, 0.36) 0 11rem, transparent 11.2rem),
        radial-gradient(circle at 12% 88%, rgba(227, 53, 13, 0.15) 0 14rem, transparent 14.2rem),
        linear-gradient(180deg, #fff6de 0, #eef2f5 22rem, #e7edf2 100%);
    }

    .hero-band {
      background:
        radial-gradient(circle at 88% 38%, rgba(255, 255, 255, 0.25) 0 4.6rem, transparent 4.8rem),
        radial-gradient(circle at 18% 100%, rgba(255, 255, 255, 0.18) 0 8rem, transparent 8.2rem),
        linear-gradient(135deg, #e3350d 0%, #ff6b35 55%, #ffcb05 100%);
      color: #fff;
      border-bottom: 6px solid #313131;
    }

    .hero {
      min-height: 240px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 24px;
      padding-bottom: 34px;
    }

    .hero h1 {
      text-shadow: 0 4px 0 rgba(49, 49, 49, 0.3);
    }

    .hero .eyebrow,
    .hero .lead {
      color: #fff;
    }

    .search-box {
      flex: 0 1 390px;
      display: grid;
      gap: 6px;
      color: var(--muted);
      font-size: 0.84rem;
      font-weight: 800;
    }

    .type-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 18px;
    }

    .type-card {
      min-height: 220px;
      padding: 20px;
      border-radius: var(--radius);
      background:
        radial-gradient(circle at 88% 18%, rgba(255, 255, 255, 0.34) 0 32px, transparent 34px),
        linear-gradient(145deg, var(--type-color), color-mix(in srgb, var(--type-color) 68%, #263238));
      color: #fff;
      box-shadow: var(--shadow);
      overflow: hidden;
      position: relative;
      transition: transform 0.16s, box-shadow 0.16s;
    }

    .type-card::after {
      content: '';
      position: absolute;
      right: -34px;
      bottom: -42px;
      width: 140px;
      aspect-ratio: 1;
      border: 16px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }

    .type-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 18px 34px rgba(31, 43, 54, 0.22);
    }

    .type-topline {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 30px;
    }

    .type-number {
      color: rgba(255, 255, 255, 0.78);
      font-weight: 900;
    }

    .type-card h3 {
      font-size: 1.9rem;
      line-height: 1;
      margin-bottom: 18px;
      text-transform: capitalize;
    }

    dl {
      display: grid;
      gap: 9px;
      margin: 0;
      position: relative;
      z-index: 1;
    }

    dl div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.24);
      padding-bottom: 7px;
    }

    dt {
      color: rgba(255, 255, 255, 0.74);
      font-size: 0.84rem;
      font-weight: 700;
    }

    dd {
      margin: 0;
      font-weight: 900;
    }

    .error-state {
      display: grid;
      justify-items: center;
      gap: 16px;
    }

    @media (max-width: 680px) {
      .hero {
        align-items: flex-start;
        flex-direction: column;
      }

      .search-box {
        flex-basis: auto;
        width: 100%;
      }
    }
  `]
})
export class TiposListComponent implements OnInit {
  private readonly tipoService = inject(TipoService);
  private readonly pokemonService = inject(PokemonService);

  readonly types = signal<Tipo[]>([]);
  readonly pokemons = signal<Pokemon[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filteredTypes = computed(() => {
    const term = this.normalize(this.search());
    return this.types().filter(type => this.normalize(type.name).includes(term));
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      types: this.tipoService.getAll(),
      pokemons: this.pokemonService.getAll()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ types, pokemons }) => {
          this.types.set(types);
          this.pokemons.set(pokemons);
        },
        error: () => {
          this.error.set('No se pudo conectar con el backend en http://localhost:8080.');
        }
      });
  }

  setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  countByType(typeId: number): number {
    return this.pokemons().filter(pokemon => pokemon.type?.id === typeId).length;
  }

  getTypeColor(type: Tipo): string {
    return TYPE_COLORS[this.normalize(type.name)] ?? '#607d8b';
  }

  private normalize(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}

import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TipoService } from '../../core/services/tipo.service';
import { PokemonService } from '../../core/services/pokemon.service';
import { Tipo, Pokemon } from '../../core/models/models';

@Component({
  selector: 'app-tipo-detalle',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  template: `
    <div class="page-container">

      <!-- Botón volver -->
      <div style="margin-bottom: 1rem;">
        <a routerLink="/tipos" class="btn">← Volver a tipos</a>
      </div>

      <!-- Loading tipo -->
      @if (cargandoTipo()) {
        <div class="loading-state">Cargando tipo...</div>
      }

      <!-- Cabecera del tipo -->
      @if (tipo()) {
        <div class="tipo-header" [style.background]="tipo()!.color || '#37474f'">
          <div class="tipo-header-content">
            <h1>Tipo {{ tipo()!.nombre }}</h1>
            <p class="tipo-header-desc">{{ tipo()!.descripcion }}</p>
          </div>
          <span class="tipo-total-badge">{{ pokemonesFiltrados().length }} Pokémon</span>
        </div>
      }

      <!-- Controles -->
      <div class="controls-row">
        <div class="search-row">
          <span>🔍</span>
          <input
            class="form-control"
            type="text"
            placeholder="Buscar Pokémon..."
            [(ngModel)]="filtroBusqueda"
            style="border:none; background:transparent; padding: 10px 0;"
          />
        </div>

        <div class="sort-buttons">
          <button class="btn" [class.btn-accent]="orden() === 'numero'"
                  (click)="orden.set('numero')">N.º Pokédex</button>
          <button class="btn" [class.btn-accent]="orden() === 'nombre'"
                  (click)="orden.set('nombre')">Nombre</button>
        </div>

        <a [routerLink]="['/pokemon/nuevo']" class="btn btn-accent">
          + Añadir Pokémon
        </a>
      </div>

      <!-- Loading pokémon -->
      @if (cargandoPokemons()) {
        <div class="loading-state">Cargando Pokémon...</div>
      }

      <!-- Error -->
      @if (errorPokemons()) {
        <div class="error-banner">⚠️ {{ errorPokemons() }}</div>
      }

      <!-- Grid pokémon -->
      @if (!cargandoPokemons()) {
        @if (pokemonesFiltrados().length === 0 && !errorPokemons()) {
          <div class="empty-state">
            No hay Pokémon de este tipo todavía.
            <a routerLink="/pokemon/nuevo">¡Añade el primero!</a>
          </div>
        } @else {
          <div class="pokemon-grid">
            @for (poke of pokemonesFiltrados(); track poke.id) {
              <div class="poke-card">
                <div class="poke-num">#{{ poke.numero | number:'3.0-0' }}</div>
                <img
                  class="poke-img"
                  [src]="poke.imagenUrl || getDefaultSprite(poke.numero)"
                  [alt]="poke.nombre"
                  (error)="onImgError($event)"
                />
                <div class="poke-nombre">{{ poke.nombre }}</div>
                <div class="poke-desc">{{ poke.descripcion }}</div>
                <div class="poke-actions">
                  <a [routerLink]="['/pokemon', poke.id, 'editar']" class="btn" style="font-size:12px; padding:5px 10px;">Editar</a>
                  <button class="btn btn-danger" style="font-size:12px; padding:5px 10px;"
                          (click)="eliminarPokemon(poke)">Borrar</button>
                </div>
              </div>
            }
          </div>
        }
      }

    </div>
  `,
  styles: [`
    .tipo-header {
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .tipo-header h1 {
      color: #fff;
      font-size: 24px;
      margin-bottom: 4px;
    }

    .tipo-header-desc {
      color: rgba(255,255,255,0.75);
      font-size: 14px;
    }

    .tipo-total-badge {
      background: rgba(0,0,0,0.25);
      color: #fff;
      border-radius: 20px;
      padding: 6px 16px;
      font-size: 14px;
      white-space: nowrap;
    }

    .controls-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }

    .search-row {
      flex: 1;
      min-width: 200px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 0 12px;
    }

    .sort-buttons {
      display: flex;
      gap: 6px;
    }

    .pokemon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 14px;
    }

    .poke-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 16px 12px;
      text-align: center;
      transition: transform 0.12s, border-color 0.12s;
    }

    .poke-card:hover {
      transform: translateY(-3px);
      border-color: var(--color-accent);
    }

    .poke-num {
      font-size: 11px;
      color: var(--color-hint);
      margin-bottom: 6px;
    }

    .poke-img {
      width: 80px;
      height: 80px;
      object-fit: contain;
      margin: 0 auto 8px;
      display: block;
      image-rendering: pixelated;
    }

    .poke-nombre {
      color: var(--color-text);
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .poke-desc {
      color: var(--color-hint);
      font-size: 11px;
      line-height: 1.4;
      margin-bottom: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .poke-actions {
      display: flex;
      gap: 6px;
      justify-content: center;
    }

    .error-banner {
      background: #4a1010;
      border: 1px solid #7a2020;
      border-radius: var(--radius-md);
      color: #ff8a80;
      padding: 1rem 1.25rem;
      margin-bottom: 1rem;
    }
  `]
})
export class TipoDetalleComponent implements OnInit {
  private route       = inject(ActivatedRoute);
  private tipoService = inject(TipoService);
  private pokemonService = inject(PokemonService);

  // === Signals ===
  tipo            = signal<Tipo | null>(null);
  pokemons        = signal<Pokemon[]>([]);
  cargandoTipo    = signal(false);
  cargandoPokemons = signal(false);
  errorPokemons   = signal<string | null>(null);
  orden           = signal<'numero' | 'nombre'>('numero');
  filtroBusqueda  = '';

  // === Computed ===
  pokemonesFiltrados = computed(() => {
    const lista = this.pokemons().filter(p =>
      p.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
    return [...lista].sort((a, b) =>
      this.orden() === 'numero'
        ? a.numero - b.numero
        : a.nombre.localeCompare(b.nombre)
    );
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTipo(id);
    this.cargarPokemons(id);
  }

  cargarTipo(id: number): void {
    this.cargandoTipo.set(true);
    this.tipoService.getById(id).subscribe({
      next: (t) => { this.tipo.set(t); this.cargandoTipo.set(false); },
      error: () => this.cargandoTipo.set(false)
    });
  }

  cargarPokemons(id: number): void {
    this.cargandoPokemons.set(true);
    this.errorPokemons.set(null);
    this.tipoService.getPokemonsByTipo(id).subscribe({
      next: (data) => { this.pokemons.set(data); this.cargandoPokemons.set(false); },
      error: () => {
        this.errorPokemons.set('No se pudieron cargar los Pokémon.');
        this.cargandoPokemons.set(false);
      }
    });
  }

  eliminarPokemon(poke: Pokemon): void {
    if (!confirm(`¿Eliminar a ${poke.nombre}?`)) return;
    this.pokemonService.delete(poke.id).subscribe({
      next: () => this.pokemons.update(list => list.filter(p => p.id !== poke.id)),
      error: () => alert('Error al eliminar el Pokémon.')
    });
  }

  getDefaultSprite(numero: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${numero}.png`;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
  }
}
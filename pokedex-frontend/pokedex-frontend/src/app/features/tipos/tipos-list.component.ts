import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TipoService } from '../../core/services/tipo.service';
import { Tipo } from '../../core/models/models';

// Mapa de colores por tipo (usado si el backend no devuelve color)
const TIPO_COLORES: Record<string, string> = {
  fuego: '#c62828', agua: '#1565c0', planta: '#2e7d32',
  eléctrico: '#f57f17', psíquico: '#6a1b9a', hielo: '#006064',
  dragón: '#4527a0', siniestro: '#212121', lucha: '#bf360c',
  veneno: '#4a148c', tierra: '#5d4037', volador: '#1a237e',
  bicho: '#33691e', roca: '#5d4037', fantasma: '#311b92',
  acero: '#37474f', hada: '#880e4f', normal: '#455a64'
};

@Component({
  selector: 'app-tipos-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="page-container">

      <!-- Cabecera -->
      <div class="page-header">
        <h1>Tipos de Pokémon</h1>
        <span class="count-chip">{{ tiposFiltrados().length }} tipos</span>
      </div>

      <!-- Buscador -->
      <div class="search-row">
        <span class="search-icon">🔍</span>
        <input
          class="form-control search-input"
          type="text"
          placeholder="Buscar tipo..."
          [(ngModel)]="filtro"
        />
      </div>

      <!-- Loading -->
      @if (cargando()) {
        <div class="loading-state">Cargando tipos...</div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="error-banner">
          ⚠️ {{ error() }}
          <button class="btn" (click)="cargarTipos()">Reintentar</button>
        </div>
      }

      <!-- Grid de tipos -->
      @if (!cargando() && !error()) {
        @if (tiposFiltrados().length === 0) {
          <div class="empty-state">No se encontró ningún tipo con ese nombre.</div>
        } @else {
          <div class="tipos-grid">
            @for (tipo of tiposFiltrados(); track tipo.id) {
              <a [routerLink]="['/tipos', tipo.id]" class="tipo-card"
                 [style.background]="getColor(tipo)"
                 [style.borderColor]="getColor(tipo)">
                <div class="tipo-nombre">{{ tipo.nombre }}</div>
                @if (tipo.totalPokemons !== undefined) {
                  <div class="tipo-count">{{ tipo.totalPokemons }} Pokémon</div>
                }
                <div class="tipo-desc">{{ tipo.descripcion }}</div>
              </a>
            }
          </div>
        }
      }

    </div>
  `,
  styles: [`
    .count-chip {
      background: var(--color-surface2);
      color: var(--color-muted);
      border: 1px solid var(--color-border2);
      border-radius: 20px;
      padding: 4px 14px;
      font-size: 13px;
    }

    .search-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.5rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 0 14px;
    }

    .search-icon { font-size: 16px; }

    .search-input {
      border: none;
      background: transparent;
      padding: 12px 0;
    }

    .search-input:focus { outline: none; }

    .tipos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 14px;
    }

    .tipo-card {
      border-radius: var(--radius-lg);
      padding: 20px 16px;
      text-decoration: none;
      border: 2px solid transparent;
      transition: transform 0.15s, opacity 0.15s;
      display: block;
      position: relative;
      overflow: hidden;
    }

    .tipo-card::after {
      content: '';
      position: absolute;
      top: -16px; right: -16px;
      width: 72px; height: 72px;
      border-radius: 50%;
      background: rgba(255,255,255,0.07);
    }

    .tipo-card:hover { transform: translateY(-4px); opacity: 0.9; }

    .tipo-nombre {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .tipo-count {
      color: rgba(255,255,255,0.7);
      font-size: 12px;
      margin-bottom: 8px;
    }

    .tipo-desc {
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .error-banner {
      background: #4a1010;
      border: 1px solid #7a2020;
      border-radius: var(--radius-md);
      color: #ff8a80;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
  `]
})
export class TiposListComponent implements OnInit {
  private tipoService = inject(TipoService);

  // === Signals ===
  tipos = signal<Tipo[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);
  filtro = '';

  // === Computed — filtra reactivamente ===
  tiposFiltrados = computed(() =>
    this.tipos().filter(t =>
      t.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    )
  );

  ngOnInit(): void {
    this.cargarTipos();
  }

  cargarTipos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.tipoService.getAll().subscribe({
      next: (data) => {
        this.tipos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el servidor. ¿Está el backend corriendo en el puerto 8080?');
        this.cargando.set(false);
      }
    });
  }

  getColor(tipo: Tipo): string {
    return tipo.color || TIPO_COLORES[tipo.nombre.toLowerCase()] || '#37474f';
  }
}

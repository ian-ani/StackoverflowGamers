import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <nav class="nav-wrap" aria-label="Navegacion principal">
        <a routerLink="/tipos" class="brand" aria-label="Ir a la Pokedex">
          <span class="ball" aria-hidden="true"></span>
          <span>Pokedex FP Dual</span>
        </a>

        <div class="links">
          <a routerLink="/tipos" routerLinkActive="active" class="nav-link">
            Tipos
          </a>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      background: #313131;
      border-bottom: 5px solid var(--brand-red);
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
    }

    .nav-wrap {
      width: min(1180px, calc(100% - 32px));
      min-height: 68px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 11px;
      color: #fff;
      font-size: 1.12rem;
      font-weight: 900;
    }

    .ball {
      width: 34px;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 3px solid #1f1f1f;
      background:
        linear-gradient(#e3350d 0 46%, #1f1f1f 46% 54%, #fff 54% 100%);
      position: relative;
      box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.35);
    }

    .ball::after {
      content: '';
      position: absolute;
      inset: 9px;
      border-radius: 50%;
      border: 3px solid #1f1f1f;
      background: #fff;
    }

    .links {
      display: flex;
      align-items: stretch;
      gap: 6px;
    }

    .nav-link {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      border-radius: 0 0 var(--radius) var(--radius);
      color: #e8eef3;
      padding: 0 18px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .nav-link:hover,
    .nav-link.active {
      background: #4f4f4f;
      color: #fff;
    }

    @media (max-width: 620px) {
      .nav-wrap {
        width: min(100% - 20px, 1180px);
        min-height: auto;
        padding: 12px 0;
        align-items: flex-start;
        flex-direction: column;
      }

      .links,
      .nav-link {
        width: 100%;
      }

      .nav-link {
        justify-content: center;
        border-radius: var(--radius);
      }
    }
  `]
})
export class NavbarComponent {}

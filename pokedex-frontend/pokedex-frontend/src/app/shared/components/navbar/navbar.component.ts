import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a routerLink="/tipos" class="navbar-brand">
          <span class="brand-icon">⚡</span>
          <span class="brand-text">PokéDex</span>
        </a>
        <div class="navbar-links">
          <a routerLink="/tipos"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: false }"
             class="nav-link">
            Tipos
          </a>
          <a routerLink="/pokemon/nuevo"
             routerLinkActive="active"
             class="nav-link nav-link-accent">
            + Nuevo Pokémon
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #cc0000;
      border-bottom: 3px solid #990000;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-inner {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .brand-icon { font-size: 24px; }
    .brand-text {
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .navbar-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-link {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.15s;
    }
    .nav-link:hover, .nav-link.active {
      background: rgba(0,0,0,0.2);
      color: #fff;
    }
    .nav-link-accent {
      background: rgba(255,215,64,0.15);
      color: #ffd740;
      border: 1px solid rgba(255,215,64,0.3);
    }
    .nav-link-accent:hover {
      background: rgba(255,215,64,0.25);
    }
    .nav-link-accent.active {
      background: rgba(255,215,64,0.25);
      color: #ffd740;
    }
  `]
})
export class NavbarComponent {}

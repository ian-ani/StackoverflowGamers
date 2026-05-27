import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tipos',
    pathMatch: 'full'
  },
  {
    path: 'tipos',
    loadComponent: () =>
      import('./features/tipos/tipos-list.component').then(m => m.TiposListComponent)
  },
  {
    path: 'tipos/:id',
    loadComponent: () =>
      import('./features/tipos/tipo-detalle.component').then(m => m.TipoDetalleComponent)
  },
  {
    path: 'pokemon/nuevo',
    loadComponent: () =>
      import('./features/pokemon-form/pokemon-form.component').then(m => m.PokemonFormComponent)
  },
  {
    path: 'pokemon/:id/editar',
    loadComponent: () =>
      import('./features/pokemon-form/pokemon-form.component').then(m => m.PokemonFormComponent)
  },
  {
    path: '**',
    redirectTo: 'tipos'
  }
];

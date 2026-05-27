import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipo, Pokemon } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TipoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/tipos';

  /** GET /api/tipos */
  getAll(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(this.baseUrl);
  }

  /** GET /api/tipos/:id */
  getById(id: number): Observable<Tipo> {
    return this.http.get<Tipo>(`${this.baseUrl}/${id}`);
  }

  /** GET /api/tipos/:id/pokemons */
  getPokemonsByTipo(id: number): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.baseUrl}/${id}/pokemons`);
  }
}

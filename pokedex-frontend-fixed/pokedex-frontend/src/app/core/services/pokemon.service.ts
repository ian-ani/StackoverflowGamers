import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonCreate } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/pokemons';

  /** GET /api/pokemons */
  getAll(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.baseUrl);
  }

  /** GET /api/pokemons/:id */
  getById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/${id}`);
  }

  /** POST /api/pokemons */
  create(pokemon: PokemonCreate): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.baseUrl, pokemon);
  }

  /** PUT /api/pokemons/:id */
  update(id: number, pokemon: PokemonCreate): Observable<Pokemon> {
    return this.http.put<Pokemon>(`${this.baseUrl}/${id}`, pokemon);
  }

  /** DELETE /api/pokemons/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

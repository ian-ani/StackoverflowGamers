import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonPayload } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pokemon`;

  getAll(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.baseUrl);
  }

  getById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/${id}`);
  }

  getByType(typeId: number): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.baseUrl}/type/${typeId}`);
  }

  searchByName(name: string): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.baseUrl}/search`, { params: { name } });
  }

  create(pokemon: PokemonPayload): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.baseUrl, pokemon);
  }

  update(id: number, pokemon: PokemonPayload): Observable<Pokemon> {
    return this.http.put<Pokemon>(`${this.baseUrl}/${id}`, pokemon);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

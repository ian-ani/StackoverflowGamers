import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipo } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TipoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/type`;

  getAll(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(this.baseUrl);
  }

  getById(id: number): Observable<Tipo> {
    return this.http.get<Tipo>(`${this.baseUrl}/${id}`);
  }
}

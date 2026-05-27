export interface Tipo {
  id: number;
  nombre: string;
  color: string;
  descripcion: string;
  totalPokemons?: number;
}

export interface Pokemon {
  id: number;
  nombre: string;
  numero: number;
  descripcion: string;
  imagenUrl: string;
  tipoId: number;
  tipoNombre?: string;
}

export interface PokemonCreate {
  nombre: string;
  numero: number;
  descripcion: string;
  imagenUrl: string;
  tipoId: number;
}

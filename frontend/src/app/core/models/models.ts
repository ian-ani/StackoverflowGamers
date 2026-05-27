export interface Tipo {
  id: number;
  name: string;
  effectiveType: string;
  weakType: string;
}

export interface Pokemon {
  idPokedex: number;
  name: string;
  evolutionLevel: number;
  baseAtk: number;
  baseDef: number;
  basePs: number;
  gen: number;
  type: Tipo;
}

export interface PokemonPayload {
  name: string;
  evolutionLevel: number;
  baseAtk: number;
  baseDef: number;
  basePs: number;
  gen: number;
  type: Pick<Tipo, 'id'>;
}

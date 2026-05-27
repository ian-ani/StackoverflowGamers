# PokéDex Frontend — Angular 21

Proyecto Final FP Dual · NTT Data  
Frontend de la aplicación PokéDex, desarrollado con **Angular 19** (compatible con Angular 21).

---

## Requisitos previos

- Node.js 18+ (recomendado 20 o 22)
- npm 9+
- El backend Spring Boot debe estar corriendo en `http://localhost:8080`

---

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar el servidor de desarrollo
npm start
```

La app estará disponible en `http://localhost:4200`

---

## Estructura del proyecto

```
src/app/
├── app.component.ts          # Componente raíz (standalone)
├── app.config.ts             # Configuración: router + HttpClient
├── app.routes.ts             # Rutas con lazy loading
│
├── core/
│   ├── models/
│   │   └── models.ts         # Interfaces: Tipo, Pokemon, PokemonCreate
│   └── services/
│       ├── tipo.service.ts    # Llamadas REST a /api/tipos (Observables)
│       └── pokemon.service.ts # Llamadas REST a /api/pokemons (Observables)
│
├── features/
│   ├── tipos/
│   │   ├── tipos-list.component.ts    # Lista de tipos (Signals + computed)
│   │   └── tipo-detalle.component.ts  # Detalle tipo + sus Pokémon
│   └── pokemon-form/
│       └── pokemon-form.component.ts  # Formulario reactivo crear/editar
│
└── shared/
    └── components/
        └── navbar/
            └── navbar.component.ts    # Barra de navegación
```

---

## Conceptos de Angular aplicados

| Requisito del enunciado | Dónde se usa |
|---|---|
| Componentes StandAlone | Todos los componentes usan `standalone: true` |
| Signals | `tipos-list`, `tipo-detalle`, `pokemon-form` — `signal()`, `computed()` |
| Formularios reactivos | `pokemon-form.component.ts` — `FormBuilder`, `Validators` |
| Servicios con Observables | `tipo.service.ts`, `pokemon.service.ts` — `Observable<T>` de HttpClient |
| Llamadas a API REST | Ambos servicios llaman al backend Spring Boot |
| Rutas entre vistas | `app.routes.ts` — lazy loading de componentes |

---

## Rutas disponibles

| Ruta | Vista |
|---|---|
| `/tipos` | Lista de todos los tipos |
| `/tipos/:id` | Detalle de un tipo y sus Pokémon |
| `/pokemon/nuevo` | Formulario para crear Pokémon |
| `/pokemon/:id/editar` | Formulario para editar Pokémon |

---

## Notas y problemas encontrados

- Las imágenes de los Pokémon se cargan automáticamente desde los sprites de PokeAPI usando el número de Pokédex, sin necesidad de llamadas externas en el backend.
- Si el backend no está corriendo, la app muestra mensajes de error descriptivos con opción de reintentar.
- El formulario detecta si se está creando o editando según si la ruta incluye `:id`.

---

## Backend

Ver carpeta `backend/` para el proyecto Spring Boot.  
API esperada en `http://localhost:8080/api`

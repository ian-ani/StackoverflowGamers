# Stack Overflow Gamers

Este proyecto es una aplicación que permite gestionar Pokémon, sus tipos y relaciones. El backend está desarrollado con **Spring Boot**, utilizando **H2** como base de datos en memoria, y el frontend está construido con **Angular 19**.

## Autores

Bradan, Ayrton, Iris y Carlos.

## Tabla de contenidos

- [Tecnologías](#Tecnologías)
- [Funcionalidades](#Funcionalidades)
- [Requisitos previos](#Requisitos-previos)
- [Cómo iniciar proyecto](#Cómo-iniciar-proyecto)
- [Histórico](#Histórico)

## Tecnologías

### Backend:

- Spring Boot
- Spring Data JPA/Hibernate
- Lombok

### Frontend:

- Angular 21
- TypeScript

## Funcionalidades

- Gestión de Pokémon (crear, listar, editar, eliminar)
- Gestión de Tipos
- Relación Pokémon–Tipos (uno o varios tipos por Pokémon)
- API REST para todas las operaciones

## Requisitos previos

- Java 25
- Node.js 24
- Angular CLI 21

## Cómo iniciar proyecto

### Backend:

```bash
mvn spring-boot:run
```

### Frontend:

```bash
npm install
ng serve
```

## Histórico

- 09:30 -> Discusión sobre temática y orientación de la aplicación
- 09:45 -> Decidimos que la temática sea sobre Pokémon, con la relación 1:N siendo de tipo:Pokémons
- 09:57 -> Decidimos no meter imágenes
- 10:05 -> Repartición de tareas (frontend Bradan y Ayrton | backend Carlos e Iris) 
- 10:26 -> Comienzo del Proyecto en VSCode
- 10:38 -> Tropiezo importante al comenzar, tengo que Volver a comenzar
- 11:00 -> Push del frontend 1.0
- 11:15 -> Problema con HMR. Hay que usar ng serve --hmr=false para poder corer el frontend
- 11:55 -> Problema con commando ng para todos, no funciona, no se puede reinstalar angular
- 12:15 -> intento de generación de 2 nuevos frontends a ver si alguno funciona
- 12:31 -> Intento fallido de crear Frontend
- 12:55 -> Creación y modificación Frontend
- 13:13 -> Push Readme.md provisional

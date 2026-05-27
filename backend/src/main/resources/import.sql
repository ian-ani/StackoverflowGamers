insert into type (id, name, effective_type, weak_type) values (1, 'Fuego', 'Planta', 'Agua');
insert into type (id, name, effective_type, weak_type) values (2, 'Agua', 'Fuego', 'Planta');
insert into type (id, name, effective_type, weak_type) values (3, 'Planta', 'Agua', 'Fuego');

insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (1, 'Charmander', 1, 52, 43, 39, 1, 1);
insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (2, 'Charmeleon', 2, 64, 58, 58, 1, 1);
insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (3, 'Charizard', 3, 84, 78, 78, 1, 1);
insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (4, 'Squirtle', 1, 48, 65, 44, 1, 2);
insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (5, 'Wartortle', 2, 63, 80, 59, 1, 2);
insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (6, 'Blastoise', 3, 83, 100, 79, 1, 2);
insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (7, 'Bulbasaur', 1, 49, 49, 45, 1, 3);
insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (8, 'Ivysaur', 2, 62, 63, 60, 1, 3);
insert into pokemon (id_pokedex, name, evolution_level, base_atk, base_def, base_ps, gen, type_id) values (9, 'Venusaur', 3, 82, 83, 80, 1, 3);

alter table pokemon alter column id_pokedex restart with 10;

create table if not exists `users`(
    id int not null unique auto_increment,
    nombre varchar(50) not null,
    apellidos varchar(50) not null,
    email varchar(120) not null unique,
    password varchar(200) not null,
    primary key(id)
);

create table if not exists `plants`(
    id int not null auto_increment,
    id_planta int not null,
    id_persona int not null,
    url_imagen varchar(100) default "",
    fecha_plantacion varchar(20),
    lugar_plantacion varchar(50),
    estado_actual varchar(50),
    dimension_actual varchar(30),
    primary key(id)
);

create table if not exists `catalog`(
    id_planta int not null auto_increment,
    nombre varchar(100) default "",
    especie varchar(100) default "",
    tipo varchar(100) default "",
    descripcion varchar(200) default "",
    dimension_inicial varchar(30) default "",
    tipo_tierra varchar(100) default "",
    tipo_luz varchar(100) default "",
    cuidados_necesarios varchar(500) default "",
    primary key(id_planta)
);

alter table `plants` add constraint `FK_USER` foreign key (id_persona) references users(id);

alter table `plants` add constraint `FK_CATALOG` foreign key (id_planta) references catalog(id_planta);
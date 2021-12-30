<?php
    class Catalog {
        private $connection;
        //Nombre de la tabla
        private $table_name = "catalog";
        public $ID_Planta, 
            $Nombre, 
            $Especie, 
            $Tipo, 
            $Descripcion, 
            $Dimension_Inicial,
            $Tipo_Tierra,
            $Tipo_Luz,
            $Cuidados_Necesarios; 

        function __construct($conn) {
            $this->connection = $conn;
        }

        function getAll(){
            $q = "SELECT * FROM ".$this->table_name;
            $stmt = $this->connection->prepare($q);
            $stmt->execute();
            return $stmt;
        }

        function create_base_plant($Nombre, $Especie, $Tipo, $Desc, $Dim, $Tierra, $Luz, $Cuidados){
            $q = "INSERT INTO ".$this->table_name." VALUES (0, :Nombre, :Especie, :Tipo, :Descripcion, :Dimension_Inicial, :Tipo_Tierra, :Tipo_Luz, :Cuidados_Necesarios)";

            $stmt = $this->connection->prepare($q);
            $stmt->bindParam(":Nombre",$Nombre);
            $stmt->bindParam(":Especie",$Especie);
            $stmt->bindParam(":Tipo",$Tipo);
            $stmt->bindParam(":Descripcion",$Desc);
            $stmt->bindParam(":Dimension_Inicial",$Dim);
            $stmt->bindParam(":Tipo_Tierra",$Tierra);
            $stmt->bindParam(":Tipo_Luz",$Luz);
            $stmt->bindParam(":Cuidados_Necesarios",$Cuidados);

            return $stmt->execute();
        }

        function update_base_plant($Nom, $Esp, $Tipo, $Desc, $Dim, $Tierra, $Luz, $Cuidados, $ID){
            $q = "UPDATE ".$this->table_name." SET Nombre = :nombre, Especie = :esp, Tipo = :tipo, Descripcion = :desc, Dimension_Inicial = :d_in, Tipo_Tierra = :t_tierra, Tipo_Luz = :t_luz, Cuidados_Necesarios = :c_nec WHERE ID_Planta = :id";
            $stmt = $this->connection->prepare($q);

            $id = (int) $ID;

            $stmt->bindParam(":nombre", $Nom);
            $stmt->bindParam(":esp", $Esp);
            $stmt->bindParam(":tipo", $Tipo);
            $stmt->bindParam(":desc", $Desc);
            $stmt->bindParam(":d_in", $Dim);
            $stmt->bindParam(":t_tierra", $Tierra);
            $stmt->bindParam(":t_luz", $Luz);
            $stmt->bindParam(":c_nec", $Cuidados);
            $stmt->bindParam(":id", $id);
            return $stmt->execute();
        }

    }
?>
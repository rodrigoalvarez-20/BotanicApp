PLan<?php
    class Plant {
        private $connection;
        private $table_name = "plants";
        private $second_table = "catalog";
        
        public $ID, $ID_Planta,
        $ID_Persona,
        $URL_Imagen,
        $Fecha_Plantacion,
        $Lugar_Plantacion,
        $Estado_Actual,
        $Dimension_Actual;

        function __construct($connection) {
            $this->connection = $connection;
        }

        function getAllPlantsOfUser($usr_id){
            $q = "SELECT ".$this->table_name.".*, ".$this->second_table.".* from ".$this->table_name." Inner JOIN ".$this->second_table." ON ".$this->table_name.".ID_Planta = ".$this->second_table.".ID_Planta WHERE ".$this->table_name.".ID_Persona = :id";

            $stmt = $this->connection->prepare($q);

            $stmt->bindParam(":id",$usr_id);
            $stmt->execute();
            return $stmt;
        }

        function addPlantToUser($plant){
            $q = "INSERT INTO ".$this->table_name." VALUES (0, :id_p, :id_u, :img, :f_plant, :l_plant, :est, :dim)";

            $stmt = $this->connection->prepare($q);

            $id_p = (int) $plant->ID_Planta;
            $id_usr = (int) $plant->ID_Persona;

            $stmt->bindParam(":id_p", $id_p);
            $stmt->bindParam(":id_u", $id_usr);
            $stmt->bindParam(":img", $plant->URL_Imagen);
            $stmt->bindParam(":f_plant", $plant->Fecha_Plantacion);
            $stmt->bindParam(":l_plant", $plant->Lugar_Plantacion);
            $stmt->bindParam(":est", $plant->Estado_Actual);
            $stmt->bindParam(":dim", $plant->Dimension_Actual);

            return $stmt->execute();

        }

        function updatePlantOfUser($plant){
            $q = "UPDATE ".$this->table_name." SET URL_Imagen = :img, Fecha_Plantacion = :f_plant, Lugar_Plantacion = :l_plant, Estado_Actual = :est, Dimension_Actual = :dim WHERE ID = :id";

            $id = (int) $plant->ID;
            
            $stmt = $this->connection->prepare($q);

            $stmt->bindParam(":img", $plant->URL_Imagen);
            $stmt->bindParam(":f_plant", $plant->Fecha_Plantacion);
            $stmt->bindParam(":l_plant", $plant->Lugar_Plantacion);
            $stmt->bindParam(":est", $plant->Estado_Actual);
            $stmt->bindParam(":dim", $plant->Dimension_Actual);
            $stmt->bindParam(":id", $id);
            
            return $stmt->execute();

        }

        function deletePlantFromUser($plant_id){
            $q = "DELETE FROM ".$this->table_name." WHERE ID = :id";
            $stmt = $this->connection->prepare($q);
            $id = (int) $plant_id;
            $stmt->bindParam(":id", $id);
            
            return $stmt->execute();
        }

    }
?>
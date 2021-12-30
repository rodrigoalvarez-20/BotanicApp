<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers");

    include_once '../config/db.php';

    include_once '../models/catalog.php';

    $db = new DB();
    $connection = $db->getConnection();

    $catalog = new Catalog($connection);

    $stmt = $catalog->getAll();
    $count  = $stmt->rowCount();
    if($count > 0){
        $models = array();
        $models["plants"] = array();

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $p = array(
                "ID" => (int)$row["ID_Planta"],
                "Nombre" => $row["Nombre"],
                "Especie" => $row["Especie"],
                "Tipo" => $row["Tipo"],
                "Descripcion" => $row["Descripcion"],
                "Dimension_Inicial" => $row["Dimension_Inicial"],
                "Tipo_Tierra" => $row["Tipo_Tierra"],
                "Tipo_Luz" => $row["Tipo_Luz"],
                "Cuidados_Necesarios" => $row["Cuidados_Necesarios"]
            );
    
            array_push($models["plants"], $p);
    
        }
    
        echo json_encode($models);

    }else {
        echo json_encode(array("message"=> "No se ha encontrado ningun modelo"));
    }

    
    
?>

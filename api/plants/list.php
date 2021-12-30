<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers");

    include_once '../config/db.php';

    include_once '../models/plant.php';

    $db = new DB();
    $connection = $db->getConnection();

    $plant = new Plant($connection);

    if(isset($_GET["id"])){
        $usr_id = $_GET["id"];
        $stmt = $plant->getAllPlantsOfUser($usr_id);
        $models = array();
        $models["plants"] = array();

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $p = array(
                "ID" => (int) $row["ID"],
                "Imagen" => $row["URL_Imagen"],
                "Nombre" => $row["Nombre"],
                "Especie" => $row["Especie"],
                "Tipo" => $row["Tipo"],
                "Descripcion" => $row["Descripcion"],
                "Dimension_Inicial" => $row["Dimension_Inicial"],
                "Dimension_Actual" => $row["Dimension_Actual"],
                "Tipo_Tierra" => $row["Tipo_Tierra"],
                "Tipo_Luz" => $row["Tipo_Luz"],
                "Cuidados_Necesarios" => $row["Cuidados_Necesarios"],
                "Fecha_Plantacion" => $row["Fecha_Plantacion"],
                "Lugar_Plantacion" => $row["Lugar_Plantacion"],
                "Estado" => $row["Estado_Actual"],
            );
    
            array_push($models["plants"], $p);
    
        }
    
        echo json_encode($models);

    }else {
        echo json_encode(array("error"=> "No se ha especificado un ID de usuario"));
    }
    
?>

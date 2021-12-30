<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers");

    include_once '../config/db.php';

    include_once '../models/plant.php';

    $db = new DB();
    $connection = $db->getConnection();

    $img_path = "../images/";

    $plant = new Plant($connection);
    $plantToAdd = new Plant(null);

    
    $plantToAdd->ID_Persona = $_POST["ID_Usr"];
    $plantToAdd->ID_Planta = $_POST["ID_Plant"];
    $img = "";
    if(isset($_FILES["image"])){
        $target_file = $img_path . basename($_FILES["image"]["name"]);
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
            echo json_encode(array("error" => "La imagen solo puede ser PNG, JPG o JPEG"));
            return;
        }else {
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                $img = htmlspecialchars( basename( $_FILES["image"]["name"]));
              } else {
                echo json_encode(array("error" => "La imagen no se ha podido mover"));
                return;
              }
        }
    }

    $plantToAdd->URL_Imagen = $img;

    $plantToAdd->Fecha_Plantacion =  isset($_POST["Fecha_Plantacion"]) ? $_POST["Fecha_Plantacion"] : date("Y-m-d");
    $plantToAdd->Lugar_Plantacion = $_POST["Lugar"];
    $plantToAdd->Estado_Actual = $_POST["Estado"];
    $plantToAdd->Dimension_Actual = $_POST["Dimension"];

    if($plant->addPlantToUser($plantToAdd)){
        echo json_encode(array("message" => "Se ha añadido correctamente la planta"));
    }else{
        echo json_encode(array("error" => "Ha ocurrido un error al añadir la planta"));
    }
?>
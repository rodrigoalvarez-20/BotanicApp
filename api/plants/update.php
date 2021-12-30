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
    $plantToUpdate = new Plant(null);

    if(isset($_FILES["image"])){
        $target_file = $img_path . basename($_FILES["image"]["name"]);
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
            echo json_encode(array("error" => "La imagen solo puede ser PNG, JPG o JPEG"));
            return;
        }else {
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                $plantToUpdate->URL_Imagen = htmlspecialchars( basename( $_FILES["image"]["name"]));
              } else {
                echo json_encode(array("error" => "La imagen no se ha podido mover"));
                return;
              }
        }
    }else if(isset($_POST["image"])){
        $plantToUpdate->URL_Imagen = $_POST["image"];
    }

    $plantToUpdate->ID = $_POST["ID"];

    $plantToUpdate->Fecha_Plantacion = $_POST["Fecha_Plantacion"];
    $plantToUpdate->Lugar_Plantacion = $_POST["Lugar"];
    $plantToUpdate->Estado_Actual = $_POST["Estado"];
    $plantToUpdate->Dimension_Actual = $_POST["Dimension"];

    if($plant->updatePlantOfUser($plantToUpdate)){
        echo json_encode(array("message" => "Se ha actualizado correctamente la planta"));
    }else{
        echo json_encode(array("error" => "Ha ocurrido un error al actualizar la planta"));
    }
?>
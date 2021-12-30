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

    if(isset($_POST["id"], $_POST["image"])){
        $plant_id = (int) $_POST["id"];
        $path = $_POST["image"];
        if($plant->deletePlantFromUser($plant_id)){

            if(unlink($img_path.$path)){
                echo json_encode(array("message"=> "Se ha eliminado correctamente"));
            }else {
                echo json_encode(array("message"=> "Se ha eliminado correctamente, pero la imagen no se ha podido borrar"));
            }
        }else {
            echo json_encode(array("error"=> "No se ha encontrado ningun elemento"));
        }
    }else {
        echo json_encode(array("error"=> "No se ha especificado un ID de planta o Ruta de imagen"));
    }
    
?>

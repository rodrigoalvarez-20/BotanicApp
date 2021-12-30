<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers");

    include_once '../config/db.php';

    include_once '../models/catalog.php';

    $db = new DB();
    $connection = $db->getConnection();

    $catalog = new Catalog($connection);

    $data = json_decode(file_get_contents("php://input"));
    $nombre = $data->nombre;
    $especie = $data->especie;
    $tipo = $data->tipo;
    $desc = $data->descripcion;
    $dim = $data->dimension;
    $tierra = $data->tierra;
    $luz = $data->luz;
    $cuidados = $data->cuidados;

    #print_r($data);

    if($catalog->create_base_plant($nombre, $especie, $tipo, $desc, $dim, $tierra, $luz, $cuidados)){
        echo json_encode(array("message" => "Se ha creado correctamente el modelo"));
    }else{
        echo json_encode(array("error" => "Ha ocurrido un error al registrar el modelo"));
    }
    
?>

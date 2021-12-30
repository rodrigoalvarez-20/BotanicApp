<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: PATCH");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers");

    include_once '../config/db.php';

    include_once '../models/catalog.php';

    $db = new DB();
    $connection = $db->getConnection();

    $catalog = new Catalog($connection);

    #print($_SERVER["REQUEST_URI"]);

    if(isset($_SERVER["REQUEST_URI"])){
        $uri = $_SERVER["REQUEST_URI"];
        $query = parse_url($uri, PHP_URL_QUERY);
        parse_str($query, $params);
        if($params["id"] == NULL || $params["id"] == ""){
            echo json_encode(array("error" => "No se ha especificado un ID"));
        }else {
            $data = json_decode(file_get_contents("php://input"));
            $nombre = $data->nombre;
            $especie = $data->especie;
            $tipo = $data->tipo;
            $desc = $data->descripcion;
            $dim = $data->dimension;
            $tierra = $data->tierra;
            $luz = $data->luz;
            $cuidados = $data->cuidados;

            if($catalog->update_base_plant($nombre, $especie, $tipo, $desc, $dim, $tierra, $luz, $cuidados, $params["id"])){
                echo json_encode(array("message" => "Se ha actualizado correctamente"));
            }else {
                echo json_encode(array("error" => "No se ha encontrado el modelo a actualizar"));
            }

        }
    }else {
        echo json_encode(array("error" => "No se ha especificado un ID"));
    }    
?>

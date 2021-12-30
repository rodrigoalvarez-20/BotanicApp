<?php
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers");

    include_once '../config/db.php';

    include_once '../models/user.php';

    $db = new DB();
    $connection = $db->getConnection();

    $user = new User($connection);

    $data = json_decode(file_get_contents("php://input")); //--> Formato JSONObject

    $nombre = $data->nombre;
    $apellidos = $data->apellidos;
    $email = $data->email;
    $pwd = $data->password;

    echo json_encode(array("message" => "Api correcta"));

    /* if($user->crear_usuario($nombre, $apellidos,$email, $pwd)){
        echo json_encode(array("message"=>"Se ha creado el usuario"));
    }else{
        echo json_encode(array("error"=>"Ha ocurrido un error al crear el usuario"));
    } */
?>

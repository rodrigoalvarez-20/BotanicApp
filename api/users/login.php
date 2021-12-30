<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers");

    include_once '../config/db.php';

    include_once '../models/user.php';

    $db = new DB();
    $connection = $db->getConnection();

    $user = new User($connection);

    $data = json_decode(file_get_contents("php://input"));
    $email = $data->email;
    $pwd = $data->password;

    $stmt = $user->login_user($email, $pwd);
    $count = $stmt->rowCount();
    if($count == 1){
        //Hay datos
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!password_verify($pwd, $row["Password"])){
            echo json_encode(array("error" => "Las credenciales son incorrecntas"));
        }else {
            echo json_encode(array(
                "ID" => (int) $row["ID"],
                "Nombre" => $row["Nombre"],
                "Apellidos" => $row["Apellidos"],
                "Email" => $row["Email"]
              ));
        }
    }else {
        //No hay datos
        echo json_encode(array(
        "success"=>false,
        "message"=>"Las credenciales son incorrectas"));
  }

?>

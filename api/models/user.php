<?php
  class User {
    //Instancia de conexion
    private $connection;
    //Nombre de la tabla
    private $table_name = "users";
    //Campos en la tabla --> Igual que como fueron nombrados
    public $ID;
    public $Nombre;
    public $Apellidos;
    public $Email;
    public $Password;

    //Constructor de la clase --> Se le tiene que pasar una instancia no nula de la conexion
    function __construct($connection) {
        $this->connection = $connection;
    }

    //Funcion para crear un nuevo usuario
    function crear_usuario($Nombre, $Apellidos, $Email, $Password){
        $query =  "INSERT INTO ".$this->table_name."  VALUES (0,:Nombre,:Apellidos,:Email,:Password)";
        echo("Crear usuario");
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(":Nombre", $Nombre);
        $stmt->bindParam(":Apellidos", $Apellidos);
        $stmt->bindParam(":Email",$Email);
        $pwd_hash = password_hash($Password, PASSWORD_BCRYPT);
        if($pwd_hash == false || $pwd_hash == NULL)
            return false;

        $stmt->bindParam(":Password", $pwd_hash);
    
        return $stmt->execute();

    }

    //Funcion para obtener un solo usuario --> Login
    function login_user($email){
      $query = "SELECT * FROM ".$this->table_name." WHERE Email = :email";
      $stmt = $this->connection->prepare($query);
      $stmt->bindParam(":email", $email);
      $stmt->execute();
      return $stmt;
    }
  }

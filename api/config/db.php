<?php
	class DB {
		#private $host = "project-datasource.cynjhpjrvukf.us-east-2.rds.amazonaws.com";
        private $host = "localhost";
		private $username = "root";
		private $pwd = "";
		private $db_name = "botanic";
		public $connection;

		//Obtiene la conexion a la base de datos
		public function getConnection(){
			$this->connection = null;
			try{
				$this->connection = new PDO("mysql:host=".$this->host.";dbname=".$this->db_name, $this->username, $this->pwd);
        		echo("Conexion establecida");
			}catch(PDOException $ex){
				echo "Error al conectar con la base de datos: ".$ex->getMessage();
			}
			return $this->connection;
		}

	}

?>

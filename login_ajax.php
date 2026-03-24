<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require "config/conexion.php";

function fail($code, $msg){
  http_response_code($code);
  echo json_encode(["ok" => false, "error" => $msg], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  fail(405, "Método no permitido");
}

$email = trim($_POST["email"] ?? "");
$pass  = $_POST["password"] ?? "";

if ($email === "" || $pass === "") {
  fail(400, "Faltan datos");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  fail(400, "Email inválido");
}

try {
  $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE email = ? LIMIT 1");
  $stmt->execute([$email]);
  $u = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$u || !password_verify($pass, $u["password"])) {
    fail(401, "Email o contraseña incorrectos");
  }

  $_SESSION["user_id"] = $u["id"];
  $_SESSION["user_nombre"] = $u["nombre"];
  $_SESSION["user_rol"] = $u["rol"] ?? "usuario";

  echo json_encode([
    "ok" => true,
    "nombre" => $u["nombre"],
    "rol" => $u["rol"] ?? "usuario"
  ], JSON_UNESCAPED_UNICODE);
  exit;

} catch (PDOException $e) {
  fail(500, "Error en base de datos");
}
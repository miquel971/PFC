<?php
header('Content-Type: application/json; charset=utf-8');
require "../conexion.php";

$nombre = trim($_POST["nombre"] ?? "");
$email  = trim($_POST["email"] ?? "");
$pass   = $_POST["password"] ?? "";

function fail($code, $msg){
  http_response_code($code);
  echo json_encode(["ok"=>false, "error"=>$msg], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($nombre === "" || $email === "" || $pass === "") fail(400, "Faltan datos");

if (mb_strlen($nombre) < 2 || mb_strlen($nombre) > 40) fail(400, "Nombre inválido");
if (!preg_match("/^[A-Za-zÀ-ÿÑñ]+(?:[ '\-][A-Za-zÀ-ÿÑñ]+)*$/u", $nombre)) fail(400, "Nombre inválido");

if (mb_strlen($email) > 120) fail(400, "Email inválido");
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(400, "Email inválido");

if (strlen($pass) < 8 || strlen($pass) > 72) fail(400, "Contraseña inválida");
if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/", $pass)) {
  fail(400, "Contraseña inválida");
}

try {
  // email único recomendado
  $check = $conexion->prepare("SELECT id FROM usuarios WHERE email = ? LIMIT 1");
  $check->execute([$email]);
  if ($check->fetch()) fail(409, "Ese email ya está registrado");

  $hash = password_hash($pass, PASSWORD_DEFAULT);

  $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)");
  $stmt->execute([$nombre, $email, $hash]);

  echo json_encode(["ok"=>true], JSON_UNESCAPED_UNICODE);
  exit;

} catch (PDOException $e) {
  fail(500, "Error en base de datos");
}
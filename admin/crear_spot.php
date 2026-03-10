<?php
$conexion = new mysqli("localhost", "root", "", "superspot");
if ($conexion->connect_error) die("Error BD: " . $conexion->connect_error);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nombre = $_POST["nombre"] ?? "";
  $provincia = $_POST["provincia"] ?? "";
  $municipio = $_POST["municipio"] ?? "";
  $lat = $_POST["lat"] ?? "";
  $lng = $_POST["lng"] ?? "";
  $tipo_fondo = $_POST["tipo_fondo"] ?? "";
  $orientacion = $_POST["orientacion"] ?? "";
  $webcam_url = $_POST["webcam_url"] ?? "";
  $activo = isset($_POST["activo"]) ? 1 : 0;

  $stmt = $conexion->prepare("INSERT INTO spots (nombre, provincia, municipio, lat, lng, tipo_fondo, orientacion, webcam_url, activo)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("sssddsssi", $nombre, $provincia, $municipio, $lat, $lng, $tipo_fondo, $orientacion, $webcam_url, $activo);
  $stmt->execute();

  header("Location: spots.php");
  exit;
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Crear spot</title>
  <style>
    body{font-family:Arial;background:#111;color:white;padding:20px}
    input{width:300px;padding:8px;margin:4px 0}
    label{display:block;margin-top:10px}
    a{color:#4fc3f7}
    button{padding:10px 14px;margin-top:10px}
  </style>
</head>
<body>

<h1>Crear Spot</h1>
<a href="spots.php">⬅ Volver</a>

<form method="POST">
  <label>Nombre</label>
  <input name="nombre" required>

  <label>Provincia</label>
  <input name="provincia" required>

  <label>Municipio</label>
  <input name="municipio" required>

  <label>Lat</label>
  <input name="lat" type="number" step="0.0000001" required>

  <label>Lng</label>
  <input name="lng" type="number" step="0.0000001" required>

  <label>Tipo fondo</label>
  <input name="tipo_fondo">

  <label>Orientación</label>
  <input name="orientacion">

  <label>Webcam URL</label>
  <input name="webcam_url">

  <label>
    <input type="checkbox" name="activo" checked> Activo
  </label>

  <button type="submit">Crear</button>
</form>

</body>
</html>
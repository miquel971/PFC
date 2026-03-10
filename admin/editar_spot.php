<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conexion = new mysqli("localhost", "root", "", "superspot");
$conexion->set_charset("utf8mb4");

$id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
if ($id <= 0) die("Falta id");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nombre = trim($_POST["nombre"] ?? "");
  $provincia = trim($_POST["provincia"] ?? "");
  $municipio = trim($_POST["municipio"] ?? "");
  $lat = (float)($_POST["lat"] ?? 0);
  $lng = (float)($_POST["lng"] ?? 0);
  $tipo_fondo = trim($_POST["tipo_fondo"] ?? "");
  $orientacion = trim($_POST["orientacion"] ?? "");
  $webcam_url = trim($_POST["webcam_url"] ?? "");
  $activo = isset($_POST["activo"]) ? 1 : 0;

  $stmt = $conexion->prepare("
    UPDATE spots
    SET nombre=?, provincia=?, municipio=?, lat=?, lng=?, tipo_fondo=?, orientacion=?, webcam_url=?, activo=?
    WHERE id=?
  ");

  // 3 strings, 2 doubles, 3 strings, 2 ints  =>  s s s d d s s s i i
  $stmt->bind_param(
    "sssddsssii",
    $nombre,
    $provincia,
    $municipio,
    $lat,
    $lng,
    $tipo_fondo,
    $orientacion,
    $webcam_url,
    $activo,
    $id
  );

  $stmt->execute();
  header("Location: spots.php");
  exit;
}

$stmt = $conexion->prepare("SELECT * FROM spots WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$spot = $stmt->get_result()->fetch_assoc();
if (!$spot) die("No existe el spot");
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Editar spot</title>
  <style>
    body{font-family:Arial;background:#111;color:white;padding:20px}
    input{width:320px;padding:8px;margin:4px 0}
    label{display:block;margin-top:10px}
    a{color:#4fc3f7}
    button{padding:10px 14px;margin-top:10px}
  </style>
</head>
<body>

<h1>Editar Spot #<?php echo (int)$spot["id"]; ?></h1>
<a href="spots.php">⬅ Volver</a>

<form method="POST">
  <label>Nombre</label>
  <input name="nombre" value="<?php echo htmlspecialchars($spot["nombre"]); ?>" required>

  <label>Provincia</label>
  <input name="provincia" value="<?php echo htmlspecialchars($spot["provincia"]); ?>" required>

  <label>Municipio</label>
  <input name="municipio" value="<?php echo htmlspecialchars($spot["municipio"]); ?>" required>

  <label>Lat</label>
  <input name="lat" type="number" step="0.0000001" value="<?php echo htmlspecialchars($spot["lat"]); ?>" required>

  <label>Lng</label>
  <input name="lng" type="number" step="0.0000001" value="<?php echo htmlspecialchars($spot["lng"]); ?>" required>

  <label>Tipo fondo</label>
  <input name="tipo_fondo" value="<?php echo htmlspecialchars($spot["tipo_fondo"]); ?>">

  <label>Orientación</label>
  <input name="orientacion" value="<?php echo htmlspecialchars($spot["orientacion"]); ?>">

  <label>Webcam URL</label>
  <input name="webcam_url" value="<?php echo htmlspecialchars($spot["webcam_url"]); ?>">

  <label>
    <input type="checkbox" name="activo" <?php echo ((int)$spot["activo"] === 1 ? "checked" : ""); ?>> Activo
  </label>

  <button type="submit">Guardar cambios</button>
</form>

</body>
</html>
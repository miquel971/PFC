<?php
$conexion = new mysqli("localhost", "root", "", "superspot");
if ($conexion->connect_error) die("Error BD: " . $conexion->connect_error);

if ($_SERVER["REQUEST_METHOD"] === "POST") {

  $zona = $_POST["zona"] ?? "med";
  $nombre = $_POST["nombre"] ?? "";
  $provincia = $_POST["provincia"] ?? "";
  $municipio = $_POST["municipio"] ?? "";
  $lat = $_POST["lat"] ?? "";
  $lng = $_POST["lng"] ?? "";
  $tipo_fondo = $_POST["tipo_fondo"] ?? "";
  $orientacion = $_POST["orientacion"] ?? "";
  $webcam_url = $_POST["webcam_url"] ?? "";
  $activo = 1;

  $stmt = $conexion->prepare("
    INSERT INTO spots (
      zona,
      nombre,
      provincia,
      municipio,
      lat,
      lng,
      tipo_fondo,
      orientacion,
      webcam_url,
      activo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ");

  $stmt->bind_param(
    "ssssddsssi",
    $zona,
    $nombre,
    $provincia,
    $municipio,
    $lat,
    $lng,
    $tipo_fondo,
    $orientacion,
    $webcam_url,
    $activo
  );

  $stmt->execute();

  header("Location: spots.php");
  exit;
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Crear spot | superSpot</title>

  <link rel="stylesheet" href="../styles.css">
</head>

<body>

  <main class="crud-page">

    <section class="crear-spot-inline">

      <a href="spots.php" class="crud-volver">
        ← Volver al listado
      </a>

      <div class="modal-head">

        <div class="modal-title">
          Añadir spot
        </div>

        <div class="modal-subtitle">
          Registrar nuevo spot
        </div>

      </div>

      <form class="modal-body auth-form" method="POST">

        <select class="auth-input" name="zona" required>
          <option value="med">Mediterráneo</option>
          <option value="bal">Baleares</option>
        </select>

        <input
          class="auth-input"
          name="nombre"
          placeholder="Nombre del spot"
          required
        >

        <input
          class="auth-input"
          name="provincia"
          placeholder="Provincia"
          required
        >

        <input
          class="auth-input"
          name="municipio"
          placeholder="Municipio"
          required
        >

        <input
          class="auth-input"
          name="lat"
          type="number"
          step="0.0000001"
          placeholder="Latitud"
          required
        >

        <input
          class="auth-input"
          name="lng"
          type="number"
          step="0.0000001"
          placeholder="Longitud"
          required
        >

        <input
          class="auth-input"
          name="tipo_fondo"
          placeholder="Tipo de fondo"
        >

        <input
          class="auth-input"
          name="orientacion"
          placeholder="Orientación"
        >

        <input
          class="auth-input"
          name="webcam_url"
          placeholder="Webcam URL"
        >

        <div class="modal-footer">

          <a href="spots.php" class="btn btn-secondary">
            Cancelar
          </a>

          <button class="btn" type="submit">
            Guardar spot
          </button>

        </div>

      </form>

      <div class="auth-logo-bottom">
        <img src="../img/logo.png" alt="SuperSpot">
      </div>

    </section>

  </main>

</body>

</html>
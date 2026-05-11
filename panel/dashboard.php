<?php
session_start();

if (
  !isset($_SESSION["user_id"]) ||
  ($_SESSION["user_rol"] ?? "usuario") !== "admin"
) {
  header("Location: ../index.html");
  exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - superSpot</title>

  <link rel="stylesheet" href="../styles.css">
</head>

<body>

<div class="admin-wrap">

  <div class="admin-top">

    <h1 class="admin-title">
      Bienvenido, <?= htmlspecialchars($_SESSION["user_nombre"]) ?>
    </h1>

    <div class="admin-actions">

      <a href="../admin/crear_spot.php" class="btn-admin">
        Añadir spot
      </a>

      <a href="../index.html" class="btn-admin btn-admin-secondary">
        Ir a la landing
      </a>

      <a href="../logout.php" class="btn-admin btn-admin-secondary">
        Cerrar sesión
      </a>

    </div>

  </div>

  <div class="admin-card">

    <h2>Panel de administración</h2>

    <p>
      Desde aquí podrás gestionar los spots de superSpot.
    </p>

  </div>

</div>

</body>
</html>
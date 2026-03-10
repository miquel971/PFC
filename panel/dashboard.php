<?php
session_start();
if (!isset($_SESSION["user_id"])) {
  header("Location: ../login.php");
  exit;
}
?>

<h1>Bienvenido, <?= htmlspecialchars($_SESSION["user_nombre"]) ?></h1>

<p><a href="../index.php">Ir a la landing</a></p>
<p><a href="../logout.php">Cerrar sesión</a></p>
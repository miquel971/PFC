<?php
require "config/conexion.php";

$stmt = $conexion->query("SELECT id, nombre, email FROM usuarios ORDER BY id DESC");
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h2>Usuarios</h2>
<p><a href="registro.php">+ Nuevo usuario</a></p>

<?php foreach ($usuarios as $u): ?>
  <p>
    <?= htmlspecialchars($u["nombre"]) ?> - <?= htmlspecialchars($u["email"]) ?>
  </p>
<?php endforeach; ?>
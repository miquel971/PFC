<?php
session_start();
require "config/conexion.php";

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = trim($_POST["email"] ?? "");
  $pass  = $_POST["password"] ?? "";

  $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE email = ? LIMIT 1");
  $stmt->execute([$email]);
  $u = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($u && password_verify($pass, $u["password"])) {
    $_SESSION["user_id"] = $u["id"];
    $_SESSION["user_nombre"] = $u["nombre"];
    $_SESSION["user_rol"] = $u["rol"] ?? "usuario";

    header("Location: panel/dashboard.php");
    exit;
  } else {
    $error = "Email o contraseña incorrectos";
  }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Login - superSpot</title>
</head>
<body>
  <h2>Login</h2>

  <?php if ($error): ?>
    <p><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></p>
  <?php endif; ?>

  <form method="POST">
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Contraseña" required>
    <button type="submit">Entrar</button>
  </form>

  <p><a href="registro.php">Crear cuenta</a></p>
</body>
</html>
<?php
session_start();
require "config/conexion.php";

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = $_POST["email"] ?? "";
  $pass  = $_POST["password"] ?? "";

  $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE email = ?");
  $stmt->execute([$email]);
  $u = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($u && password_verify($pass, $u["password"])) {
    $_SESSION["user_id"] = $u["id"];
    $_SESSION["user_nombre"] = $u["nombre"];
    header("Location: panel/dashboard.php");
    exit;
  } else {
    $error = "Email o contraseña incorrectos";
  }
}
?>

<h2>Login</h2>

<?php if ($error) echo "<p>$error</p>"; ?>

<form method="POST">
  <input type="email" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Contraseña" required>
  <button>Entrar</button>
</form>

<p><a href="registro.php">Crear cuenta</a></p>
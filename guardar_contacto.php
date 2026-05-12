<?php

$conexion = new mysqli("localhost", "root", "", "superspot");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$nombre = trim($_POST["nombre"] ?? "");
$email = trim($_POST["email"] ?? "");
$mensaje = trim($_POST["mensaje"] ?? "");

if ($nombre === "" || $email === "" || $mensaje === "") {
    die("Faltan datos obligatorios.");
}

$sql = "INSERT INTO mensajes_contacto (nombre, email, mensaje)
        VALUES (?, ?, ?)";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    die("Error en prepare: " . $conexion->error);
}

$stmt->bind_param("sss", $nombre, $email, $mensaje);

if (!$stmt->execute()) {
    die("Error al insertar: " . $stmt->error);
}

$stmt->close();
$conexion->close();

header("Location: contacto.html?enviado=1");
exit;
<?php
$conexion = new mysqli("localhost", "root", "", "superspot");
if ($conexion->connect_error) die("Error BD: " . $conexion->connect_error);

$id = $_GET["id"] ?? null;
if (!$id) die("Falta id");

$conexion->query("DELETE FROM spots WHERE id=" . intval($id));

header("Location: spots.php");
exit;
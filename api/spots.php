<?php
header('Content-Type: application/json');

$host = "localhost";
$db   = "superspot";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $stmt = $pdo->query("SELECT id, nombre, provincia, municipio, lat, lng, tipo_fondo, orientacion, webcam_url, activo FROM spots WHERE activo = 1");
    $spots = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($spots);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
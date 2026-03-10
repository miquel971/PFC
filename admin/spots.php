<?php
$conexion = new mysqli("localhost", "root", "", "superspot");

$resultado = $conexion->query("SELECT * FROM spots");
?>

<!DOCTYPE html>
<html>
<head>
<title>Admin Spots</title>
<style>
body{font-family:Arial;background:#111;color:white}
table{border-collapse:collapse;width:100%}
td,th{border:1px solid #444;padding:8px}
a{color:#4fc3f7}
</style>
</head>

<body>

<h1>Panel Admin Spots</h1>

<a href="crear_spot.php">Crear nuevo spot</a>

<table>
<tr>
<th>ID</th>
<th>Nombre</th>
<th>Provincia</th>
<th>Municipio</th>
<th>Acciones</th>
</tr>

<?php while($row = $resultado->fetch_assoc()) { ?>

<tr>
<td><?php echo $row['id']; ?></td>
<td><?php echo $row['nombre']; ?></td>
<td><?php echo $row['provincia']; ?></td>
<td><?php echo $row['municipio']; ?></td>

<td>
<a href="editar_spot.php?id=<?php echo $row['id']; ?>">Editar</a>
|
<a href="borrar_spot.php?id=<?php echo $row['id']; ?>">Borrar</a>
</td>

</tr>

<?php } ?>

</table>

</body>
</html>
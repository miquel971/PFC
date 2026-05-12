<?php
$conexion = new mysqli("localhost", "root", "", "superspot");

$resultado = $conexion->query("SELECT * FROM spots");
?>

<!DOCTYPE html>
<html>
<head>

<title>Admin Spots</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  padding:24px;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  background:rgb(98,105,115);
  color:white;
}

h1{
  margin:0 0 22px 0;
  font-size:42px;
  font-weight:800;
  color:white;
}

table{
  width:100%;
  min-width:1400px;
  border-collapse:collapse;
  margin-top:20px;
  background:rgba(255,255,255,0.06);
}

.crud-wrap{
  width:100%;
  overflow:auto;
}

th{
  text-align:left;
  padding:14px;
  color:white;
  border-bottom:1px solid rgba(255,255,255,0.12);
}

td{
  padding:14px;
  color:white;
  border-bottom:1px solid rgba(255,255,255,0.08);
  vertical-align:top;
}

tr:hover{
  background:rgba(255,255,255,0.04);
}

a{
  color:white;
  text-decoration:none;
}

a:hover{
  opacity:0.7;
}

</style>

</head>

<body>

<h1>Panel Admin Spots</h1>

<a href="crear_spot.php">Crear nuevo spot</a>

<div class="crud-wrap">

<table>

<tr>
<th>ID</th>
<th>Nombre</th>
<th>Provincia</th>
<th>Municipio</th>
<th>Lat</th>
<th>Lng</th>
<th>Fondo</th>
<th>Orientación</th>
<th>Webcam</th>
<th>Activo</th>
<th>Acciones</th>
</tr>

<?php while($row = $resultado->fetch_assoc()) { ?>

<tr>

<td><?php echo $row['id']; ?></td>

<td><?php echo $row['nombre']; ?></td>

<td><?php echo $row['provincia']; ?></td>

<td><?php echo $row['municipio']; ?></td>

<td><?php echo $row['lat']; ?></td>

<td><?php echo $row['lng']; ?></td>

<td><?php echo $row['tipo_fondo']; ?></td>

<td><?php echo $row['orientacion']; ?></td>

<td><?php echo $row['webcam_url']; ?></td>

<td><?php echo $row['activo']; ?></td>

<td>
<a href="editar_spot.php?id=<?php echo $row['id']; ?>">Editar</a>
|
<a href="borrar_spot.php?id=<?php echo $row['id']; ?>">Borrar</a>
</td>

</tr>

<?php } ?>

</table>
</div>

</body>
</html>
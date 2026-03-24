<?php
session_start();

// Limpia todas las variables de sesión
session_unset();

// Destruye la sesión
session_destroy();

// Lleva a landing
header("Location: index.html");
exit;
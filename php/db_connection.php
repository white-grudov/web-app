<?php
require_once 'config.php';

$conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

if (!$conn) {
    die('Connection failed: ' . mysqli_connect_error());
}
?>

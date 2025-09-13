
<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // your DB password
$db = 'shop_db'; // your database name

$conn = new mysqli($host, $user, $pass, $db);
if($conn->connect_error) die("Connection failed: " . $conn->connect_error);
?>

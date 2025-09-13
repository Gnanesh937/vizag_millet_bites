
<?php
include 'db.php';
$res = $conn->query("SELECT * FROM products WHERE in_slide=1");
$slides = [];
while($row = $res->fetch_assoc()) $slides[] = $row;
echo json_encode($slides);
?>

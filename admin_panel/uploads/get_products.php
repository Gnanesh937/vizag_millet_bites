<?php
include 'db.php';
$res = $conn->query("SELECT * FROM products");
$products = [];
while($row = $res->fetch_assoc()){
    $products[] = $row;
}
echo json_encode($products);
?>

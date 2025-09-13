<?php
include 'db.php';
if(isset($_GET['id'], $_GET['status'])){
    $id = $_GET['id'];
    $status = $_GET['status'];
    $conn->query("UPDATE products SET stock_status='$status' WHERE id=$id");
}
?>

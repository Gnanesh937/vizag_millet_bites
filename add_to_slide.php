<?php
include 'db.php';
if(isset($_GET['id'])){
    $id = $_GET['id'];
    $conn->query("UPDATE products SET in_slide=1 WHERE id=$id");
}
?>

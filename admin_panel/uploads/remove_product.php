<?php
include 'db.php';
if(isset($_GET['id'])){
    $id = $_GET['id'];
    // Delete product image
    $res = $conn->query("SELECT image FROM products WHERE id=$id");
    if($res->num_rows){
        $row = $res->fetch_assoc();
        if($row['image'] && file_exists('uploads/'.$row['image'])) unlink('uploads/'.$row['image']);
    }
    $conn->query("DELETE FROM products WHERE id=$id");
}
?>

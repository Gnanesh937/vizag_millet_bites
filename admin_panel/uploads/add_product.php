<?php
include 'db.php';

$response = ['status'=>'error'];

if(isset($_POST['name'], $_POST['price'], $_POST['category'])){
    $name = $_POST['name'];
    $price = $_POST['price'];
    $category = $_POST['category'];
    $description = $_POST['description'] ?? '';
    $pack_weight = $_POST['pack_weight'] ?? '';
    $stock_status = $_POST['stock_status'] ?? 'in';

    // Handle image upload
    if(isset($_FILES['image']) && $_FILES['image']['error'] === 0){
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $imageName = uniqid() . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], 'uploads/' . $imageName);
    } else {
        $imageName = '';
    }

    $stmt = $conn->prepare("INSERT INTO products (name, price, category, description, pack_weight, stock_status, image) VALUES (?,?,?,?,?,?,?)");
    $stmt->bind_param("sdsssss", $name, $price, $category, $description, $pack_weight, $stock_status, $imageName);
    if($stmt->execute()){
        $response['status'] = 'Product added successfully';
    }
}

echo json_encode($response);
?>

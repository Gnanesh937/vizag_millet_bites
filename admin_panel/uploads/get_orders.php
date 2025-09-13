<?php
include 'db.php';

$res = $conn->query("SELECT * FROM orders ORDER BY id DESC");
$orders = [];

while($o = $res->fetch_assoc()){
    $orderId = $o['id'];
    $itemsRes = $conn->query("SELECT p.name, oi.quantity as qty, oi.price FROM order_items oi JOIN products p ON oi.product_id=p.id WHERE oi.order_id=$orderId");
    $items = [];
    while($i = $itemsRes->fetch_assoc()) $items[] = $i;

    $orders[] = [
        'id' => $o['id'],
        'total_price' => $o['total_price'],
        'payment_ref' => $o['payment_ref'],
        'customer_name' => $o['customer_name'],
        'customer_phone' => $o['customer_phone'],
        'customer_address' => $o['customer_address'],
        'items' => $items
    ];
}

echo json_encode($orders);
?>

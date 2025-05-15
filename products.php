<?php
header('Content-Type: application/json');
include 'db.php';

// 1. Kết nối database
$url = getenv('MYSQL_URL');
$parts = parse_url($url);
$conn = new mysqli($parts['host'], $parts['user'], $parts['pass'], ltrim($parts['path'], '/'), $parts['port']);
if ($conn->connect_error) {
  die(json_encode(["error" => "Database connection failed"]));
}

// 2. Lấy dữ liệu sản phẩm
$sql = "SELECT * FROM products";
$result = $conn->query($sql);

$products = [];
while ($row = $result->fetch_assoc()) {
  $row["tag"] = json_decode($row["tag"]); // Chuyển tag về mảng
  $row["price"] = (float)$row["price"];
  $row["quantity"] = (int)$row["quantity"];
  $row["id"] = (int)$row["id"];
  $products[] = $row;
}

echo json_encode($products);
$conn->close();
?>
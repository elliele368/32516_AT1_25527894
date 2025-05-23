<?php
header('Content-Type: application/json');

// Database connection
$conn = new mysqli("localhost", "root", "", "32516_AT1_25527894");
if ($conn->connect_error) {
  die(json_encode(["error" => "Database connection failed"]));
}

// Get search query
$searchQuery = isset($_GET['query']) ? trim($_GET['query']) : '';

// Prepare search query - only name
$searchTerm = "%" . $conn->real_escape_string($searchQuery) . "%";
$sql = "SELECT * FROM products WHERE name LIKE ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $searchTerm); // Changed to single parameter

$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
  $row["tag"] = json_decode($row["tag"]); // Convert tags to array
  $row["price"] = (float)$row["price"];
  $row["quantity"] = (int)$row["quantity"];
  $row["id"] = (int)$row["id"];
  $products[] = $row;
}

echo json_encode($products);

$stmt->close();
$conn->close();
?>
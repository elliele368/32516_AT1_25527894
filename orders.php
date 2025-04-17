

<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "32516_AT1_25527894");
if ($conn->connect_error) {
  echo json_encode(["success" => false, "error" => "Connection failed"]);
  exit;
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["items"])) {
  echo json_encode(["success" => false, "error" => "Invalid request"]);
  exit;
}

$items = $data["items"];
$outOfStockItems = [];

foreach ($items as $item) {
  $id = (int)$item["id"];
  $qty = (int)$item["quantity"];

  $result = $conn->query("SELECT quantity FROM products WHERE id = $id");
  if ($result && $row = $result->fetch_assoc()) {
    if ((int)$row["quantity"] < $qty) {
      $outOfStockItems[] = $id;
    }
  } else {
    $outOfStockItems[] = $id;
  }
}

if (count($outOfStockItems) > 0) {
  echo json_encode(["success" => false, "outOfStock" => $outOfStockItems]);
} else {
  // If all items are available, update stock
  foreach ($items as $item) {
    $id = (int)$item["id"];
    $qty = (int)$item["quantity"];
    $conn->query("UPDATE products SET quantity = quantity - $qty WHERE id = $id");
  }
  echo json_encode(["success" => true]);
}

$conn->close();
?>
<?php
// Tắt hiển thị lỗi PHP trực tiếp
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Luôn báo là JSON
header('Content-Type: application/json');

try {
  // Đọc dữ liệu JSON
  $json = file_get_contents('php://input');
  $data = json_decode($json, true);
  
  if (json_last_error() !== JSON_ERROR_NONE) {
    throw new Exception("Invalid JSON: " . json_last_error_msg());
  }
  
  if (empty($data)) {
    throw new Exception("No data received");
  }
  
  // Kiểm tra các trường bắt buộc
  $requiredFields = ['name', 'phone', 'email', 'address', 'state', 'payment', 'total', 'items'];
  foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
      throw new Exception("Missing required field: $field");
    }
  }

  include 'db.php';

  $url = getenv('MYSQL_URL');
  $parts = parse_url($url);
  $conn = new mysqli($parts['host'], $parts['user'], $parts['pass'], ltrim($parts['path'], '/'), $parts['port']);
  if ($conn->connect_error) {
    throw new Exception("Connection failed");
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
    exit;
  }

  // Save order info
  $name = $conn->real_escape_string($data["name"]);
  $phone = $conn->real_escape_string($data["phone"]);
  $email = $conn->real_escape_string($data["email"]);
  $address = $conn->real_escape_string($data["address"]);
  $state = $conn->real_escape_string($data["state"]);
  $payment = $conn->real_escape_string($data["payment"]);
  $total = (float)$data["total"];

  $conn->query("INSERT INTO orders (name, phone, email, address, state, payment_method, total) 
                VALUES ('$name', '$phone', '$email', '$address', '$state', '$payment', $total)");

  $orderId = $conn->insert_id;

  // Insert order items
  foreach ($items as $item) {
    $productId = (int)$item["id"];
    $qty = (int)$item["quantity"];
    $productInfoResult = $conn->query("SELECT name, price FROM products WHERE id = $productId");
    if ($productInfoResult && $productRow = $productInfoResult->fetch_assoc()) {
      $productName = $conn->real_escape_string($productRow["name"]);
      $price = (float)$productRow["price"];
    } else {
      $productName = '';
      $price = 0;
    }

    $totalPrice = $price * $qty;
    $conn->query("INSERT INTO order_items (order_id, product_id, product_name, quantity, price) 
                  VALUES ($orderId, $productId, '$productName', $qty, $totalPrice)");

    // Update stock
    $conn->query("UPDATE products SET quantity = quantity - $qty WHERE id = $productId");
  }

  // Trả về thành công
  echo json_encode(['success' => true, 'order_id' => $orderId]);

} catch (Exception $e) {
  // Log lỗi thay vì hiển thị
  error_log("Order error: " . $e->getMessage());
  
  // Trả về lỗi dạng JSON
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error' => $e->getMessage()
  ]);
}

$conn->close();
?>
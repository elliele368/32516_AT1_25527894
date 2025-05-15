<?php
// Thêm logging để debug
error_log("Attempting database connection");

// Trên Railway, định dạng biến môi trường có thể khác
// Thử các cách kết nối khác nhau
try {
    // Cách 1: Sử dụng MYSQL_URL như hiện tại
    $url = getenv('MYSQL_URL');
    if ($url) {
        error_log("Found MYSQL_URL: " . $url);
        $parts = parse_url($url);
        $conn = new mysqli($parts['host'], $parts['user'], $parts['pass'], ltrim($parts['path'], '/'), $parts['port']);
    } 
    // Cách 2: Sử dụng các biến riêng biệt của Railway
    else {
        error_log("Using individual environment variables");
        $host = getenv('MYSQLHOST') ?: getenv('DB_HOST');
        $user = getenv('MYSQLUSER') ?: getenv('DB_USERNAME');
        $pass = getenv('MYSQLPASSWORD') ?: getenv('DB_PASSWORD');
        $db = getenv('MYSQLDATABASE') ?: getenv('DB_DATABASE');
        $port = getenv('MYSQLPORT') ?: getenv('DB_PORT') ?: 3306;
        
        error_log("Host: $host, User: $user, DB: $db, Port: $port");
        $conn = new mysqli($host, $user, $pass, $db, $port);
    }

    if ($conn->connect_error) {
        error_log("Connection failed: " . $conn->connect_error);
    } else {
        error_log("Database connected successfully");
    }
} catch (Exception $e) {
    error_log("DB connection exception: " . $e->getMessage());
}
?>
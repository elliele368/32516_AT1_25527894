-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 17, 2025 at 05:38 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `32516_AT1_25527894`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `state` varchar(10) NOT NULL,
  `payment_method` varchar(20) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `order_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `name`, `phone`, `email`, `address`, `state`, `payment_method`, `total`, `order_time`) VALUES
(1, 'El', '0490328762', 'rongcon368@gmail.com', '123 Annandale', 'NSW', 'cash', 53.50, '2025-04-18 00:59:06'),
(2, 'Abc', '0490328762', 'rongcon@gmail.com', '123 Annandale', 'NSW', 'cash', 37.40, '2025-04-18 01:01:32'),
(3, 'Hello', '0490328762', 'rongcon123@gmail.com', '123 Annandale', 'NSW', 'cash', 63.10, '2025-04-18 01:04:30'),
(4, 'World', '0490328762', 'rongcon368@gmail.com', '123 Annandale', 'NSW', 'cash', 35.10, '2025-04-18 01:06:31'),
(5, 'Alice', '0490328762', 'alice123@gmail.com', '223 Annandale', 'NSW', 'cash', 37.50, '2025-04-18 01:29:20');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`) VALUES
(1, 1, 10, '', 1, 0.00),
(2, 1, 11, '', 3, 0.00),
(3, 2, 2, '', 2, 0.00),
(4, 2, 5, '', 1, 0.00),
(5, 3, 13, 'White Seedless Grapes Bag Approx. 900g each', 1, 3.60),
(6, 3, 10, 'Just Caught Peeled & Deveined Raw Prawns', 2, 27.00),
(7, 4, 3, 'Baby Spinach & Rocket 120g', 2, 5.60),
(8, 4, 19, 'Protein Snack Bar Cookies & Cream 6 packs', 2, 24.00),
(9, 5, 1, 'Lettuce Iceberg Shredded Lettuce 200g', 1, 5.00),
(10, 5, 10, 'Just Caught Peeled & Deveined Raw Prawns', 1, 27.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tag` text NOT NULL,
  `displayUnit` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `image`, `price`, `quantity`, `tag`, `displayUnit`, `description`) VALUES
(1, 'Lettuce Iceberg Shredded Lettuce 200g', './images/dietary-salad.jpg', 5.00, 9, '[\"Fruit & Vegetable\", \"Salad\"]', '$25.00 / 1KG', 'Fresh, crisp, and ready to use—perfect for salads, burgers, and wraps. Pre-washed for convenience. Keep refrigerated.'),
(2, 'Cooked Seafood Salmon Skin On 250g', './images/cooked-salmon.jpg', 10.20, 15, '[\"Meat & Seafood\", \"Seafood\"]', '$40.80 / 1KG', 'Tender, flaky cooked salmon with skin on. Ready to eat or heat, perfect for salads, pastas, or quick meals. Keep refrigerated.'),
(3, 'Baby Spinach & Rocket 120g', './images/baby-spinach.jpg', 2.80, 10, '[\"Fruit & Vegetable\", \"Salad\"]', '$25.00 / 1KG', 'A fresh, leafy mix of baby spinach and rocket. Washed and ready to eat—great for salads, wraps, or smoothies. Keep refrigerated.'),
(4, 'Champagne Leg Ham Shaved From The Deli', './images/champagne-leg-ham.jpg', 21.00, 0, '[\"Meat & Seafood\", \"Meat\"]', '$52.50 / 1KG', 'Delicately shaved Champagne leg ham, tender and full of flavour. Ideal for sandwiches, platters, or salads. Keep refrigerated.'),
(5, 'Market Value 26 Thin BBQ Sausages 1.8kg', './images/thin-bbq-sausage.jpg', 11.50, 24, '[\"Meat & Seafood\", \"Meat\"]', '$6.39 / 1KG', 'These 26 thin BBQ sausages are perfect for grilling, frying, or baking. Great for family meals or gatherings. Keep refrigerated.'),
(6, 'Yakult Probiotic Drink 10x65ml', './images/yakult-probiotic.jpg', 7.70, 12, '[\"Dairy & Egg\", \"Milk\"]', '$11.80 / 1L', 'A refreshing daily probiotic drink containing beneficial bacteria that help support digestive and gut health. Made with Yakult’s unique strain of Lactobacillus casei Shirota.'),
(7, 'Essentials Parmesan Cheese 100g', './images/parmesan-cheese.jpg', 2.00, 20, '[\"Dairy & Egg\", \"Milk\"]', '$20.00 / 1KG', 'Finely grated Parmesan cheese, perfect for pasta, salads, and cooking. Rich, savory flavour. Keep refrigerated.'),
(8, 'Beef Porterhouse Steak & Butter 400g', './images/steak-butter.jpg', 16.00, 23, '[\"Meat & Seafood\", \"Meat\"]', '$52.50 / 1KG', 'Tender porterhouse steak paired with seasoned butter for extra flavour. Ready to cook—perfect for a hearty meal.'),
(9, 'Thawed Extra Large Cooked Tiger Prawns', './images/tiger-prawns.jpg', 25.60, 15, '[\"Meat & Seafood\", \"Seafood\"]', '$40.80 / 1KG', 'Juicy and succulent, these extra large tiger prawns are cooked and ready to enjoy. Ideal for salads or seafood dishes.'),
(10, 'Just Caught Peeled & Deveined Raw Prawns', './images/peeled-deveined-raw-prawns.jpg', 27.00, 3, '[\"Meat & Seafood\", \"Seafood\"]', '$40.80 / 1KG', 'Fresh and ready to cook, these peeled and deveined raw prawns are perfect for stir-fries, pastas, or grills.'),
(11, 'Mayonnaise Whole Egg 440g', './images/mayonnaise-whole-egg.jpg', 7.00, 20, '[\"Dairy & Egg\", \"Egg\"]', '$7.00 / 1EA', 'Rich and creamy whole egg mayonnaise, perfect for sandwiches, salads, and dressings. Smooth texture and full flavour.'),
(12, 'Sunny Queen 12 Extra Large Free Range Eggs 700g', './images/free-range-egg.png', 8.80, 10, '[\"Dairy & Egg\", \"Egg\"]', '$0.73 / 1EA', 'Farm-fresh extra large free range eggs with rich flavour and quality you can trust. Ideal for all your cooking.'),
(13, 'White Seedless Grapes Bag Approx. 900g each', './images/white-seedless-grapes.jpg', 3.60, 17, '[\"Fruit & Vegetable\", \"Fruit\"]', '$4.00 / 1KG', 'Sweet, crisp, and juicy white seedless grapes. Perfect for snacking, lunchboxes, or fruit platters.'),
(14, 'Fresh Apples Punnet 1kg', './images/fresh-apples-punnet.jpg', 5.50, 30, '[\"Fruit & Vegetable\", \"Fruit\"]', '$5.50 / 1KG', 'Crisp, juicy apples packed for convenience. Great for snacking, baking, or lunchboxes. Store in a cool place.'),
(15, 'Cherry Tomatoes Punnet 250g', './images/cherry-tomatoes-punnet.jpg', 3.20, 10, '[\"Fruit & Vegetable\", \"Salad\"]', '$25.00 / 1KG', 'Sweet and juicy cherry tomatoes, perfect for salads, snacking, or roasting. Washed and ready to enjoy.'),
(16, 'Potato Chips Honey Soy Chicken 165g', './images/potato-chips.jpg', 3.00, 20, '[\"Snack & Drink\", \"Snack\"]', '$3.00 / 1EA', 'Crispy chips with a sweet and savoury honey soy chicken flavour. Perfect for snacking or sharing.'),
(17, 'Gluten Free Popcorn 10 Pack', './images/gluten-free-popcorn.jpg', 2.70, 30, '[\"Snack & Drink\", \"Snack\"]', '$0.27 / 1EA', 'Light, crunchy, and gluten free—perfect for lunchboxes, or movie nights. Convenient 10-pack for on-the-go enjoyment.'),
(18, 'Coca-Cola Classic Soft Drink Bottle 1.25l', './images/coca-cola.jpg', 2.00, 10, '[\"Snack & Drink\", \"Drink\"]', '$1.60 / 1L', 'The original, refreshing cola taste you love. Perfect for sharing or enjoying anytime. Serve chilled.'),
(19, 'Protein Snack Bar Cookies & Cream 6 packs', './images/protein-snack-bar.jpg', 12.00, 18, '[\"Health & Wellness\", \"Wellness\"]', '$2.00 / 1EA', 'Delicious cookies & cream flavour protein bars—great for on-the-go energy, or a tasty snack.'),
(20, 'Traditional Raspberry Soft Drink Bottle 1.1l', './images/traditional-raspberry-drink.jpg', 3.00, 30, '[\"Snack & Drink\", \"Drink\"]', '$1.60 / 1L', 'Sweet and fizzy raspberry-flavoured soft drink. A classic treat for any occasion. Serve chilled.'),
(21, 'Gluten Free Breakfast Cereal 375g', './images/breakfast-cereal.jpg', 4.60, 10, '[\"Health & Wellness\", \"Wellness\"]', '$4.60 / 1EA', 'A crunchy and wholesome gluten free cereal, perfect for a nourishing start to your day. Enjoy with milk or yogurt.'),
(22, 'Mini Caps For Pain Relief Paracetamol 500mg 16 pack', './images/medical-pills.jpg', 4.50, 20, '[\"Health & Wellness\", \"Health\"]', '$4.50 / 1EA', 'Effective relief from headaches, muscle pain, and fever. Easy-to-swallow mini capsules.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

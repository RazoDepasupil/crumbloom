mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: myapp
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favourites`
--

DROP TABLE IF EXISTS `favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favourites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_fav` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `favourites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favourites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favourites`
--

LOCK TABLES `favourites` WRITE;
/*!40000 ALTER TABLE `favourites` DISABLE KEYS */;
INSERT INTO `favourites` VALUES (7,4,1,'2026-04-10 10:21:06');
/*!40000 ALTER TABLE `favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (4,4,11,'Raspberry Velvet',2,102.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total` decimal(8,2) NOT NULL,
  `status` enum('pending','baking','ready','delivered','cancelled') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `note` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (4,8,204.00,'delivered',NULL,'2026-05-24 05:16:02','2026-05-24 05:17:02');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price` decimal(8,2) NOT NULL,
  `category` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `tag` enum('Bestseller','New','Fan Fave','Limited','Sale') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Choco Butternut','Masarap to ya',20.00,NULL,10,0,'Limited','2026-03-23 11:28:26','2026-05-24 04:36:04'),(2,'Rose Lychee Meltaway','Delicate butter cookie infused with rose water and lychee, finished with a dusting of pink sugar. Light, floral, and impossibly soft.',98.00,'Floral',40,1,'Bestseller','2026-05-24 04:38:17','2026-05-24 04:38:17'),(3,'Strawberries & Cream','Classic cream cookie swirled with real strawberry jam and topped with a white chocolate drizzle. A timeless favorite.',85.00,'Classic',55,1,'Fan Fave','2026-05-24 04:38:17','2026-05-24 04:38:17'),(4,'Dark Chocolate Obsession','Double dark chocolate cookie with a molten cocoa center, dusted with sea salt flakes. Rich, bold, and unapologetic.',110.00,'Chocolate',30,1,'Bestseller','2026-05-24 04:38:17','2026-05-24 04:38:17'),(5,'Lavender Honey Bliss','Soft vanilla cookie kissed with lavender and local honey glaze. Romantic, fragrant, and made for slow mornings.',95.00,'Floral',25,1,'New','2026-05-24 04:38:17','2026-05-24 04:38:17'),(6,'Brown Butter Pecan','Nutty brown butter cookie loaded with toasted pecans and a caramel ribbon. A warm, comforting classic.',92.00,'Classic',45,1,'Fan Fave','2026-05-24 04:38:17','2026-05-24 04:38:17'),(7,'Champagne Truffle','Champagne-infused white chocolate cookie with a ganache center, wrapped in edible gold dust. Pure celebration.',145.00,'Luxury',20,1,'Limited','2026-05-24 04:38:17','2026-05-24 04:38:17'),(8,'Matcha Red Bean','Earthy ceremonial matcha cookie with a sweet red bean filling. A quiet, elegant pairing.',105.00,'Specialty',30,1,'New','2026-05-24 04:38:17','2026-05-24 04:38:17'),(9,'Cinnamon Sugar Kiss','Classic snickerdoodle rolled generously in cinnamon sugar. Crisp edges, chewy center  pure nostalgia.',78.00,'Classic',60,1,NULL,'2026-05-24 04:38:17','2026-05-24 04:38:17'),(10,'Salted Caramel Heartbreak','Chewy caramel cookie with a molten salted caramel core. Sweet, salty, and dangerously good.',115.00,'Caramel',35,1,'Bestseller','2026-05-24 04:38:17','2026-05-24 04:38:17'),(11,'Raspberry Velvet','Red velvet cookie swirled with raspberry cream cheese frosting. Gorgeous in color, irresistible in flavor.',102.00,'Fruity',28,1,'Fan Fave','2026-05-24 04:38:17','2026-05-24 04:38:17'),(12,'Pistachio Rosewater','Crumbly pistachio cookie scented with rosewater and topped with crushed pistachios. Middle Eastern-inspired and utterly romantic.',118.00,'Floral',22,1,'Limited','2026-05-24 04:38:17','2026-05-24 04:38:17'),(13,'Vanilla Bean Dream','Simple, perfect vanilla bean cookie with flecks of real Madagascan vanilla. The one you always come back to.',80.00,'Classic',50,1,NULL,'2026-05-24 04:38:17','2026-05-24 04:38:17'),(14,'Mango Chili Tango','Tropical mango cookie with a surprising chili kick and a lime sugar rim. Bold, playful, unforgettable.',108.00,'Specialty',18,1,'New','2026-05-24 04:38:17','2026-05-24 04:38:17'),(15,'Cookies & Cream Crush','Chocolate cookie stuffed with Oreo cream filling and crushed cookie pieces. Over-the-top in the best way.',95.00,'Chocolate',40,1,'Fan Fave','2026-05-24 04:38:17','2026-05-24 04:38:17'),(16,'Lemon Poppyseed Darling','Bright lemon cookie with poppyseeds and a tangy lemon glaze. Fresh, zesty, and sunshine in every bite.',88.00,'Fruity',35,1,NULL,'2026-05-24 04:38:17','2026-05-24 04:38:17'),(17,'Ube Coconut Cloud','Vibrant ube cookie with toasted coconut flakes and a sweet coconut cream drizzle. Dreamy purple, dreamy taste.',112.00,'Specialty',25,1,'Sale','2026-05-24 04:38:17','2026-05-24 04:38:17'),(18,'Espresso Toffee','Bold espresso cookie with toffee bits and a dark chocolate base. For those who like their love strong.',105.00,'Chocolate',30,1,'Bestseller','2026-05-24 04:38:17','2026-05-24 04:38:17'),(19,'Blush Strawberry Shortcake','Soft strawberry shortcake cookie layered with vanilla cream and freeze-dried strawberries. Made to share.',90.00,'Fruity',38,1,'Sale','2026-05-24 04:38:17','2026-05-24 04:38:17');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `gender` enum('male','female','other') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avatar` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '????',
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (8,'Razo Depasupil','razodepasupil1@gmail.com','$2a$10$us7FVR.WEPJrL.qmel5zJ.ik6A.ZyLs3Ha1CSr/7mYSPxPbW9UAjC','user','male','👨🏻','','Ilaya 3rd, Dumangas, iloilo','2026-05-24 04:27:50','2026-05-24 05:37:04'),(9,'Maxene Roux Macasinag','maxenemacasinag1@gmail.com','$2a$10$r6Ui1GLOzQzcJelvpNHvv.qQLAGpr7YVVCJkDWxmr6Z29ZJv7Asu6','admin','female','👩🏼',NULL,NULL,'2026-05-24 04:29:49','2026-05-24 04:30:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-24 13:54:52

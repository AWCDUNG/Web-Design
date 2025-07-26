-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 19, 2025 lúc 08:20 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `user_system`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `expires_at`, `last_login`) VALUES
(1, 'Phuong', '$2y$10$jatAPsn3b7uLvAKu9FWUVONfj02CBABG5nNGjuvhHy5zQYv9JNnmW', '2025-06-19 12:43:34', '2025-06-26 07:43:34', '2025-06-19 12:43:34'),
(2, 'Dung', '$2y$10$DK1r2Xucz9z8lTSJ1xMR3.rfjlVBiu.8bWCqQeYDXfh8dvc8LczTu', '2025-06-19 12:47:41', '2025-06-26 07:47:41', '2025-06-19 12:47:41'),
(3, 'Tâm', '$2y$10$ZVZlYdX1HHIhS/eswXgP1u4x4xXcoXiiPkfmtj8Q1Dtu4109859yG', '2025-06-19 12:54:02', '2025-06-26 07:54:02', '2025-06-19 12:54:02'),
(4, 'admin@gmail.com', '$2y$10$XPJOBDiW4yNi5.OhENh6letZv1wxaph1NApQhKChWtUwxa68BYhh6', '2025-06-19 13:13:25', '2025-06-26 08:13:25', '2025-06-19 13:13:25'),
(5, 'AMCDUNG', '$2y$10$lJMX7oJEGysy3WQqKQbnxOktrzwvvYjBhanLGfHSd7TWUtk9FCDkq', '2025-06-19 13:19:41', '2025-06-26 08:19:41', '2025-06-19 13:19:41'),
(6, 'PHPADMIN', '$2y$10$m4zmoZw9CUiXElYNDeZVGOogELrlqiKGlMB2pVaL/xI/U4xirhMsi', '2025-06-19 13:20:13', '2025-06-26 08:20:13', '2025-06-19 13:20:13');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

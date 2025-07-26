CREATE DATABASE IF NOT EXISTS demo;
USE demo;

-- Bảng đếm số lượt truy cập
CREATE TABLE IF NOT EXISTS visit_counter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    count INT NOT NULL DEFAULT 0
);

-- Thêm bản ghi đầu tiên nếu chưa có
INSERT INTO visit_counter (count) SELECT 0 WHERE NOT EXISTS (SELECT * FROM visit_counter);

-- Bảng tài khoản
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Thêm tài khoản mẫu
INSERT INTO users (username, password) VALUES ('admin', '123');

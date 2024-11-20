CREATE DATABASE IF NOT EXISTS mini_ksp;

USE mini_ksp;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (name, price, image) VALUES
('Laptop', 1200.00, '/images/laptop.jpg'),
('Smartphone', 800.00, 'https://via.placeholder.com/150'),
('Headphones', 150.00, 'https://via.placeholder.com/150'),
('Keyboard', 50.00, 'https://via.placeholder.com/150');

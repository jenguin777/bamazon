ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Grape777!'

drop database if exists bamazon;

create database bamazon;

use bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price Decimal(19,4) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ("Schwinn Bike", "Sports and Outdoors", 400.00, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("Daggar Kayak", "Sports and Outdoors", 999.00, 5);

insert into products (product_name, department_name, price, stock_quantity)
values ("Aquabound Kayak Paddle", "Sports and Outdoors", 135.00, 5);

insert into products (product_name, department_name, price, stock_quantity)
values ("JavaScript: The Good Parts", "Books", 19.65, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("JavaScript: The Definitive Guide: Activate Your Web Pages (Definitive Guides)", "Books", 19.65, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("Adjustable Monitor Stand", "Computers", 19.65, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("Fire TV Stick", "Electronics", 39.99, 15);

insert into products (product_name, department_name, price, stock_quantity)
values ("Fire TV Stick", "Electronics", 39.99, 15);

insert into products (product_name, department_name, price, stock_quantity)
values ("3 Qt Stainless Saucepan", "Housewares", 39.99, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("20 piece Stainless Steel Flatware", "Housewares", 19.99, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("32 inch HDTV", "Electronics", 199.99, 15);

select * from products;

use bamazon;

select item_id, product_name, department_name, round(price, 2) as price FROM products where item_id = 1;

select * FROM products order by department_name asc, product_name asc;

select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where item_id = 1;

select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where stock_quantity < 5 order by department_name asc;

-- UPDATE products SET stock_quantity = 11 WHERE item_id = 1;


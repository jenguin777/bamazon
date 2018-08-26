-- bamazonCustomer.js and bamazonManager.js

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

select * FROM products order by department_name asc, product_name asc;

use bamazon;

select item_id, product_name, department_name, round(price, 2) as price FROM products order by department_name asc;

select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where item_id = 10;

-- UPDATE products SET stock_quantity = 11 WHERE item_id = 1;


select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products order by department_name asc;

use bamazon;

select item_id, product_name, stock_quantity FROM products order by department_name asc;

select item_id, product_name, stock_quantity FROM products order by product_name asc;

-- delete from products where item_id = 14;

-- bamazonSupervisor.js

use bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(255) NOT NULL,
  overhead_costs Decimal(19,4) default 0,
  PRIMARY KEY (department_id)
);

insert into departments (department_name, overhead_costs)
values ("Sports and Outdoors", 5000.00);

insert into departments (department_name, overhead_costs)
values ("Books", 3000.00);

insert into departments (department_name, overhead_costs)
values ("Computers", 10000.00);

insert into departments (department_name, overhead_costs)
values ("Electronics", 8000.00);

insert into departments (department_name, overhead_costs)
values ("Housewares", 6000.00);

select * from departments order by department_name asc;

-- add product_sales column to products table
-- alter table products
-- add column product_sales Decimal(19,4) default 0;

select * from products;

select * from products where item_id = 12;

select item_id, product_name, department_name, round(price, 2) as price, stock_quantity, product_sales FROM products where item_id = 12;

Select distinct department_name from products;

Select department_name, sum(product_sales) from products
group by department_name;

Select distinct department_name from departments;

Select * from departments;

-- Update departments set overhead_costs = 200 where department_id = 6;

-- View Product Sales By Department Query
select departments.department_id, departments.department_name, departments.overhead_costs, sum(products.product_sales) as product_sales_total, sum(products.product_sales) - departments.overhead_costs as total_profit
FROM departments
inner join products 
on TRIM(departments.department_name) = TRIM(products.department_name)
where products.department_name = departments.department_name
group by departments.department_name
order by departments.department_name asc;

-- View Product Sales By Department Query on one line
select departments.department_id, departments.department_name, departments.overhead_costs, sum(products.product_sales) as product_sales_total, sum(products.product_sales) - departments.overhead_costs as total_profit FROM departments inner join products on TRIM(departments.department_name) = TRIM(products.department_name) where products.department_name = departments.department_name group by departments.department_name order by departments.department_name asc;



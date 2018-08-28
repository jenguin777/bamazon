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

select department_id, department_name, round(overhead_costs, 2) as overheadCosts from departments order by department_name asc;

-- add product_sales column to products table
-- alter table products
-- add column product_sales Decimal(19,4) default 0;

select * from products where item_id = 12;

select item_id, product_name, department_name, round(price, 2) as price, stock_quantity, product_sales FROM products where item_id = 12;

Select distinct department_name from products;

Select department_name, sum(product_sales) from products
group by department_name;

Select distinct department_name from departments;

Select * from departments;

-- Update departments set overhead_costs = 200 where department_id = 6;

-- View Product Sales By Department Query - version 1, doesn't handle no rows in product
select departments.department_id, departments.department_name, departments.overhead_costs, 
sum(products.product_sales) as product_sales_total, 
sum(products.product_sales) - departments.overhead_costs as total_profit 
FROM departments inner join products 
on TRIM(departments.department_name) = TRIM(products.department_name) 
where products.department_name = departments.department_name 
group by departments.department_name 
order by departments.department_name asc;

-- View Product Sales By Department Query on one line
select departments.department_id, departments.department_name, departments.overhead_costs, sum(products.product_sales) as product_sales_total, sum(products.product_sales) - departments.overhead_costs as total_profit FROM departments inner join products on TRIM(departments.department_name) = TRIM(products.department_name) where products.department_name = departments.department_name group by departments.department_name order by departments.department_name asc;

select * from products;

Update products set stock_quantity = 25 where item_id = 11;

select item_id, product_name, stock_quantity FROM products where item_id = 11;

-- View Product Sales By Department Query
select departments.department_id, departments.department_name, departments.overhead_costs, 
sum(products.product_sales) as product_sales_total, 
sum(products.product_sales) - departments.overhead_costs as total_profit 
FROM products 
left join departments 
on TRIM(departments.department_name) = TRIM(products.department_name)
UNION ALL
select departments.department_id, departments.department_name, departments.overhead_costs, 
sum(products.product_sales) as product_sales_total, 
sum(products.product_sales) - departments.overhead_costs as total_profit 
FROM products 
right join departments 
on TRIM(departments.department_name) = TRIM(products.department_name);

-- where departments.department_name is null; 
-- group by departments.department_name; 
-- order by departments.department_name asc;



-- this will return duplicate rows
SELECT * FROM t1
LEFT JOIN t2 ON t1.id = t2.id
UNION
SELECT * FROM t1
RIGHT JOIN t2 ON t1.id = t2.id;

-- This will not
SELECT * FROM t1
LEFT JOIN t2 ON t1.id = t2.id
UNION ALL
SELECT * FROM t1
RIGHT JOIN t2 ON t1.id = t2.id
WHERE t1.id IS NULL;

-- t1 = products
-- t2 = departments


-- View Product Sales By Department Query - returns duplicate rows, need to change to full or outer join
select departments.department_id, departments.department_name, departments.overhead_costs, 
sum(products.product_sales) as product_sales_total, 
sum(products.product_sales) - departments.overhead_costs as total_profit 
FROM products 
left join departments 
on departments.department_name = products.department_name
UNION 
select departments.department_id, departments.department_name, departments.overhead_costs, 
sum(products.product_sales) as product_sales_total, 
sum(products.product_sales) - departments.overhead_costs as total_profit 
FROM products 
right join departments 
on departments.department_name = products.department_name;

-- 8 of 11 departments returned, 3 departments don't have product rows
-- the following queries are troubleshooting queries for the View Product Sales By Department query

-- Changed SQL to the equivalent of a full join in order to handle newly added departments that have no products because Manager 
-- hasn't added them yet. Still need to fix the 2 rows for Sports and Outdoors...I know how to fix this in Oracle but the Oracle SQL 
-- fix (4 table aliases, T2.department_name != T4.department name) doesn't work in mySQL.
-- error is: 13:49:10	select T2.department_id, T2.department_name, T2.overhead_costs, sum(T1.product_sales) as product_sales_total, sum(T1.product_sales) - T2.overhead_costs as total_profit  FROM departments T2 left join products T1 on (T1.department_name = T2.department_name) UNION ALL  select T4.department_id, T4.department_name, T4.overhead_costs, sum(T3.product_sales) as product_sales_total, sum(T3.product_sales) - T4.overhead_costs as total_profit  FROM departments T4  right join products T3 on (T3.department_name = T4.department_name) and T2.department_name != T4.department_name  group by T4.department_name	Error Code: 1054. Unknown column 'T2.department_name' in 'on clause'	0.000 sec


Select * from departments;

Select * from products T1
Left join departments T2
on T1.department_name = t2.department_name
UNION ALL
Select * from products T1
right join departments T2
on T1.department_name = t2.department_name
where T1.department_name is null
or T2.department_name is null;

select departments.department_id, products.department_name, departments.overhead_costs,  
sum(products.product_sales) as product_sales_total,  sum(products.product_sales) - departments.overhead_costs as total_profit  
FROM products T1 
left join departments T2
on TRIM(departments.department_name) = TRIM(products.department_name) 
UNION ALL
select departments.department_id, departments.overhead_costs,  
sum(products.product_sales) as product_sales_total,  sum(products.product_sales) - departments.overhead_costs as total_profit  
FROM products  
right join departments  
on TRIM(departments.department_name) = TRIM(products.department_name)  
group by departments.department_name;

select departments.department_id, products.department_name, departments.overhead_costs,  
sum(products.product_sales) as product_sales_total,  sum(products.product_sales) - departments.overhead_costs as total_profit  
FROM products T1 
left join departments T2
on TRIM(departments.department_name) = TRIM(products.department_name) 
UNION ALL
select departments.department_id, departments.overhead_costs,  
sum(products.product_sales) as product_sales_total,  sum(products.product_sales) - departments.overhead_costs as total_profit  
FROM products  
right join departments  
on TRIM(departments.department_name) = TRIM(products.department_name)  
-- where products.department_name is null
group by departments.department_name;


select departments.department_id, departments.department_name, departments.overhead_costs,  sum(products.product_sales) as product_sales_total,  sum(products.product_sales) - departments.overhead_costs as total_profit  FROM departments  left join products  on TRIM(departments.department_name) = TRIM(products.department_name) UNION select departments.department_id, departments.department_name, departments.overhead_costs,  sum(products.product_sales) as product_sales_total,  sum(products.product_sales) - departments.overhead_costs as total_profit  FROM departments  right join products  on TRIM(departments.department_name) = TRIM(products.department_name)  group by departments.department_name;

-- returns 11 rows, Sports and Outdoors duplicated
select departments.department_id, departments.department_name, departments.overhead_costs,   
sum(products.product_sales) as product_sales_total,  sum(products.product_sales) - departments.overhead_costs as total_profit   
FROM products   
left join departments  on TRIM(departments.department_name) = TRIM(products.department_name)  
UNION ALL select departments.department_id, departments.department_name, departments.overhead_costs,   
sum(products.product_sales) as product_sales_total,  sum(products.product_sales) - departments.overhead_costs as total_profit   
FROM products   right join departments   
on TRIM(departments.department_name) = TRIM(products.department_name) 
group by departments.department_name;

-- checkin 8/27/2018 - equivalent of full join
select departments.department_id, departments.department_name, departments.overhead_costs, sum(products.product_sales) as product_sales_total, sum(products.product_sales) - departments.overhead_costs as total_profit FROM products left join departments on TRIM(departments.department_name) = TRIM(products.department_name) UNION ALL select departments.department_id, departments.department_name, departments.overhead_costs, sum(products.product_sales) as product_sales_total, sum(products.product_sales) - departments.overhead_costs as total_profit FROM products right join departments on TRIM(departments.department_name) = TRIM(products.department_name) group by departments.department_name;

select T2.department_id, T2.department_name, T2.overhead_costs, sum(T1.product_sales) as product_sales_total, sum(T1.product_sales) - T2.overhead_costs as total_profit 
FROM products T1
left join departments T2
on TRIM(T2.department_name) = TRIM(T1.department_name)
UNION ALL 
select T4.department_id, T4.department_name, T4.overhead_costs, sum(T3.product_sales) as product_sales_total, sum(T3.product_sales) - T4.overhead_costs as total_profit 
FROM products T3
right join departments T4
on TRIM(T3.department_name) = TRIM(T4.department_name) 
group by T4.department_name;

select T2.department_id, T2.department_name, T2.overhead_costs, sum(T1.product_sales) as product_sales_total, sum(T1.product_sales) - T2.overhead_costs as total_profit 
FROM departments T2
left join products T1
on (T1.department_name = T2.department_name)
UNION ALL 
select T4.department_id, T4.department_name, T4.overhead_costs, sum(T3.product_sales) as product_sales_total, sum(T3.product_sales) - T4.overhead_costs as total_profit 
FROM departments T4 
right join products T3
on (T3.department_name = T4.department_name)
and T2.department_name != T4.department_name 
group by T4.department_name;


select distinct(department_name) FROM departments order by department_name asc;
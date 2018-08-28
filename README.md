# Bamazon
An interactive Amazon-like storefront that can be run via node in a Terminal window (i.e., node bamazonCustomer.js).

`bamazonCustomer.js`- running this application will first display the ids, names, departments, and prices of all products for sale. Then it will prompt the user to choose an item to order and enter a desired quantity. It will take in that order, check quantity in stock, and if there is enough in stock, it will deplete stock from the store's inventory. Then it will display the total cost of the order and new quantity in stock after the order.

`bamazonManager.js` - running this application will provide the following options for Managers:

    * View Products for Sale - lists item IDs, names, prices, and quantities for every available item.
    
    * View Low Inventory - lists all items with an inventory count lower than five.
    
    * Add to Inventory - allow the manager "add more" of any item currently in the store.
    
    * Add New Product - allow the manager to add a completely new product to the store.

`bamazonSupervisor.js` - running this application will provide the following options for Supervisors:

    * View Product Sales by Department - lists the Department ID, Department Name, Overhead Costs, Product Sales, and Total Profit for each department.
   
    * Create New Department - allows the supervisor to add a completely new department to the store.

    * View Departments - lists the Department ID, Department Name, and Overhead Costs for all departments.

# Technologies used
* Node.js (dotenv, inquirer, mysql, console.table packages)
* MySQL
* Javascript

# NPM package installation required
Just run "npm install" in a terminal window after cloning the project. The required packages will be fetched from the package.json file and installed on your machine.

# Database creation required
You can use the DDL statements in bamazon.sql to create your own database and database objects.

# Security 
dotenv was used to mask database credentials, you'll need to provide the following for the mySQL connection:
```
var connection = mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});
```
# Demo video
[Demo.mp4](https://github.com/jenguin777/bamazon/blob/master/Demo.mp4) is a video demo of the functionality.

# License
MIT license applies.

# Code of Conduct
Be nice and don't talk to strangers.

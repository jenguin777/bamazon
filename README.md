# Bamazon
An interactive Amazon-like storefront.

`bamazonCustomer.js`- running this application will first display the ids, names, and prices of all products for sale. It will take in an order, check quantity, and deplete stock from the store's inventory when the customer orders.

`bamazonManager.js` - unning this application will provide the following options for Managers:

    * View Products for Sale - lists item IDs, names, prices, and quantities for every available item.
    
    * View Low Inventory - lists all items with an inventory count lower than five.
    
    * Add to Inventory - allow the manager "add more" of any item currently in the store.
    
    * Add New Product - allow the manager to add a completely new product to the store.

`bamazonSupervisor.js` - running this application will provide the following options for Supervisors:

    * View Product Sales by Department - lists the Department ID, Department Name, Overhead Costs, Product Sales, and Total Profit for each department.
   
    * Create New Department - allows the supervisor to add a completely new department to the store.

    * View Departments - lists the Department ID, Department Name, and Overhead Costs for all departments.

# Technologies used
* Node.js (inquirer, mysql, console.table packages)
* MySQL
* Javascript

# NPM package installation required
Just run "npm install" in a terminal window after cloning the project. The required packages will be fetched from the package.json file and installed on your machine.

# Database creation
You can use the DDL statements in bamazon.sql to create your own database and database objects.

# License
MIT license applies.

# Code of Conduct
Be nice and don't talk to strangers.

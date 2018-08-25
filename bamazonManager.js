//----------------IMPORT NPM PACKAGES---------------------------------//
var inquirer = require("inquirer");
var mysql = require("mysql");
const managerTables = require("console.table");

//----------------GLOBAL VARIABLES------------------------------------//

var tableItemsArray = [];

//----------------CREATE MYSQL CONNECTION-----------------------------//

var connection = mysql.createConnection({
    host: "localhost",
    
    // Your port; if not 3306
    port: 3307,
    
    // Your username
    user: "root",
    
    // Your password
    password: "Grape777!",
    database: "bamazon"
});
      
// Now connect to the database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    useBamazonDB();

    // call startMenu
    startMenu();
});
      
//----------------BUSINESS LOGIC-----------------------------//

function useBamazonDB() {
    connection.query("use bamazon;", function(err, res) {
        if (err) throw err;
        // console.log("Using bamazon...");
    });
}

function startMenu() {

    inquirer.prompt([

        {
        // Here we give the user a list to choose from.
            name: "menuChoices",
            type: "list",
            message: "Welcome to Bamazon Manager View - please select a menu option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","Quit"]
        }

    ]).then(function(response) {
        switch (response.menuChoices) {
            case "View Products for Sale":
                viewProducts();
                break;
        
            case "View Low Inventory":
                lowInventory();
                break;
            
            case "Add to Inventory":
                console.log("You selected Add to Inventory");
                break;
            
            case "Add New Product":
                console.log("You selected Add New Product");
                break;

            case "Quit":
                connection.end();
                break;
        }
    });
    
}
    
// wanted to try to call readAllItems but couldn't figure out how to leave out purchaseItems()
function viewProducts() {
    console.log("Here's a list of all Products:");
    // Fetch all products from the bamazon database, round price to 2 digits of precision
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products order by department_name asc", function(err, res) {
        if (err) throw err;
        
        console.log("\n");

        var result = res;

        printTable(res);
    });
    startMenu();
}

function lowInventory() {
    console.log("Here's a list of all low quantity products (Quantity < 5):");

    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where stock_quantity < 5 order by department_name asc", function(error, results) {
        if (error) throw error;
        
        console.log("\n");

        var result = results;

        printTable(results);
    });
    startMenu();
}

function printTable(items) {
    // Loop through all of the products and push them into the tableItems array
    for (var i=0; i < items.length; i++) {
        tableItemsArray.push(
            {
            ID: items[i].item_id,
            Product_Name: items[i].product_name,
            Department: items[i].department_name,
            Price: items[i].price,
            Quantity: items[i].stock_quantity
            }
        );
    }

    // Use console.table npm package to format and display products
    const table = managerTables.getTable(tableItemsArray);
    console.log(table);

    startMenu();
}
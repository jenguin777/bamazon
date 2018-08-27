//----------------ENVIRONMENT CONFIG---------------------------------//

// read and set any environment variables defined per .env and dbkeys.js - used with the "dotenv" npm package
var keys = require("./dbkeys.js");

//----------------IMPORT NPM PACKAGES---------------------------------//
var getEnv = require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
const managerTables = require("console.table");

//----------------GLOBAL VARIABLES------------------------------------//

var tableItemsArray = [];

//----------------CREATE MYSQL CONNECTION-----------------------------//

// var connection = mysql.createConnection(keys.accessDatabase);

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


// var connection = mysql.createConnection({
//     host: keys.connectDatabase.host,
    
//     // Your port; if not 3306
//     port: keys.connectDatabase.port,
    
//     // Your username
//     user: keys.connectDatabase.user,
    
//     // Your password
//     password: keys.connectDatabase.password,
//     database: keys.connectDatabase.database
// });
      
// Now connect to the database
connection.connect(function(err) {
    // console.log("Keys test " + keys);
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
                addInventory();
                break;

            case "Add New Product":
                addNewProduct();
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
    // startMenu();
}

function addNewProduct() {

    // Prompt the user to provide item information.
    inquirer.prompt([

    {
        type: "input",
        name: "productName",
        message: "What is the name of your product?"
    },
    {
        type: "list",
        message: "Which department is your item for?",
        choices: ["Books", "Computers", "Electronics", "Housewares", "Sports and Outdoors","Music","Automotive"],
        name: "department"
    },
    {
        type: "input",
        name: "price",
        message: "Enter the price of your item:"
    },
    {
        type: "input",
        name: "quantity",
        message: "Enter the quantity of your item:"
    }
    
  
    // After the prompt, pass in item to insertItem(), then call it
    ]).then(function(item) {

        insertItem(item);

    });
}

function insertItem(item) {

    // Now store the new product in the bamazon database
    console.log("Inserting a new product...\n");
    var newItem = item.productName;
    console.log(newItem);
    var department = item.department;
    console.log(department);
    var price = item.price;
    console.log(price);
    var quantity = item.quantity;
    console.log(quantity);
    var query = connection.query(
    "INSERT INTO products SET ?",
        {
            product_name: newItem,
            department_name: department,
            price : price,
            stock_quantity: quantity
        },
        function(err, res) {
            // console.log(res.affectedRows + " product inserted!\n");
            console.log("item inserted!\n");
            // connection.end();
        }
    );
    viewProducts();
}

function addInventory() {

    connection.query("select item_id, product_name, stock_quantity FROM products order by product_name asc", function(err, results) {
        
        if (err) throw err;
            // fetch all products, then ask user which item they want to update quantity for
            inquirer.prompt([
                {
                    name: "choice",
                    type: "rawlist",            
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                        }
                        //console.log("-----choiceArray: " + JSON.stringify(choiceArray));
                        // console.log ("choiceArray just before return: " + choiceArray);
                        return choiceArray;
                    },
                    message: "Select the product you wish to add inventory for."
                },
                {
                    type: "input",
                    name: "addAmount",
                    message: "Enter the quantity you wish to add for this product:"
                }
            ])
            .then(function(answer) {
        
                // get the information of the chosen item
                var chosenItem;
                var newQuantity;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                        // console.log("chosenItem: " + chosenItem);
                        newQuantity = chosenItem.stock_quantity + answer.addAmount;
                        // console.log("newQuantity: " + newQuantity);
                    }
                }
        
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                    stock_quantity: newQuantity
                    },
                    {
                    item_id: chosenItem.item_id
                    }
                ],
                function(error) {
                    if (error) throw err;
                    console.log("Quantity updated successfully!");
                }
            );

        });

    });
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
    
    // console.log("-----End of products, returning to main menu");
    // Need to clear out the table variable so that it's cleared out for the next time the method is called - table = []; doesn't work
    
    // This is not how I wanted to end the program. I tried added startMenu() but it would just keep appending the single table with all table results each time this function was called. I couldn't figure out why.
    connection.end();
    process.exit(0);
}

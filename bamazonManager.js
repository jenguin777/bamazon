//----------------ENVIRONMENT CONFIG---------------------------------//

// read and set any environment variables defined per .env and dbkeys.js - used with the "dotenv" npm package
var keys = require("./dbkeys.js");

//----------------IMPORT NPM PACKAGES---------------------------------//
var getEnv = require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var managerTables = require("console.table");

//----------------CREATE MYSQL CONNECTION-----------------------------//

var connection = mysql.createConnection(keys.accessDatabase);
      
// Now connect to the database
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);

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
    
function viewProducts() {
    console.log("Here's a list of all Products:");
    // Fetch all products from the bamazon database, round price to 2 digits of precision
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products order by department_name asc", function(err, res) {
        if (err) throw err;
        
        console.log("\n");

        var result = res;

        printTable(res);

        startMenu();
    });
}

function lowInventory() {
    console.log("Here's a list of all low quantity products (Quantity < 5):");

    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where stock_quantity < 5 order by department_name asc", function(error, results) {
        if (error) throw error;
        
        console.log("\n");

        var result = results;

        printTable(results);

        startMenu();
    });
}

function addNewProduct() {

    connection.query("select distinct(department_name) FROM departments order by department_name asc", function(err, results) {
        
        if (err) throw err;

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
            choices: function() {
                // I want to be able to generate this list dynamically...need to import Dept object
                var deptChoiceArray = [];
                for (var i = 0; i < results.length; i++) {
                deptChoiceArray.push(results[i].department_name);
                }
                return deptChoiceArray;
            },
            // choices: ["Books", "Computers", "Electronics", "Housewares", "Sports and Outdoors","Music","Automotive"],
            name: "department"
        },
        {
            type: "input",
            name: "price",
            message: "Enter the price of your item:",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }  
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter the quantity of your item:",
            validate: function(value) {
                if (isNaN(value) === false && value % 1 === 0) {
                return true;
                }
                return false;
            }  
        }
        
    
        // After the prompt, pass in item to insertItem(), then call it
        ]).then(function(item) {

            insertItem(item);

        });
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
                    type: "list",            
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "Select the product you wish to add inventory for."
                },
                {
                    type: "input",
                    name: "addAmount",
                    message: "Enter the quantity you wish to add for this product:",
                    validate: function(value) {
                        if (isNaN(value) === false && value % 1 === 0) {
                          return true;
                        }
                        return false;
                    }  
                }
            ])
            .then(function(answer) {
            
                // get the information of the chosen item
                var chosenItem;
                var newQuantity;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                        newQuantity = parseInt(chosenItem.stock_quantity) + parseInt(answer.addAmount);
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

            connection.query("select item_id, product_name, stock_quantity, department_name, round(price, 2) as price FROM products where item_id = ?", 
            chosenItem.item_id, function(err, updatedItem) {
                if (err) throw err;
                
                console.log("\n");

                var updatedResult = updatedItem;

                printTable(updatedResult);

                startMenu();
            });
        });
    });
}

function printTable(items) {
    // Loop through all of the products and push them into the tableItems array
    var tableItemsArray = [];

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
    var table = managerTables.getTable(tableItemsArray);
    console.log(table);
    console.log("\n");
}

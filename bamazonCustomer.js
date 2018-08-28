//----------------ENVIRONMENT CONFIG---------------------------------//

// read and set any environment variables defined per .env and dbkeys.js - used with the "dotenv" npm package
var dbkeys = require("./dbkeys.js");

//----------------IMPORT NPM PACKAGES---------------------------------//
require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require('console.table');

//----------------CREATE MYSQL CONNECTION-----------------------------//
// console.log("Keys test " + JSON.stringify(dbkeys));
// console.log("process.env" + process.env.DB_PASSWORD);

var connection = mysql.createConnection(dbkeys.accessDatabase);

// Now connect to the database
connection.connect(function(err) {
    
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);

    useBamazonDB();

    // Call readAllItems() function
    readAllItems();
});
      
//----------------BUSINESS LOGIC-----------------------------//

function purchaseItems() {
    // Prompt the user to select the item they wish to purchase.
    inquirer.prompt([

        {
            type: "input",
            name: "itemID",
            message: "Enter the id of the item you wish to purchase.",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }  
        },
        {
            type: "input",
            name: "Quantity",
            message: "Enter the quantity of the item you wish to purchase.",
            validate: function(value) {
                if (isNaN(value) === false && value % 1 === 0) {
                  return true;
                }
                return false;
            }      
        }
      
    // After the prompt, store the user's responses in variables: newItem, category, startingBid
    ]).then(function(selectedItem) {
        // Display user's selection
        console.log("You entered item ID: " + selectedItem.itemID + " Quantity " + selectedItem.Quantity + "\n");
        // Now call updateItem() to make updates to product if sufficient quantity exists
        updateItem(selectedItem.itemID,selectedItem.Quantity);
        
    });
}

function useBamazonDB() {
    connection.query("use bamazon;", function(err, res) {
        if (err) throw err;
    });
}

function readAllItems() {
    console.log("Welcome to Bamazon! Here's a list of items currently for sale!");
    // Fetch all products from the bamazon database, round price to 2 digits of precision
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products order by department_name asc", function(err, res) {
        if (err) throw err;
        
        console.log("\n");

        // Loop through all of the products and push them into the tableItems array
        var tableItems = [];
        for (var i=0; i < res.length; i++) {
            tableItems.push(
                {
                ID: res[i].item_id,
                Product_Name: res[i].product_name,
                Department: res[i].department_name,
                Price: res[i].price,
                Quantity: res[i].stock_quantity
                }
            );
        }
        
        // Use console.table npm package to format and display products
        var table = cTable.getTable(tableItems);
        console.log(table);
        
        // Call purchaseItems() function
        purchaseItems();

    });
}

// Check quantity for the selected item. If sufficient quantity, decrement quantity in the database, else display insufficient quantity message
function updateItem(selectedItemID,selectedItemQuantity) {
    
    // Fetch the selected item from the bamazon database
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity, product_sales FROM products where item_id = ?",[selectedItemID], function(err, res) {
        if (err) throw err;
        var fetchedItem = res[0];
        
        console.log("Checking quantity for your item...\n");    

        if (selectedItemQuantity > fetchedItem.stock_quantity) {
            console.log("Sorry, there is insufficient quantity to fill this order.");
            connection.end();
            return;
        } else {
            console.log("Good news, you ordered " +  selectedItemQuantity + ". We have " + fetchedItem.stock_quantity + " available!\n");
            var newQuantity = fetchedItem.stock_quantity - selectedItemQuantity;
            var updateQuantity = connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newQuantity
                },
                {
                  item_id: selectedItemID
                }
              ],
              function(err, res) {
                console.log("product's stock_quantity updated!\n");
                }
            );
            var totalSale = parseInt(selectedItemQuantity) * fetchedItem.price;
            var productSales = fetchedItem.product_sales + totalSale;
            var updateProductSales = connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    product_sales: productSales
                  },
                  {
                    item_id: selectedItemID
                  }
                ],
                function(err, res) {
                  console.log("product's product_sales updated!\n");
                  }
              );
              console.log("Order filled...\n");        
        }
        displayTotals(selectedItemID,selectedItemQuantity);
    });  
}

// display customer total price - selectedItemQuantity * price
function displayTotals(selectedItemID,selectedItemQuantity) {
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where item_id = ?", [selectedItemID], function(err, item) {
        if (err) throw err;
        var purchasedItem = item[0];
        var trimmedQuantity = parseInt(selectedItemQuantity);
        var totalPrice = trimmedQuantity * purchasedItem.price.toFixed(2);
        console.log("The total price for your purchase is: $" + totalPrice + "\n");
        console.log("The new stock_quantity for the item you purchased is: " + purchasedItem.stock_quantity + "\n");
        
    });
    connection.end();
}
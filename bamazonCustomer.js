//----------------IMPORT NPM PACKAGES-----------------------------//
var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');

var tableItems = [];
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
            message: "Enter the id of the item you wish to purchase from this list."
        },
        {
            type: "input",
            name: "Quantity",
            message: "Enter the quantity of this item you wish to purchase from this list."
        }
      
    // After the prompt, store the user's responses in variables: newItem, category, startingBid
    ]).then(function(selectedItem) {
        // Display user's selection
        console.log("You entered item: " + JSON.stringify(selectedItem));
        // Now call updateItem() to make updates to product if sufficient quantity exists
        updateItem(selectedItem.itemID,selectedItem.Quantity);
        
    });
}

function useBamazonDB() {
    connection.query("use bamazon;", function(err, res) {
        if (err) throw err;
        // console.log("Using bamazon...");
    });
}



function readAllItems() {
    console.log("Welcome to Bamazon! Here's a list of items currently for sale!");
    // Fetch all products from the bamazon database, round price to 2 digits of precision
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products order by department_name asc", function(err, res) {
        if (err) throw err;
        
        console.log("\n");

        // Loop through all of the products and push them into the tableItems array
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
        const table = cTable.getTable(tableItems);
        console.log(table);
        
        // Call purchaseItems() function
        purchaseItems();

    });
}

// Check quantity for the selected item. If sufficient quantity, decrement quantity in the database, else display insufficient quantity message
function updateItem(selectedItemID,selectedItemQuantity) {
    
    // Fetch the selected item from the bamazon database
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where item_id = ?",[selectedItemID], function(err, res) {
        if (err) throw err;
        var fetchedItem = res[0];
        
        console.log("Checking quantity for your item...");
            
        // use console.table method to format and display fetchedItem
        const table = cTable.getTable(fetchedItem);
        console.log(table);

        if (selectedItemQuantity > fetchedItem.stock_quantity) {
            console.log("Sorry, there is insufficient quantity to fill this order.");
            connection.end();
            return;
        } else {

            var newQuantity = fetchedItem.stock_quantity - selectedItemQuantity;
            console.log("Updating product's stock_quantity...\n");
            var query = connection.query(
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
                console.log(" product updated!\n");
                }
            );
            console.log("order filled");
        }
        displayTotals(selectedItemID,selectedItemQuantity);
    });  
}

// display customer total price - selectedItemQuantity * price
function displayTotals(selectedItemID,selectedItemQuantity) {
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where item_id = ?", [selectedItemID], function(err, item) {
        if (err) throw err;
        var purchasedItem = item[0];

        var totalPrice = selectedItemQuantity * purchasedItem.price;
        console.log("The total price for your purchase is: " + totalPrice);
        console.log("The new stock_quantity for the item you purchased is: " + purchasedItem.stock_quantity);

    });
    connection.end();
}
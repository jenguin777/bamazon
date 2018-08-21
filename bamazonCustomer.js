//----------------IMPORT NPM PACKAGES-----------------------------//
var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');


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

    // Call readAllItems() function
    readAllItems();

    afterConnection();
});
      
function afterConnection() {
    
    // connection.end();

}

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

function readAllItems() {
    // console.log("Selecting all items...\n");
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products order by department_name asc", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("\n");
        
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
        console.log(tableItems);
        const table = cTable.getTable(tableItems);
        console.log(table);
        
        // Call purchaseItems() function
        purchaseItems();

    });
}

// Check quantity for the selected item. If sufficient quantity, decrement quantity in the database, else display insufficient quantity message
function updateItem(selectedItemID,selectedItemQuantity) {
    console.log("selectedItemID: " + selectedItemID);
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where item_id = ?",[selectedItemID], function(err, res) {
        if (err) throw err;
        var fetchedItem = res[0];
        console.log("res: " + res[0]);
        
        console.log("Checking quantity for your item...");
       
        console.log(fetchedItem.item_id + " | " + fetchedItem.product_name + " | " + fetchedItem.department_name + " | " + fetchedItem.price + " | " + fetchedItem.stock_quantity);

        if (selectedItemQuantity > fetchedItem.stock_quantity) {
            console.log("Sorry, there is insufficient quantity to fill this order.");
            connection.end();
            return;
        } else {

            var newQuantity = fetchedItem.stock_quantity - selectedItemQuantity;
            console.log("newQuantity: " + newQuantity);
            console.log("selectedItemID: " + selectedItemID);
            console.log("Updating stock_quantity...\n");
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
    connection.query("select item_id, product_name, department_name, round(price, 2) as price FROM products where item_id = ?", [selectedItemID], function(err, res) {
        if (err) throw err;
        var purchasedItem = res;
        // console.log(res);

        for (var i=0; i < res.length; i++) {
        var totalPrice = selectedItemQuantity * res[i].price;
        console.log("The total price for your purchase is: " + totalPrice);
        }
    });
    connection.end();
}


    
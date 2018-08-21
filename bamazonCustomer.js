//----------------IMPORT NPM PACKAGES-----------------------------//
var inquirer = require("inquirer");
var mysql = require("mysql");


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

    // Call purchaseItems() function
    purchaseItems();

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

        for (var i=0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
    });
}

// Check quantity for the selected item. If sufficient quantity, decrement quantity in the database, else display insufficient quantity message
function updateItem(selectedItemID,selectedItemQuantity) {
    console.log("selectedItemID: " + selectedItemID);
    connection.query("select item_id, product_name, department_name, round(price, 2) as price, stock_quantity FROM products where item_id = ?",[selectedItemID], function(err, res) {
        if (err) throw err;
        var fetchedItem = res;
        console.log(res);
        // console.log("fetchedItem: " + fetchedItem);
        console.log("Checking quantity for your item...");
        // I do not want a for loop here...I have only 1 item...I want to convert it to an object so that I can access it using dot notation

        // var fetchedItemObj = {};
        // fetchedItem.forEach(function(data){
        //     fetchedItemObj[data[0]] = data[1];
        // });

        // console.log(fetchedItemObj.item_id + " | " + fetchedItemObj.product_name + " | " + fetchedItemObj.department_name + " | " + fetchedItemObj.price + " | " + fetchedItemObj.stock_quantity);
        
        // console.log(res.item_id + " | " + res.product_name + " | " + res.department_name + " | " + res.price + " | " + res.stock_quantity);

        for (var i=0; i < fetchedItem.length; i++) {
            console.log(fetchedItem[i].item_id + " | " + fetchedItem[i].product_name + " | " + fetchedItem[i].department_name + " | " + fetchedItem[i].price + " | " + fetchedItem[i].stock_quantity);
            }

        if (selectedItemQuantity > fetchedItem[0].stock_quantity) {
            console.log("Sorry, there is insufficient quantity to fill this order.");
            connection.end();
            return;
        } else {

            var newQuantity = fetchedItem[0].stock_quantity - selectedItemQuantity;
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


    
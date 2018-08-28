//----------------ENVIRONMENT CONFIG---------------------------------//

// read and set any environment variables defined per .env and dbkeys.js - used with the "dotenv" npm package
var keys = require("./dbkeys.js");

//----------------IMPORT NPM PACKAGES---------------------------------//
var getEnv = require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
const supervisorTables = require("console.table");

//----------------GLOBAL VARIABLES------------------------------------//

var supervisorTableItemsArray = [];
var productSalesArray = [];

//----------------CREATE MYSQL CONNECTION-----------------------------//
     
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
            message: "Welcome to Bamazon Supervisor View - please select a menu option:",
            choices: ["View Product Sales by Department", "View Departments", "Add New Department", "Quit"]
        }

    ]).then(function(response) {
        switch (response.menuChoices) {
            case "View Product Sales by Department":
                viewProductSalesByDepartment();
                break;

            case "View Departments":
                viewDepartments();
                break;
        
            case "Add New Department":
                addNewDepartment();
                break;

            case "Quit":
                connection.end();
                break;
        }
    });
    
}

function viewDepartments() {
    console.log("Here's a list of departments");
    // Fetch all departments from the bamazon database, round overhead_costs to 2 digits of precision
    connection.query("select department_id, department_name, round(overhead_costs, 2) as overheadCosts from departments order by department_name asc", function(err, res) {
        if (err) throw err;
        
        console.log("\n");

        var result = res;

        printSupervisorTable(result);

    });
}

function addNewDepartment() {

    // Prompt the user to provide item information.
    inquirer.prompt([

    {
        type: "input",
        name: "departmentName",
        message: "What is the name of your new department?"
    },
    {
        type: "input",
        name: "overheadCosts",
        message: "Enter the starting overhead costs value for your new department:",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
        } 
    },
      
    // After the prompt, pass in item to insertItem(), then call it
    ]).then(function(response) {

        insertDepartment(response);

    });
}

function insertDepartment(department) {

    // Now store the new department in the bamazon database
    console.log("Inserting a new department...\n");
    var newDepartment = department.departmentName;
    console.log(newDepartment);
    var costs = department.overheadCosts;
    console.log(costs);
    
    var query = connection.query(
    "INSERT INTO departments SET ?",
        {
            department_name: newDepartment,
            overhead_costs : costs,
        },
        function(err, res) {
            // console.log(res.affectedRows + " product inserted!\n");
            console.log("department inserted!\n");
            // connection.end();
        }
    );
    viewDepartments();
}


function printSupervisorTable(items) {
    
    // Loop through all of the departments and push them into the supervisorTableItems array
    for (var i=0; i < items.length; i++) {
        supervisorTableItemsArray.push(
            {
            deptID: items[i].department_id,
            dept_Name: items[i].department_name,
            costs: items[i].overheadCosts
            }
        );
    }
    
    // Use console.table npm package to format and display products
    const departmentsTable = supervisorTables.getTable(supervisorTableItemsArray);
    console.log(departmentsTable);
    console.log("\n");
    
    // console.log("-----End of departments, returning to main menu");
    // Need to clear out the table variable so that it's cleared out for the next time the method is called - table = []; doesn't work
    
    // This is not how I wanted to end the program. I tried added startMenu() but it would just keep appending the single table with all table results each time this function was called. I couldn't figure out why.
    connection.end();
    process.exit(0);
    // startMenu();
}

function viewProductSalesByDepartment() {

    connection.query("select departments.department_id, departments.department_name, departments.overhead_costs, sum(products.product_sales) as product_sales_total, sum(products.product_sales) - departments.overhead_costs as total_profit FROM departments inner join products on TRIM(departments.department_name) = TRIM(products.department_name) where products.department_name = departments.department_name group by departments.department_name order by departments.department_name asc;", function(err, results) {
        
        // Loop through all of the departments and push them into the supervisorTableItems array
        for (var i=0; i < results.length; i++) {
            productSalesArray.push(
                {
                deptID: results[i].department_id,
                dept_Name: results[i].department_name,
                overheadCosts: results[i].overhead_costs,
                productSalesTotal: results[i].product_sales_total,
                totalProfit: results[i].total_profit
                }
            );
        }

        // Use console.table npm package to format and display products
        const productSalesTable = supervisorTables.getTable(productSalesArray);
        console.log(productSalesTable);
        console.log("\n");
        startMenu();
    });
    
}

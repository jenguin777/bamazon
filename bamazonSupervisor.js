//----------------IMPORT NPM PACKAGES---------------------------------//
var inquirer = require("inquirer");
var mysql = require("mysql");
const supervisorTables = require("console.table");

//----------------GLOBAL VARIABLES------------------------------------//

var supervisorTableItemsArray = [];

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
            message: "Welcome to Bamazon Supervisor View - please select a menu option:",
            choices: ["View Sales by Department", "View Departments", "Create New Department", "Quit"]
        }

    ]).then(function(response) {
        switch (response.menuChoices) {
            case "View Sales by Department":
                // viewSalesByProduct();
                console.log("call viewSalesByProduct() function");
                break;

            case "View Departments":
                viewDepartments();
                break;
        
            case "Create New Department":
                addDepartment();
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

        // // Loop through all of the departments and push them into the supervisorTableItems array
        // for (var i=0; i < res.length; i++) {
        //     supervisorTableItemsArray.push(
        //         {
        //         deptID: res[i].department_id,
        //         dept_Name: res[i].department_name,
        //         costs: res[i].overhead_costs
        //         }
        //     );
        // }
        
        // // Use console.table npm package to format and display products
        // const departmentsTable = cTable.getTable(tableItems);
        // console.log(departmentsTable);
        
        // // Call viewDepartments() function
        // viewDepartments();

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
        message: "Enter the starting overhead costs value for your new department:"
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
}

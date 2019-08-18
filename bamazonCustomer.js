const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Password1',
    database: 'bamazon'
};
const DB = mysql.createConnection(dbConfig);

function Product(data) {
    this.id = parseInt(data.item_id);
    this.name = data.product_name;
    this.department = data.department_name;
    this.price = '$' + parseFloat(data.price).toFixed(2);
    this.stock = data.stock_quantity;
}

function connectToDb() {
    return new Promise((resolve, reject) => {
        DB.connect(err => {
            if (err) {
                reject(err);
            }
            console.log(`Connected to Bamazon DB!`);

            // Print all available products
            DB.query('SELECT * FROM products', (err, data) => {
                if (err) {
                    reject(err);
                }

                console.log('\nInventory:\n');

                const products = data.map(i => new Product(i));
                resolve(products);
            });
        });
    });
}

async function printOptions() {
    const choices = await inquirer.prompt([
        {
            type: 'number',
            message: 'Enter a product ID you would like to buy:',
            name: 'productId'
        },
        {
            type: 'number',
            message: 'Enter the quantity to purchase (default 1):',
            name: 'productQty',
            default: 1
        }
    ]);

    return choices;
}

function processOrderRequest(choices, inventory) {
    const product = inventory.find(item => item.id === choices.productId);
    // Verify product selection is valid
    if (!product) {
        return {
            success: false,
            message: `${choices.productId} is an invalid product. Try again.`
        };
    }
    // Verify enough quantity in stock
    if (product.stock < choices.productQty) {
        return {
            success: false,
            message: `Insufficient quantity! Only ${product.stock} available.`
        }
    }
    // Calculate total cost
    const total = product.price * choices.productQty;

    return {
        success: true,
        message: `Processing order: ${product.name} x${choices.productQty}...`,
        total: total
    };
}

async function run() {
    try {
        // Connect to DB and get inventory
        const data = await connectToDb();
        // Log current inventory
        console.table(data);

        let selectingProduct = true;
        while (selectingProduct) {
            // Prompt user for product & qty to purchase
            const choices = await printOptions();
            console.log(choices);

            // Determine if purchase option is valid
            const result = processOrderRequest(choices, data);
            if (!result.success) {
                continue;
            }

            console.log(result.message);
            selectingProduct = false;
        }
    } catch (err) {
        throw err;
    }
}

// run app
run();

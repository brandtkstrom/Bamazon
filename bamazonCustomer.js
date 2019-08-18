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
                resolve({
                    list: products,
                    data: data
                });
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
    const item = inventory.find(item => item.item_id === choices.productId);
    // Verify product selection is valid
    if (!item) {
        return {
            success: false,
            message: `${choices.productId} is an invalid product. Try again.`
        };
    }
    // Verify enough quantity in stock
    if (item.stock_quantity < choices.productQty) {
        return {
            success: false,
            message: `Insufficient quantity! Only ${
                item.stock_quantity
            } available.`
        };
    }
    // Calculate total cost
    const total = item.price * choices.productQty;

    return {
        success: true,
        message: `\nProcessing order - Product: ${item.product_name}, Qty: ${
            choices.productQty
        }`,
        product: new Product(item),
        newQty: item.stock_quantity - choices.productQty,
        total: `$${total.toFixed(2)}`
    };
}

async function run() {
    try {
        // Connect to DB and get inventory
        const products = await connectToDb();
        // Log current inventory
        console.table(products.list);

        let selectingProduct = true;
        while (selectingProduct) {
            // Prompt user for product & qty to purchase
            const choices = await printOptions();

            // Determine if purchase option is valid
            const result = processOrderRequest(choices, products.data);
            console.log(result.message);

            if (!result.success) {
                continue;
            }

            selectingProduct = false;

            // Update product stock quantity to complete order
            DB.query(
                'UPDATE products SET ? WHERE ?',
                [
                    { stock_quantity: result.newQty },
                    { item_id: result.product.id }
                ],
                err => {
                    if (err) {
                        throw err;
                    }
                    console.log(`\nOrder complete! Total cost: ${result.total}`);
                    process.exit();
                }
            );
        }
    } catch (err) {
        throw err;
    }
}

// run app
run();

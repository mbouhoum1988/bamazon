const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect( (err) => {
    if (err) throw err;
    console.log(`connected as id: ${connection.threadId}\n`);
    displayItems();
})

const displayItems = () => {
    connection.query('select id, product_name, price, stock_quantity from products', (err, res) => {
        if (err) throw err;

        for (let i=0 ; i< res.length; i++) {
            console.log('id: '+ res[i].id + "         " + " product name: " + res[i].product_name +  "         " + " price: " + res[i].price + "         " + " stock quantity: " + res[i].stock_quantity);
        }
        console.log('\n'); 
        
        selectProduct();
 })
}

const selectProduct = () => {
    connection.query('select * from products', (err, res) => {
        if (err) throw err;

    inquirer 
    .prompt(
        [
        {
            name: "productId",
            type: "input",
            message: "Enter the product id you like to buy?",
            validate: (value) => {
                if ( (isNaN(value)===false) || (value < res.lenght ) ){
                    return true;
                }
                   return false;
            }
        },
    
        {
            name: "quantity",
            type: "input",
            message: "How much would you like to buy?",
            validate: (value) => {
                if (isNaN(value)===false) {
                    return true;
                }
                   return false;
            }
        }
    ]
    ).then( (ans) => {
    
    let x = ans.productId;
    var stockPrice = res[x-1].price;
    let remaining = res[x-1].stock_quantity - ans.quantity; 
    var total = ans.quantity * stockPrice;
    let stock = res[x-1].stock_quantity;

    if ( (stock < ans.quantity) || (remaining < 0) ){
        console.log('         ');
        console.log('Insufficient quantity!\n');
        selectProduct();
    }
    else{
       connection.query('update products set ? where ?', 
       [
         {
             stock_quantity: remaining
         },
         {
             id: ans.productId
         }
       ], (err, res) => {
           if (err) throw err;
           updatedtable();
           console.log('');
           console.log(`you total cost for this transaction is: $${total}`);
           console.log('');
           console.log('the updated products table is: \n')
         
           connection.end();

       })
      
    } 
    })
})
}

const updatedtable = () => {
    connection.query('select id, product_name, price, stock_quantity from products',(err, res) => {
        if (err) throw err;
        // console.log(data);
        for (let i=0 ; i< res.length; i++) {
            console.log('id: ' + res[i].id + "         " + " product name: " + res[i].product_name +  "         " + " price: " + res[i].price + "         " + " stock quantity: " + res[i].stock_quantity);
        }
       
    })
}
# **Bamazon Store** :shopping_cart:

### Bamazon is a simple CLI app that allows you to "purchase" one or more items using Node and a mysql database. See usage details and examples below.

## **Requirements**

#### This app requires a connection to a mysql database with the following schema:

##### Table: products

| Column          | Data Type   |
| --------------- | ----------- |
| item_id         | int*        | 
| product_name    | varchar(50) |
| department_name | varchar(50) |
| price           | float       |
| stock_quantity  | int         |

## **Usage**

#### To use this app, simply launch the bamazonCustomer.js file with Node. This will retrieve the current inventory from the products table. Next, a prompt will appear requiring a product to be selected (by id) and a quantity specified. Once this has been done, then the product quantity is updated in the database and a total cost is output to the console.

## **Examples**

### Purchasing an item
![purchase gif](https://media.giphy.com/media/gIHEchVCr9zJcNNifS/giphy.gif)

### Insufficient quantity error
![purchase gif](https://media.giphy.com/media/mEze5lRPzhw3MxMlHc/giphy.gif)

## Overview + Demo video on Youtube
[![Youtube video](https://img.youtube.com/vi/TSV1xhCYCRg/0.jpg)](https://www.youtube.com/watch?v=TSV1xhCYCRg)

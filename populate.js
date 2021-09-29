require('dotenv').config()

const connectDB = require('./src/db/connect');
const Product = require('./src/models/products');

const jsonProducts = require('./products.json');

const start = async () => {
    try {
        await connectDB(`mongodb://localhost:27017/${process.env.MONGODB_DATABASE}`);
        await Product.deleteMany();
        await Product.create(jsonProducts);
        console.log('success!!');
        process.exit(0);
    } catch (error) {   
        console.log(error);
        process.exit(0);
    }
}

start();
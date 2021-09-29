const Product = require('../models/products');


const getAllProductsStatic = async (req, res) => {
    const products = await Product.find().select('name price');

    res.status(200).json({
        products, 
        nbHits: products.length
    });
}
const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numbericFilters } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if (numbericFilters) {
        const operatorMap = {
            '=': '$eq',
            '>': '$gt',
            '>=': '$gte',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numbericFilters.replace(regEx, (match) => 
            `-${operatorMap[match]}-`
        )
        console.log({filters});

        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [ field, operator, value] = item.split('-');
            if (options.includes(field)){
                queryObject[field] = { [operator]: Number(value)}
            }
        })
    }
    console.log({ queryObject });
    let result = Product.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result =  result.sort(sortList);
    } else {
        result =  result.sort('createAt');
    }
    if (fields) {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }
   

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
 
    result = result.limit(limit).skip(skip);
    const products = await result;
    res.status(200).json({
        products, 
        nbHits: products.length
    });
};

module.exports = {
    getAllProducts,
    getAllProductsStatic
}
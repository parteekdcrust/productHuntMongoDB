const ProductDAO = require('../dao/productDAO');

const addTag= async(inputBody) =>{
    return await ProductDAO.addTagToDB(inputBody);
}


module.exports= {addTag };
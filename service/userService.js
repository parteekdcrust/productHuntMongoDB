const ProductDAO = require('../dao/productDAO');

const addUser= async(inputBody) =>{
    return await ProductDAO.addUserToDB(inputBody);
}
module.exports={addUser};
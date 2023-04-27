const ProductDAO = require('../dao/productDAO');

const getProductById = async (id) =>{
    return await ProductDAO.getProductFromDBById(id);
}
const getProduct=async (page,limit)=>{
    return await ProductDAO.getProductFromDB(page,limit);
}
const addProduct = async (inputBody)=>{
    return await ProductDAO.addProductToDB(inputBody); 
} 

const changeProduct = async(id,inputBody)=>{
    return await ProductDAO.changeProductToDB(id,inputBody);
}

const deleteProduct = async (id,inputBody)=>{
    return await ProductDAO.deleteProductFromDB(id,inputBody);
}
const updateComment = async(inputBody,id)=>{
    const flag = inputBody.flag;
    if(flag) return await ProductDAO.addCommentToProduct(inputBody,id);
    else return await ProductDAO.removeCommentfromProduct(inputBody,id);
     
}
const updateTag = async(inputBody,id)=>{
    const flag = inputBody.flag;
    if(flag) return await ProductDAO.addTagToProduct(inputBody,id);
    else return await ProductDAO.removeTagfromProduct(inputBody,id);
     
}
module.exports = {getProductById,getProduct,addProduct,changeProduct,deleteProduct,updateComment,updateTag};
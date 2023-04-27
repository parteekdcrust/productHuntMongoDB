const ProductDAO = require('./productDAO');


const getProductById = async (id) =>{
    return await ProductDAO.getProductFromDBById(id);
}
const getProduct=async (page,limit)=>{
    return await ProductDAO.getProductFromDB(page,limit);
}

const addProduct = async (inputBody)=>{
    return await ProductDAO.addProductToDB(inputBody); 
} 
const addTag= async(inputBody) =>{
    return await ProductDAO.addTagToDB(inputBody);
}
const addUser= async(inputBody) =>{
    return await ProductDAO.addUserToDB(inputBody);
}
const addComment = async(inputBody,id)=>{
    return await ProductDAO.addCommentToProduct(inputBody,id);
}


const updateTags = async(inputBody,id)=>{
    return await ProductDAO.addTagToProduct(inputBody,id);
} 
const changeProduct = async(id,inputBody)=>{
    return await ProductDAO.changeProductToDB(id,inputBody);
}

const deleteProduct = async (id,inputBody)=>{
    return await ProductDAO.deleteProductFromDB(id,inputBody);
}



module.exports={addProduct,addTag,addUser,deleteProduct, getProductById, getProduct, addComment, updateTags,changeProduct};
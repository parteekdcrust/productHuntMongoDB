const mongoose = require('mongoose');
const Product = require('./collections/Product');
const Tag = require('./collections/Tag');
const User = require('./collections/User');

mongoose.connect('mongodb://localhost:27017/productHuntDB');

const addProductToDB = async (inputBody)=>{
    try 
    {
        const product = await Product.create({
            name:inputBody["name"],
            visitUrl:inputBody["visitUrl"],
            iconUrl: inputBody["iconUrl"],
            longDescription: inputBody["longDescription"],
            shortDescription: inputBody["shortDescription"],
            createdOn:inputBody["createdOn"],
            updatedOn:inputBody["updatedOn"],
            createdBy:inputBody["createdBy"],
            updatedBy:inputBody["updatedBy"],
            tags:[...inputBody["tags"]],
            comments:[...inputBody["comments"]],
            images:[...inputBody["images"]],
            upvoters:[...inputBody["upvoters"]]
        })
        console.log(product);
        return product;
    } 
    catch (error) 
    {
        console.log(error.message);
        return;
    }

}

const addTagToDB =async (inputBody)=>{
    try 
    {
        const tag = await Tag.create({
            name:inputBody["name"]
        })
        console.log(tag);
        return tag;
    } 
    catch (error) 
    {
        console.log(error.message);
        return;
    }
    
}

const addUserToDB = async (inputBody)=>{
    try 
    {
        const user = await User.create({
            name:inputBody["name"],
            email:inputBody["email"],
            password:inputBody["password"]
        })
        console.log(user);
        return user;
    } 
    catch (error) 
    {
        console.log(error.message);
        return;
    }
    
}
 
//add comment to product
const addCommentToProduct = async(inputBody,id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error("Product not found");
    }
    const user = await User.findById(inputBody["createdBy"]);
    if (!user) {
        throw new Error("User not found");
    }
    const comment = { createdBy: inputBody["createdBy"], desp: inputBody["desp"] };
    product["comments"] = [...product["comments"],comment];  
    product["updatedOn"] = Date.now();
    await product.save();
    return comment;
};

//add tag to product
const addTagToProduct = async(inputBody,id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error("Product not found");
    }
    
    const tagId = inputBody["id"];
    product["tags"]= [...product["tags"],tagId];
    product["updatedOn"] = Date.now();
    await product.save();
    return product;
};


const deleteProductFromDB= async(id,inputBody) =>{
    try {
        const product = await Product.findById(id);
        if(!product) throw new error;

        if(!(product["createdBy"] == inputBody["user"])) throw new Error("User not authorized");

        const result=await Product.deleteOne({_id:`${id}`})
        await Product.save();
        return result;
    } catch (error) {
        console.log(error.message);
        return;

    }
}



const getProductFromDBById= async (id) =>{
    try {
        const result = await Product.find({_id:`${id}`})
        // console.log(result);
        if(!result[0]) throw new ReferenceError({message:"Product not found"});
        return result;
    } catch (error) {
        console.log(error.message);
        return;
    }
}


const getProductFromDB = async (page,limit)=>{
    try {
        const skipIndex = (page - 1) * limit;    //limit set to 10 by default
        const products = await Product.aggregate([
            {
              $project: {
                name: 1,
                iconUrl: 1,
                visitUrl: 1,
                shortDescription:1,
                tags:1,
                createdOn:1,
                commentsCount: { $size: "$comments" },
                upvotesCount: { $size: "$upvoters" },
              }
            },
              { $skip: skipIndex },
              { $limit: limit },
            ])
        if(!products[0]) throw new Error("Products not found");
        return products;
    } catch (error) {
        console.log(error.message);
        return;
        
    }
}

const changeProductToDB = async (id,inputBody) =>{
    try {
        const filter = {_id : id};
        const update=inputBody;
        console.log(update);

        let product = await Product.findOneAndUpdate(filter,update);
        product=await Product.findOne(filter);
        return product; 
    } catch (error) {
        console.log(error.message);
        return;
    }

}

module.exports= {addProductToDB, addTagToDB, addUserToDB,deleteProductFromDB,getProductFromDBById,getProductFromDB, addCommentToProduct,addTagToProduct,changeProductToDB};


/////////////////





// //// delete a product and only deleted by who create it
// productSchema.methods.deleteProduct = async function(userId) {
//     if (this.createdBy.equals(userId)) {
//         const deletedProduct = await this.model("Product").findOneAndDelete({
//             _id: this._id,
//         });
//         return deletedProduct;
//     } else {
//         throw new Error("User is not authorized to delete this product");
//     }
// };

// /// edit a product and only created by user is allowed to edit it
// productSchema.methods.editProduct = async function(userId, productData) {
//     if (this.createdBy.equals(userId)) {
//         const updatedProduct = await this.model("Product").findOneAndUpdate({ _id: this._id }, { $set: productData }, { new: true });
//         return updatedProduct;
//     } else {
//         throw new Error("User is not authorized to edit this product");
//     }
// };

// /// function to remove a tag from product

// productSchema.methods.removeTag = async function(tagId) {
//     const tagIndex = this.tags.indexOf(tagId);
//     if (tagIndex !== -1) {
//         const updatedProduct = await this.model("Product").findOneAndUpdate({ _id: this._id }, { $pull: { tags: tagId } }, { new: true });
//         return updatedProduct;
//     } else {
//         throw new Error("Tag not found on product");
//     }
// };

// // const productId = "myproductid";
// // const tagId = "mytagid";

// // const product = await Product.findById(productId);
// // try {
// //     const updatedProduct = await product.removeTag(tagId);
// //     console.log(updatedProduct); // will output the updated product document
// // } catch (err) {
// //     console.error(err.message); // will output "Tag not found on product"
// // }

// /////add a tag to a product

// productSchema.methods.addTag = async function(tagId) {
//     const tagExists = this.tags.includes(tagId);
//     if (!tagExists) {
//         const updatedProduct = await this.model("Product").findOneAndUpdate({ _id: this._id }, { $addToSet: { tags: tagId } }, { new: true });
//         return updatedProduct;
//     } else {
//         throw new Error("Tag already exists on product");
//     }
// };

// //// upvote
// productSchema.methods.upvote = async function(userId) {
//     const userUpvoted = this.upvotes.includes(userId);
//     if (!userUpvoted) {
//         const updatedProduct = await this.model("Product").findOneAndUpdate({ _id: this._id }, { $addToSet: { upvotes: userId }, $inc: { upvoteCount: 1 } }, { new: true });
//         return updatedProduct;
//     } else {
//         throw new Error("User already upvoted this product");
//     }
// };

// ///downvote
// productSchema.methods.downvote = async function(userId) {
//     const userUpvoted = this.upvotes.includes(userId);
//     if (userUpvoted) {
//         const updatedProduct = await this.model("Product").findOneAndUpdate({ _id: this._id }, { $pull: { upvotes: userId }, $inc: { upvoteCount: -1 } }, { new: true });
//         return updatedProduct;
//     } else {
//         throw new Error("User did not upvote this product");
//     }
// };

// // total count

// ProductSchema.methods.countUpvotes = async function() {
//     const count = await this.model("Product")
//         .countDocuments({ _id: this._id, upvotes: { $exists: true } })
//         .exec();
//     return count;
// };

// ProductSchema.methods.countDownvotes = async function() {
//     const count = await this.model("Product")
//         .countDocuments({ _id: this._id, downvotes: { $exists: true } })
//         .exec();
//     return count;
// };

// ProductSchema.methods.countTotalVotes = async function() {
//     const upvotes = await this.countUpvotes();
//     const downvotes = await this.countDownvotes();
//     return upvotes - downvotes;
// };
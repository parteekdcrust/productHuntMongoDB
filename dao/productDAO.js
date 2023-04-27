const mongoose = require('mongoose');
const Product = require('../model/Product');
const Tag = require('../model/Tag');
const User = require('../model/User');

mongoose.connect('mongodb://localhost:27017/productHuntDB');

const addProductToDB = async (inputBody)=>{
    try 
    {
        const product = await Product.create({
            name:inputBody.name,
            visitUrl:inputBody.visitUrl,
            iconUrl: inputBody.iconUrl,
            longDescription: inputBody.longDescription,
            shortDescription: inputBody.shortDescription,
            createdOn:inputBody.createdOn,
            updatedOn:inputBody.updatedOn,
            createdBy:inputBody.createdBy,
            updatedBy:inputBody.updatedBy,
            tags:[...inputBody.tags],
            comments:[...inputBody.comments],
            images:[...inputBody.images],
            upvoters:[...inputBody.upvoters]
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

const deleteProductFromDB= async(id,inputBody) =>{
    try {
        const product = await Product.findById(id);
        if(!product) throw new Error("Product not found");

        if(product.createdBy != inputBody.user) throw new Error("User not authorized to delete this product");

        const result=await Product.deleteOne({_id:id})
        // await Product.save();
        return result;
    } catch (error) {
        console.log(error.message);
        return;

    }
}

//add comment to product
const addCommentToProduct = async(inputBody,id) => {

    try {
        const product = await Product.findById(id);//checking product exists or not
        if (!product) {
            throw new Error("Product not found");
        }
        const user = await User.findById(inputBody.comment.createdBy); //checking user exists or not
        if (!user) {
            throw new Error("User not found");
        }
        const commentToAdd = { 
            createdBy: inputBody.comment.createdBy,
            desp: inputBody.comment.desp 
        };

        const filter = {_id:id};
        const update = {
            comments : [...product.comments,commentToAdd],
            updatedOn: Date.now()
        }  
        let updatedProduct = await Product.findOneAndUpdate(filter,update,{new:true});

        return commentToAdd;
    } catch (error) {
        console.log(error.message);
        return;
    }
};

const removeCommentfromProduct = async(inputBody,id) =>{
    try {
        const product = await Product.findById(id); //checking if product exists or not
        if (!product) {
            throw new Error("Product not found");
        }
        const user = await User.findById(inputBody.comment.user);//checking if user exists or not
        if (!user) {
            throw new Error("User not authenticated");
        }
        if(product.createdBy != inputBody.comment.user)  throw new Error("User not authorized");//check if user is the creator of product

        const result = await Product.updateOne({_id:id},{$pull: {"comments":{ "_id":inputBody.comment.id }}}) ;
        return result;
    } catch (error) {
        console.log(error.message);
        return;
    }

}




const addTagToProduct = async(inputBody,id) => {

    try {
        const product = await Product.findById(id);//checking product exists or not
        if (!product) {
            throw new Error("Product not found");
        }
        const user = await User.findById(inputBody.user); //checking user exists or not
        if (!user) {
            throw new Error("User not found");
        }
        const tag = await Tag.findById(inputBody.tag.id);//check if tag exists or not
        if (!tag) {
            throw new Error("Tag not found");
        }
        if(product.tags.includes(inputBody.tag.id)) throw new Error("Tag already exists")//check if tag already exists or not 

        const filter = {_id:id};
        const update = {
            tags : [...product.tags,inputBody.tag.id],
            updatedOn: Date.now()
        }  
        let updatedProduct = await Product.findOneAndUpdate(filter,update,{new:true});

        return updatedProduct;
    } catch (error) {
        console.log(error.message);
        return;
    }
};

const removeTagfromProduct = async(inputBody,id) =>{
    try {
        const product = await Product.findById(id); //checking if product exists or not
        if (!product) {
            throw new Error("Product not found");
        }
        const user = await User.findById(inputBody.user);//checking if user exists or not
        if (!user) {
            throw new Error("User not authenticated");
        }
        if(!product.tags.includes(inputBody.tag.id)) throw new Error("Tag not found")//check if tag already exists or not 
        const updatedTags=product.tags
        const index = updatedTags.indexOf(inputBody.tag.id);
        const x = updatedTags.splice(index, 1);
        const result = await Product.findByIdAndUpdate({_id:id},{tags:updatedTags},{new:true});

        return result;
    } catch (error) {
        console.log(error.message);
        return;
    }

}

const addTagToDB =async (inputBody)=>{
    try 
    {
        const tag = await Tag.create({
            name:inputBody.name
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
            name:inputBody.name,
            email:inputBody.email,
            password:inputBody.password
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
        const product = await Product.findById(id); //checking if product exists or not
        if (!product) {
            throw new Error("Product not found");
        }
        const userinDB = await User.find({_id:inputBody.user}); //checking if product exists or not
        console.log(userinDB);
        if (!userinDB) {
            throw new Error("User not authenticated");
        }
        if(product.createdBy != inputBody.user) throw new Error("User not authorized to change the product")
        
        const filter = {_id : id};
        const update={
            ...(inputBody.productBody),
            updatedOn:Date.now(),
            updatedBy:inputBody.productBody.user
        };

        let result = await Product.findOneAndUpdate(filter,update,{new:true});
        return result; 
    } catch (error) {
        console.log(error.message);
        return;
    }

}

module.exports= {addProductToDB, addTagToDB, addUserToDB,deleteProductFromDB,getProductFromDBById,getProductFromDB, addCommentToProduct, removeCommentfromProduct,addTagToProduct,changeProductToDB,addTagToProduct,removeTagfromProduct};


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
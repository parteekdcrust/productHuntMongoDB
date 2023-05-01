const mongoose = require("mongoose");
try {
  mongoose.connect("mongodb://localhost:27017/productHuntDB");
} catch (error) {
  console.log(error.message);
  return;
}
const { Product } = require("../model/product");
const Tag = require("../model/tag");
const User = require("../model/user");

//1.(a) add product to database
const addProductToDB = async (product) => {
  try {
    const result = await product.save();
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//1.(b) delete product from database
const deleteProductFromDB = async (id, inputBody) => {
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found in the database");

    const currUser = await User.findById(inputBody.user);
    if (!currUser)
      throw new Error("User is not authenticated (Log in or Sign up again)!");

    if (product.createdBy != inputBody.user)
      throw new Error(
        "User is authenticated but not authorized to delete this product"
      );

    const result = await Product.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//1.(c) modify product to database
const changeProductToDB = async (id, inputBody) => {
  try {
    const product = await Product.findById(id); //checking if product exists or not
    if (!product) {
      throw new Error("Product not found");
    }
    const currUser = await User.findById(inputBody.user); //checking if product exists or not
    if (!currUser) {
      throw new Error("User is not authenticated (Log in or Sign up again)!");
    }
    if (product.createdBy != inputBody.user)
      throw new Error(
        "User is authenticated but not authorized to modify the product"
      );

    const filter = { _id: id };
    const update = {
      ...inputBody.productBody,
      updatedOn: Date.now(),
      updatedBy: inputBody.user,
    };

    let result = await Product.updateOne(filter, update, { new: true });
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//1.(d) update comments in product

//add comment to product
const addCommentToProduct = async (id, inputBody, comment) => {
  try {
    const product = await Product.findById(id); //checking product exists or not
    if (!product) {
      throw new Error("Product not found");
    }
    const currUser = await User.findById(inputBody.user); //checking user exists or not
    if (!currUser) {
      throw new Error("User is not authenticated (Log in or Sign up again)!");
    }
    // const commentToAdd = {
    //     createdBy: inputBody.comment.createdBy,
    //     desp: inputBody.comment.desp
    // };

    const filter = { _id: id };
    const update = {
      comments: [...product.comments, comment],
      updatedOn: Date.now(),
    };
    let updatedProduct = await Product.updateOne(filter, update, { new: true });

    return updatedProduct;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//remove comment from product
const removeCommentfromProduct = async (id, inputBody) => {
  try {
    const product = await Product.findById(id); //checking if product exists or not
    if (!product) {
      throw new Error("Product not found");
    }
    const currUser = await User.findById(inputBody.user); //checking if user exists or not
    if (!currUser) {
      throw new Error("User is not authenticated (Log in or Sign up again)!");
    }
    if (product.createdBy != inputBody.user)
      throw new Error(
        "User is authenticated but not authorized to delete this comment"
      ); //check if user is the creator of product

    const comment = await Product.findOne({
      "comments._id": inputBody.commentBody.id,
    });
    if (!comment)
      throw new Error(
        "Comment you want to delete doesnot exists in the database !"
      ); //checking if comment exists or not
    const result = await Product.updateOne(
      { _id: id },
      { $pull: { comments: { _id: inputBody.commentBody.id } } }
    );
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//1.(e)update tag in product

//add tag in product
const addTagToProduct = async (id,inputBody) => {
  try {
    const product = await Product.findById(id); //checking product exists or not
    if (!product) {
      throw new Error("Product not found");
    }
    const currUser = await User.findById(inputBody.user); //checking user exists or not
    if (!currUser) {
      throw new Error("User is not authenticated (Log in or Sign up again)!");
    }
    const tag = await Tag.findById(inputBody.tagBody.id); //check if tag exists or not
    if (!tag) {
      throw new Error("Tag doesnot exists");
    }
    if (product.tags.includes(inputBody.tagBody.id))
      throw new Error("Tag already exists"); //check if tag already exists or not

    const filter = { _id: id };
    const update = {
      tags: [...product.tags, inputBody.tagBody.id],
      updatedOn: Date.now(),
      updatedBy:inputBody.user
    };
    let updatedProduct = await Product.updateOne(filter, update, { new: true });

    return updatedProduct;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

//remove tag from product
const removeTagfromProduct = async (id, inputBody) => {
  try {
    const product = await Product.findById(id); //checking if product exists or not
    if (!product) {
      throw new Error("Product not found");
    }
    const currUser = await User.findById(inputBody.user); //checking if user exists or not
    if (!currUser) {
      throw new Error("User not authenticated");
    }
    if (!product.tags.includes(inputBody.tagBody.id))
      throw new Error("Tag not found in product"); //check if tag already exists or not

    const updatedTags = product.tags;
    const index = updatedTags.indexOf(inputBody.tagBody.id);
    const x = updatedTags.splice(index, 1);

    const filter = { _id: id };
    const update = {
      tags: updatedTags,
      updatedOn: Date.now(),
      updatedBy:inputBody.user
    };
    const result = await Product.updateOne(filter, update, {
      new: true,
    });
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const getProductById= async (id) =>{
    try {
        const result = await Product.findById(id);
        if(!result) throw new Error("Product not found");
        return result;
    } catch (error) {
        console.log(error.message);
        return;
    }
}

const getProduct = async (page,limit)=>{
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



module.exports = {
  addProductToDB,
  deleteProductFromDB,
  changeProductToDB,
  addCommentToProduct,
  removeCommentfromProduct,
  addTagToProduct,
  removeTagfromProduct,
  getProductById,
  getProduct
};

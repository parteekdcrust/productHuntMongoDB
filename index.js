require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require("./utils/dbutils");

const ProductService = require("./service/product_service");
const TagService = require("./service/tag_service");
const UserService = require("./service/user_service");
const { Product } = require("./model/product");
const { Comment } = require("./model/product");
const Tag = require("./model/tag");
const User = require("./model/user");

////1. PRODUCT REQUESTS

//1.(a) Add new product
app.post("/products", async (req, res) => {
  try {
    const inputBody = req.body;
    const product = new Product(inputBody); //making new product using "new" keyword
    const result = await ProductService.addProductToDB(product);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//1.(b) Delete product by id
app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const inputBody = req.body;
    const result = await ProductService.deleteProductFromDB(id, inputBody);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//1.(c) Modify product
app.patch("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const inputBody = req.body;
    const result = await ProductService.changeProductToDB(id, inputBody);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//1.(d) Add/remove comment to/from product
app.patch("/products/:id/comment", async (req, res) => {
  try {
    const id = req.params.id;
    const inputBody = req.body;
    let result;
    if (inputBody.flag) {
      const comment = new Comment(inputBody.commentBody); //making new comment using "new" keyword
      result = await ProductService.addCommentToProduct(id, inputBody, comment);
    } else {
      result = await ProductService.removeCommentfromProduct(id, inputBody);
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//1.(e) Add/remove tag to/from product.
app.patch("/products/:id/tag", async (req, res) => {
  try {
    const inputBody = req.body;
    const id = req.params.id;
    let result;
    if (inputBody.flag) {
      result = await ProductService.addTagToProduct(id, inputBody);
    } else {
      result = await ProductService.removeTagfromProduct(id, inputBody);
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//1.(f) Get detailed product
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await ProductService.getProductById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

//1.(g) Get homepage product
app.get("/products/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await ProductService.getProduct(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

////2.TAG REQUESTS

//2.(a)add new tag
app.post("/tags", async (req, res) => {
  try {
    const inputBody = req.body;
    const tag = new Tag(inputBody);
    const result = await TagService.addTag(tag);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//2.(b) Delete tag
app.delete("/tags/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await TagService.deleteTag(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//2.(c) get tag from db
app.get("/tags", async (req, res) => {
  try {
    const result = await TagService.getTagFromDB();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//2.(d) get tag by id from db
app.get("/tags/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await TagService.getTagByIdFromDB(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

////3. USER REQUESTS

//3.(a) Add new user
app.post("/users", async (req, res) => {
  try {
    const inputBody = req.body;
    const user = new User(inputBody);
    const result = await UserService.addUser(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//3.(b) Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await UserService.deleteUser(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//3.(c) get user from db
app.get("/users", async (req, res) => {
  try {
    const result = await UserService.getUserFromDB();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//3.(d) get user by id from db
app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await UserService.getUserByIdFromDB(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

//3.(e) modify user in db

app.patch("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const inputBody = req.body;
    const result = await UserService.modifyUser(id, inputBody);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

////PORT LISTEN/////
app.listen(port, () => {
  console.log(`Product app listening on port ${port}`);
});

const express = require("express");
const ProductService = require('./service/productService');
const TagService = require('./service/tagService');
const UserService = require('./service/userService');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


////1. PRODUCT REQUESTS

//1.(a) Add new product
app.post('/products',async (req,res)=>{
    const inputBody = req.body;
    const result = await ProductService.addProduct(inputBody);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);
})


//1.(b) Add/remove comment to/from product
app.patch('/products/:id/comment',async (req,res)=>{
    const id=req.params.id;
    const inputBody = req.body;
    const result = await ProductService.updateComment(inputBody,id);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);

})

//1.(c) Add/remove tag to/from product
app.patch('/products/:id/tag',async (req,res)=>{
    const inputBody = req.body;
    const id=req.params.id;
    const result = await ProductService.updateTag(inputBody,id);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);

})

//1.(d) Delete product by id 
app.delete('/products/:id',async (req,res)=>{
    const id=req.params.id;
    const inputBody=req.body;
    const result = await ProductService.deleteProduct(id,inputBody);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(200).json(result);
})

//1.(e) Get detailed product 
app.get('/products/:id',async (req,res)=>{
    const id = req.params.id;
    // console.log(id);
    const result = await ProductService.getProductById(id);
    if(!result) res.status(404).json({
        message:"error occured"
    })
    else res.status(200).json(result); 
})

//1.(f) Get homepage product
app.get('/products/',async (req,res)=>{

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await ProductService.getProduct(page,limit);
    if(!result) res.status(404).json({
        message:"error occured"
    })
    else res.status(200).json(result); 
})


//1.(g) Modify product
app.patch('/products/:id',async (req,res)=>{
    const id = req.params.id;
    const inputBody= req.body;
    const result= await ProductService.changeProduct(id,inputBody);
    if(!result) res.status(400).json({
        message: "error occured"
    })
    else res.status(201).json(result);
})


////2.TAG REQUESTS

//2.(a)add new tag
app.post('/tags',async (req,res)=>{
    const inputBody=req.body;
    const result = await TagService.addTag(inputBody);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);
})

////3. USER REQUESTS

//3.(a) Add new user
app.post('/users',async (req,res)=>{
    const inputBody=req.body;
    const result = await UserService.addUser(inputBody);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);

})


////PORT LISTEN/////
app.listen(port, () => {
    console.log(`Product app listening on port ${port}`);
  });
  


  /////remove tag //update///upvote downvote///
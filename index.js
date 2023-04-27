const express = require("express");
const ProductService = require("./productService");
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//add new product
app.post('/products',async (req,res)=>{
    const inputBody = req.body;
    const result = await ProductService.addProduct(inputBody);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);
})

//add new tag
app.post('/tags',async (req,res)=>{
    const inputBody=req.body;
    const result = await ProductService.addTag(inputBody);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);
})

//add new user
app.post('/users',async (req,res)=>{
    const inputBody=req.body;
    const result = await ProductService.addUser(inputBody);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);

})

//add comment to product
app.post('/products/:id/comment',async (req,res)=>{
    const inputBody = req.body;
    const id=req.params.id;
    const result = await ProductService.addComment(inputBody,id);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);

})


//add tag to product
app.post('/products/:id/tag',async (req,res)=>{
    const inputBody = req.body;
    const id=req.params.id;
    const result = await ProductService.updateTags(inputBody,id);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(201).json(result);

})



//delete product by id 
app.delete('/products/:id',async (req,res)=>{
    const id=req.params.id;
    const inputBody=req.body;
    const result = await ProductService.deleteProduct(id,inputBody);
    if(!result) res.status(400).json({
        message:"error occured"
    })
    else res.status(200).json(result);
})



//get detailed product 
app.get('/products/:id',async (req,res)=>{
    const id = req.params.id;
    // console.log(id);
    const result = await ProductService.getProductById(id);
    if(!result) res.status(404).json({
        message:"error occured"
    })
    else res.status(200).json(result); 
})

//get homepage product
app.get('/products/',async (req,res)=>{

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await ProductService.getProduct(page,limit);
    if(!result) res.status(404).json({
        message:"error occured"
    })
    else res.status(200).json(result); 
})


//modify product
app.patch('/products/:id',async (req,res)=>{
    const id = req.params.id;
    const inputBody= req.body;
    const result= await ProductService.changeProduct(id,inputBody);
    if(!result) res.status(400).json({
        message: "error occured"
    })
    else res.status(201).json(result);
})



////PORT LISTEN/////
app.listen(port, () => {
    console.log(`Product app listening on port ${port}`);
  });
  


  /////remove tag //update///upvote downvote///
const mongoose=require('mongoose');


const CommentSchema= new mongoose.Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    desp:{
        type:String,
        minlength:1,
        maxlength:200,
        trim:true,
    }
});

const ProductSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique : true,
        minlength:1,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9 ]*$/.test(v);
            },
            message: (props) =>
                `${props.value} contains special characters, only alphanumeric characters and spaces are allowed!`,
        },
    },

    visitUrl: {
        type: String,
        required: true,
        trim: true,
        unique : true,
        match: /^(http|https):\/\/[^ "]+$/
    },

    iconUrl: {
        type: String,
        required: true,
        trim: true,
        match: /^(http|https):\/\/[^ "]+$/
    },

    shortDescription: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9 ]*$/.test(v);
            },
            message: (props) =>
                `${props.value} contains special characters, only alphanumeric characters and spaces are allowed!`,
        },
    },

    longDescription: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9 ]*$/.test(v);
            },
            message: (props) =>
                `${props.value} contains special characters, only alphanumeric characters and spaces are allowed!`,
        },
    },

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],

    comments:[CommentSchema],
    
    images : [String],

    upvoters:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    createdOn:{
        type : Date,
        default: Date.now(),
        immutable: true
    },

    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        immutable: true
    },

    updatedOn:{
        type : Date,
        default: Date.now()
    },
    
    updatedBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

});



module.exports= mongoose.model("Product",ProductSchema);

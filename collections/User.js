const mongoose=require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required: true,
        unique:true,
        validate: {
            validator: function(v) {
              return /^[a-zA-Z0-9 ]*$/.test(v);
            },
            message: props => `${props.value} contains special characters, only alphanumeric characters and spaces are allowed!`
          },
    },
    email: {
        type: String,
        trim:true,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    }
});


module.exports= mongoose.model("User",UserSchema);
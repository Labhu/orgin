/**
 * Model Definition File
 */

/**
 * System and 3rd Party libs
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt= require('bcrypt');
const _= require('lodash');
const jwt =require('jsonwebtoken');
const validator  = require('validator');
/**
 * Schema Definition
 */

const UserSchema = new Schema({

    // name: Schema.Types.String,
    // email: Schema.Types.String,
    // address :  Schema.Types.String,
    // phone_no : Schema.Types.Number,
    // password: Schema.Types.String


    email :{
      type : String,
      required : true, 
      minlength : 3,
      trim : true,
      unique : true,

      validate: {
        validator : validator.isEmail,
           message : '{value} is not valid email'
      }
  },
  


  name :{ 
    type : String,
  required : true, 
  minlength : 3,
  trim : true

},

    address : {
        type : String,
      required : true, 
      minlength : 7,
      trim : true

    },

    phone_no : { type : Number,
        required : true, 
        minlength : 10,
        trim : true

    },
  
  password : {
  type : String,
  required : true,
   minlength : 5
  },
  
  tokens : [
  { access : { type : String,  required: true } ,
    token : { type: String , required: true }
  }]
  });

  UserSchema.methods.toJSON= function () {
     var user = this;
     var userObject= user.toObject();
     return _.pick(userObject, ['id' , 'email', 'name' , 'address' , 'phone_no' ,'password']);

  };


  //token generate........

UserSchema.methods.generateAuthToken = function() {
console.log("hsjjsbjb")
  var user =this;

  var access= 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access} ,'abc123').toString();

  user.tokens.push({ access , token});
  return user.save().then( () => {
    return token;
  }) 
};


// find token...

UserSchema.statics.findByToken = function(token)  
{

  var User=this;
  var decoded;

  try{
   decoded =  jwt.verify(token , 'abc123');

  }catch(e) {

    return Promise.reject('rejected');
  }
  
return  User.findOne({

  
    '_id': decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'

   
  });

};




// hashing password...........


UserSchema.pre('save',function(next) {  
  var user=this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password ,salt, (err ,hash) => {
         user.password=hash;
         next();
      })
    })

  }else{
    next();
  }
});



//logging in post..........

UserSchema.statics.findByCredentials =  function (email, password) {

  var User= this;
   

   return  User.findOne({email}).then ( (user) => {
      console.log(user)
   if(!user) {
           
      return  Promise.reject(); 
  }

    return new Promise( (resolve, reject) => { 

      bcrypt.compare(password, user.password, (err,res) => {
           console.log(res);

                // console.log(` ${password}  :  ${user.password}`);
                console.log(err);

        if(res) { 

         var access= 'auth';
          var token = jwt.sign({ _id: user._id.toHexString(), access} ,'abc123').toString();

           user.tokens.push({ access , token});
             return user.save().then( () => {
                      return token; } );

          resolve(user);

        } else{ 
             reject (); }

      })

    });

  })

}



/**
 * Export Schema
 */

module.exports = mongoose.model('User', UserSchema);
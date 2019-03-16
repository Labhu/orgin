const express = require('express');
const router = express.Router();
const _= require('lodash');
const request = require('request') 
var  User  = require('../models/user.model');



//  token generate
router.post('/user/post', (req, res, next) => {

    var body = _.pick (req.body , ['email', 'name' , 'address' , 'phone_no' ,'password']);

    console.log(body);

    var user = new User(body);

    user.generateAuthToken().then( (result) => {
        res.header('x-auth' ,result).send(user); 
     }).catch( (err) => {
               res.status(400).send(err)
     })
})


//Log in with authe......

router.post('/login' ,  (req, res) => {

    //console.log("user data" , req.user);

    var body  = _.pick( req.body, ['email' , 'password']);

     User.findByCredentials(body.email , body.password).then ((user) => {
      
        res.send(user);

        
        // var user= new User();

        user.generateAuthToken().then( (result) => {

             res.header('x-auth' ,result).send(tt); 
     })

         
   }).catch( (e) => {
        console.log( "error in login.." , e)
        res.status(400).send();

    });
})


module.exports = router;
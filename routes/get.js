const express = require('express');
const router = express.Router();
const _= require('lodash');
const request = require('request') 
var  User  = require('../models/user.model');
const {authenticate} = require('../services/authenticate');



const {ObjectID} = require('mongodb');
var obj = new ObjectID();
console.log(obj);


// fetch dataaa......

router.get('/get' , authenticate , (req,res) => {

    res.send(req.user);
} );



// private data

router.get('/private/:id' , authenticate,  (req,res) => {

     var id = req.params.id; 

    if(ObjectID.isValid(id)) {
    
        console.log('valid id..');
    } else

    {
     return res.status(404).send();
    } 

    User.findById(id) .then( (user) =>{

        console.log(user);

        //  res.send({user});

        var utoken= user.tokens[0].token;

        var reqtoken = req.user.tokens[0].token;


        if ( utoken == reqtoken ) { 

            res.send(res. user) ;

        } else {
            res.send(user.name);
        }

    })


} );

 

module.exports = router;
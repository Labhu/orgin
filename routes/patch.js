const express = require('express');
const router = express.Router();
const _= require('lodash');
const request = require('request') 
var  User  = require('../models/user.model'); 

const {ObjectID} = require('mongodb');
var obj = new ObjectID();
//console.log(obj);


//update data by id ...........
router.patch('/update/:id' , (req,res) => {
    
    var id = req.params.id;
    var body = _.pick(req.body, ['email', 'password']);

    if(!ObjectID.isValid(id)) 
    {
     return res.status(404).send();
    }

    User.findByIdAndUpdate(id, {$set : body}, {new: true}).then( (data) => {

    console.log(data);
    if(!data)
     {
         return res.status(404).send();
     }
  res.send({data});

}).catch( (err) => {
    res.status(400).send(); })

});



module.exports = router;
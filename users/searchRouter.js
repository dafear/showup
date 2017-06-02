const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const methodOverride = require('method-override');
const request = require('request');
const uuid = require('uuid');
const ObjectId = require('mongodb').ObjectID;



mongoose.Promise = global.Promise;



  router.use(bodyParser.urlencoded({ 
   extended: false, 
   parameterLimit: 1000000
 
 }));
  
 router.use(bodyParser.json());
 router.use(methodOverride());


const {Search} = require('../users/models.js');


 


   router.get('/searches', (req, res) => {
    Search
     .find()

      .limit(100)

     .exec()
     .then(searches => {
      
        res.status(200).json(searches)
       
    })
      .catch(
        err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
      });
  });




router.post('/searches', (req, res) => {

  const requiredFields = ['url', 'name', 'address', 'city'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Search
    .create({
      url: req.body.url,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,})
    .then(
      searches => res.status(201).json(searches.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});





const toUpdate = {};
const updateableFields = ['id', 'url', 'name', 'address', 'city'];




      router.put('/searches/:id', (req, res) => {

        console.log("i got here");
         console.log(req.params);
 
           if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
           
          const message = ( `Request path id (${req.params.id}) and request body id ` +
           `(${req.body.id}) must match`); 
           console.error(message);
            res.status(400).json({message: message});
     

          }

                   updateableFields.forEach(field => {
                     if (field in req.body) {
                   toUpdate[field] = req.body[field];
   
               }

          });
 
      

         Search
            .findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {$set: toUpdate})
            .exec()
            .then(searches => res.status(200).send(req.body))
            .catch(err => {
           console.log(err);
           res.status(500).json({message: 'Internal server error'})
        
        });
 
      });





          router.delete('/searches/:id', (req, res) => {
          Search
         .findByIdAndRemove(req.params.id)
         .exec()
         .then(searches => res.status(204).end())
         .catch(err => {
          console.log(err);
          res.status(500).json({message: 'Internal server error'});


        })

    });




 




module.exports = router;
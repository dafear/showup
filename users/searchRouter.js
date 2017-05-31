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

//router.use(bodyParser.json());

  router.use(bodyParser.urlencoded({ 
   extended: false, 
   parameterLimit: 1000000
 }));
  
  router.use(bodyParser.json());

 router.use(methodOverride());
//router.use(morgan('common'));

const {Search} = require('../users/models.js');


 // router.get('/savedSearches', (req, res) => {
   // res.json(savedSearches.get());
 // });


   router.get('/searches', (req, res) => {
    Search
     .find()
//      // we're limiting because restaurants db has > 25,000
//      // documents, and that's too much to process/return
      .limit(100)
// //     // `exec` returns a promise
     .exec()
// //     // success callback: for each restaurant we got back, we'll
// //     // call the `.apiRepr` instance method we've created in
// //     // models.js in order to only expose the data we want the API return.
     .then(searches => {
        res.json(searches)
        // searches: searches.map(
        //    (search) => search.apiRepr())
        // });
      })
      .catch(
        err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
      });
  });

// router.get('/showup/:id', (req, res) => {
//   Search
//     // this is a convenience method Mongoose provides for searching
//     // by the object _id property
//     .findById(req.params.id)
//     .exec()
//     .then(showup =>res.json(showup.apiRepr()))
//     .catch(err => {
//       console.error(err);
//         res.status(500).json({message: 'Internal server error'})
//     });
// });



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


// router.put('/shopping-list/:id', jsonParser, (req, res) => {
//   const requiredFields = ['id', 'url', 'name', 'address', 'city'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//   if (req.params.id !== req.body.id) {
//     const message = (
//       `Request path id (${req.params.id}) and request body id `
//       `(${req.body.id}) must match`);
//     console.error(message);
//     return res.status(400).send(message);
//   }
//   console.log(`Updating shopping list item \`${req.params.id}\``);
//   Search.update({
//     id: req.params.id,
//     url: req.body.url,
//     name: req.body.name,
//     address: req.body.address,
//     city: req.body.city
//   });
//   res.status(204).end();
// });














const toUpdate = {};
const updateableFields = ['id', 'url', 'name', 'address', 'city'];


 router.put('/searches/:id', (req, res) => {
//   // ensure that the id in the request path and the one in request body match
 console.log("i got here");
 console.log(req.params);
 //console.log(mongoose.Types.ObjectId('592b8c6dcbd5f5917dd243e'));
   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
     const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`); 

     console.error(message);
     res.status(400).json({message: message});
}
//const toUpdate = {};
//const updateableFields = ['url', 'name', 'address', 'city'];

    updateableFields.forEach(field => {
       if (field in req.body) {
        toUpdate[field] = req.body[field];
   
 }   
});
 Search
 // // //     // all key/value pairs in toUpdate will be updated -- that's what `$set` does
        .findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {$set: toUpdate})
         .exec()
         .then(searches => res.status(200).end(JSON.stringify(req.body)))
       .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'})
      });
 //    }
// updateableFields.forEach(field => {
//        if (field in req.body) {
//         toUpdate[field] = req.body[field];


 });



// Search.update({
//     id: req.params.id,
//     name: req.body.name,
//     budget: req.body.budget
//    });  

 //    const toUpdate = {};
 //     const updateableFields = ['url', 'name', 'address', 'city'];

 //    updateableFields.forEach(field => {
 //      if (field in req.body) {
 //        toUpdate[field] = req.body[field];
 //      }
 //    });

 //     Search
 // // //     // all key/value pairs in toUpdate will be updated -- that's what `$set` does
 //       .findByIdAndUpdate(req.params.id, {$set: toUpdate})
 //        .exec()
 //        .then(showup => res.status(204).end())
 //       .catch(err => res.status(500).json({message: 'Internal server error'}));
 //    }

router.delete('/searches/:id', (req, res) => {
 Search
  .findByIdAndRemove(req.params.id)
 .exec()
  .then(searches => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
});



 




module.exports = router;
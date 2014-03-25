'use strict';

module.exports = function(req, res, next){
  var Resident = require('../models/resident');

  if (req.session.residentId){
    Resident.findById(req.session.residentId, function(resident){
      res.locals.currentResident = resident;
    });
  }
  
  if (req.user){
    console.log('!!!!!!!!!!!!!!!!!!!!!', req.user);
    Resident.findById(req.user._id, function(resident){
      res.locals.currentResident = resident;
    });
  }
  next();
};


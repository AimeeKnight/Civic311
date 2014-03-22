'use strict';

module.exports = function(req, res, next){
  var Resident = require('../models/resident');

  Resident.findById(req.session.residentId, function(resident){
    res.locals.currentResident = resident;

    next();
  });
};


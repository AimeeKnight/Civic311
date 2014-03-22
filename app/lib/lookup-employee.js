'use strict';

module.exports = function(req, res, next){
  var Employee = require('../models/employee');

  Employee.findById(req.session.employeeId, function(employee){
    res.locals.currentEmployee = employee;

    next();
  });
};


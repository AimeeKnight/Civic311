'use strict';

var Employee = require('../models/employee');

exports.fresh = function(req, res){
  res.render('employees/fresh', {title: 'Register Employee'});
};

exports.create = function(req, res){
  var employee = new Employee(req.body);
  employee.register(function(){
    if(employee._id){
      res.redirect('/');
    }else{
      res.render('employees/fresh', {title: 'Register Employee'});
    }
  });
};

exports.login = function(req, res){
  res.render('employees/login', {title: 'Login Employee'});
};

exports.authenticate = function(req, res){
  Employee.findByEmailAndPassword(req.body.email, req.body.password, function(employee){
    if(employee){
      req.session.regenerate(function(){
        req.session.employeeId = employee._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      res.render('employees/login', {title: 'Login Employee'});
    }
  });
};

exports.show = function(req, res){
  Employee.findById(req.session.userId, function(employee){
    res.render('employees/show', {employee:employee});
  });
};

'use strict';

var Employee = require('../models/employee');

exports.fresh = function(req, res){
  res.render('employees/fresh', {title: 'Register Employee'});
};

exports.token = function(req, res){
  res.render('employees/token', {title: 'Complete Your Registration'});
};

exports.create = function(req, res){
  if(req.body.email.match(/@gmail.com/g)){
    var employee = new Employee(req.body);
    var token = Math.floor(Math.random() * 10000000);
    employee.token = token;
    employee.register(function(){
      if(employee._id){
        res.redirect('/admin/confirm');
      }else{
        res.render('employees/token', {title: 'Register Employee'});
      }
    });
  }else{
    res.render('employees/token', {title: 'Register Employee'});
  }
};

exports.confirmToken = function(req, res){
  var token = req.body.token;
  Employee.findByEmailAndPassword(req.body.email, req.body.password, function(employee){
    if(employee.token.toString() === token){
      req.session.regenerate(function(){
        req.session.employeeId = employee._id;
        req.session.save(function(){
          res.redirect('/reports');
        });
      });
    }else{
      Employee.deleteById(employee._id.toString(), function(){
        res.redirect('/');
      });
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
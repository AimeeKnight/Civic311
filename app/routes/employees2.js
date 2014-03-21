'use strict';

var Employee = require('../models/employee');

exports.fresh = function(req, res){
  res.render('employees/fresh', {title: 'Employee Registration'});
};

exports.freshConfirm = function(req, res){
  res.render('employees/confirm', {title: 'Complete Your Registration'});
};

/*
exports.confirmToken = function(req, res){
  var email = req.body.email;
  if(email === 'aimeemarieknight@gmail.com'){
    var num = Math.floor(Math.random() * 10000000);
    res.send({num:num});
  }else{
    res.send('invalid email');
  }
};
*/

exports.confirmToken = function(req, res){
  Employee.findByEmailAndPassword(req.body.email, req.body.password, function(employee){
    if(employee.token.toString() === req.body.token.toString()){
      req.session.regenerate(function(){
        req.session.employeeId = employee._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      Employee.deleteById(employee._id.toString(), function(){
        res.render('/');
      });
    }
  });
};

exports.create = function(req, res){
  var employee = new Employee(req.body);
  var token = Math.floor(Math.random() * 10000000);
  employee.token = token;
  employee.register(function(){
    if(employee._id){
      res.redirect('/');
    }else{
      res.render('employees/fresh', {title: 'Register Employee'});
    }
  });
};

exports.login = function(req, res){
  res.render('employees/login', {title: 'Employee Login'});
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
      res.render('employees/login', {title: 'Employee Login'});
    }
  });
};

exports.show = function(req, res){
  Employee.findById(req.session.userId, function(employee){
    res.render('employees/show', {employee:employee});
  });
};

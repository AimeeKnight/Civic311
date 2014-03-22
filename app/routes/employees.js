'use strict';

var Employee = require('../models/employee');

exports.fresh = function(req, res){
  res.render('employees/fresh', {title: 'Employee Registration'});
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
        res.render('employees/token', {title: 'Employee Registration'});
      }
    });
  }else{
    res.render('employees/token', {title: 'Employee Registration'});
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

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.show = function(req, res){
  Employee.findById(req.session.userId, function(employee){
    res.render('employees/show', {employee:employee});
  });
};

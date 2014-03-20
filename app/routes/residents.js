'use strict';

var Resident = require('../models/resident');

exports.fresh = function(req, res){
  res.render('residents/fresh', {title: 'Register Resident'});
};

exports.create = function(req, res){
  var resident = new Resident(req.body);
  resident.register(function(){
    if(resident._id){
      res.redirect('/');
    }else{
      res.render('residents/fresh', {title: 'Register Resident'});
    }
  });
};

exports.login = function(req, res){
  res.render('residents/login', {title: 'Login Resident'});
};

exports.authenticate = function(req, res){
  Resident.findByEmailAndPassword(req.body.email, req.body.password, function(resident){
    if(resident){
      req.session.regenerate(function(){
        req.session.residentId = resident._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      res.render('residents/login', {title: 'Login Resident'});
    }
  });
};


'use strict';

var Resident = require('../models/resident');
var gravatar = require('gravatar');

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

exports.show = function(req, res){
  console.log('!!!!!!!!!!!');
  console.log(req.params);
  console.log('!!!!!!!!!!!');
  Resident.findById(req.params.id, function(resident){
    var url = gravatar.url(resident.email, {s: '200', r: 'pg'});
    res.render('residents/show', {resident:resident, gravatar: url});
  });
};

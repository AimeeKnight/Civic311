'use strict';

var Resident = require('../models/resident');
var gravatar = require('gravatar');

exports.fresh = function(req, res){
  res.render('residents/fresh', {title: 'Resident Registration'});
};

exports.fbInfo = function(req, res){
  if (req.user && req.user.email === null){
    res.render('residents/update', {title: 'Please submit your email to receive notifications', fbResident:req.user});
  }else{
    res.redirect('/');
  }
};

exports.fbUpdate = function(req, res){
  Resident.findById(req.params.id.toString(), function(resident){
    resident.email = req.body.email;

    resident.update(function(){
      res.redirect('/');
    });
  });
};

exports.create = function(req, res){
  var resident = new Resident(req.body);
  resident.register(function(){
    if(resident._id){
      res.redirect('/');
    }else{
      res.render('residents/fresh', {title: 'Resident Registration'});
    }
  });
};

exports.login = function(req, res){
  res.render('residents/login', {title: 'Resident Login'});
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
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
      res.render('residents/login', {title: 'Resident Login'});
    }
  });
};

exports.show = function(req, res){
  Resident.findById(req.params.id, function(resident){
    var url = gravatar.url(resident.email, {s: '200', r: 'pg'});
    res.render('residents/show', {resident:resident, gravatar: url});
  });
};

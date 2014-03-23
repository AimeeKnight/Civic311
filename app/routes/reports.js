'use strict';

var Report = require('../models/report');
var Resident = require('../models/resident');
var moment = require('moment');
var Mongo = require('mongodb');
var email = require('../lib/email');

exports.fresh = function(req, res){
  res.render('reports/fresh', {title: 'New Report'});
};

exports.create = function(req, res){
  req.body.residentId = new Mongo.ObjectID(req.session.residentId);
  var report = new Report(req.body);

  if (req.files.cover && req.files.cover.size !== 0){
    report.addPhoto(req.files.cover.path);
    report.insert(function(){
      res.redirect('/');
    });
  }else{
    report.insert(function(){
      res.redirect('/');
    });
  }
};

exports.index = function(req, res){
  Report.findAll(function(reports){
    res.render('reports/index', {reports:reports, title: 'Reports'});
  });
};

exports.show = function(req, res){
  Report.findById(req.params.id, function(report){
    res.render('reports/show', {moment:moment, report:report});
  });
};

/*
exports.indexByResident = function(req, res){
  Report.findByResidentEmail(req.params.residentEmail, function(reports){
    res.render('reports/index', {reports:reports, title: 'Reports'});
  });
};
*/

exports.update = function(req, res, fn){
  console.log('!!!!!!!!!!!!', req.params.id);
  Report.findById(req.params.id.toString(), function(report){
    report.employeeId = new Mongo.ObjectID(req.body.employeeId);
    report.currentStatus = req.body.currentStatus;

    Resident.findById(report.residentId.toString(), function(resident){
      console.log('!!!!!!!!!!!!', report);
      console.log('!!!!!!!!!!!!', resident);
      email.sendUpdate({to:resident.email, name:resident.name, currentStatus:report.currentStatus}, function(err, body){
        report.update(function(){
          fn(err, body);
          res.redirect('/reports/' + req.params.id);
        });
      });
    });
  });
};

exports.subscribe = function(req, res){
  Report.findById(req.params.id, function(report){
    report.notifications.push(new Mongo.ObjectID(req.body.currentResident));
    report.update(function(){
      res.redirect('/reports/' + req.params.id);
    });
  });
};

exports.query = function(req, res){
  Report.findByGeo(req.query, function(reports){
    console.log(reports);
    res.render('reports/index', {reports:reports, title: 'Reports In Your Area'});
  });
};


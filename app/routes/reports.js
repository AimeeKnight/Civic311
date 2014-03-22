'use strict';

var Report = require('../models/report');
var moment = require('moment');
var Mongo = require('mongodb');

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

exports.update = function(req, res){
  Report.findById(req.params.id, function(report){
    if (req.body.employeeId) {
      report.employeeId = new Mongo.ObjectID(req.body.employeeId);
    }
    if (req.body.currentStatus){
      report.currentStatus = req.body.currentStatus;
    }
    if (req.body.currentResident){
      report.notifications.push(new Mongo.ObjectID(req.body.currentResident));
    }
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

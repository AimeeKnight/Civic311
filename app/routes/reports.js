'use strict';

var Report = require('../models/report');
var Resident = require('../models/resident');
var moment = require('moment');
var Mongo = require('mongodb');
var email = require('../lib/email');
var _ = require('lodash');

exports.fresh = function(req, res){
  res.render('reports/fresh', {title: 'New Report'});
};

exports.create = function(req, res, fn){
  var currentResident = res.locals.currentResident;
  req.body.residentId = new Mongo.ObjectID(req.session.residentId);
  var report = new Report(req.body);

  if (req.files.cover && req.files.cover.size !== 0){
    report.addPhoto(req.files.cover.path);
    report.insert(function(){

      email.sendId({to:currentResident.email, name:currentResident.name, reportId:report._id.toString()}, function(err, body){
        fn(err, body);
        res.redirect('/');
      });
    });
  }else{
    report.insert(function(){
      email.sendId({to:currentResident.email, name:currentResident.name, reportId:report._id.toString()}, function(err, body){
        fn(err, body);
        res.redirect('/');
      });
    });
  }
};

exports.index = function(req, res){
  Report.findPublic(function(reports){
    res.render('reports/index', {reports:reports, title: 'Reports'});
  });
};

exports.adminIndex = function(req, res){
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
  Report.findById(req.params.id.toString(), function(report){
    report.employeeId = new Mongo.ObjectID(req.body.employeeId);
    report.currentStatus = req.body.currentStatus;

    Resident.findById(report.residentId.toString(), function(resident){
      var emailList = resident.email + ', '  + report.notifications.join(', ');
      console.log(emailList);
      email.sendUpdate({to:emailList, name:resident.name, currentStatus:report.currentStatus}, function(err, body){
        report.update(function(){
          res.redirect('/reports/' + req.params.id);
        });
      });
    });
  });
};

exports.subscribe = function(req, res){
  Report.findById(req.params.id, function(report){
    Resident.findById(req.body.currentResident, function(resident){
      report.notifications.push(resident.email);
      report.update(function(){
        res.redirect('/reports/' + req.params.id);
      });
    });
  });
};

exports.geoQuery = function(req, res){
  Report.findByGeo(req.query, function(reports){
    var publicReports = _.remove(reports, function(report){ return report.visibility === 'public'; });
    res.render('reports/index', {reports:publicReports, title: 'Reports In Your Area'});
  });
};

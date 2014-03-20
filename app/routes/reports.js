'use strict';

var Report = require('../models/report');

exports.fresh = function(req, res){
  res.render('reports/fresh', {title: 'New Report'});
};

exports.create = function(req, res){
  var report = new Report(req.body);
  report.insert(function(){
    res.redirect('/');
  });
};

exports.index = function(req, res){
  Report.findAll(function(reports){
    res.render('reports/index', {reports:reports, title: 'Reports'});
  });
};

exports.query = function(req, res){
  Report.findByGeo(req.query, function(reports){
    res.send({reports:reports});
  });
};


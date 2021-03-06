'use strict';

module.exports = Report;

var reports = global.nss.db.collection('reports');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var _ = require('lodash');

function Report(report){
  this.name = report.name || null;
  this.date = new Date(report.date) || new Date();

  // true === 'on' false === null
  if (report.visibility === 'on'){
    this.visibility = 'private';
  }else{
    this.visibility = 'public';
  }
  this.currentStatus = report.currentStatus || 'Waiting on response.';
  this.employeeId = report.employeeId || null;
  this.residentId = report.residentId || null;
  this.description = report.description || null;
  this.address = report.address || null;
  this.notifications = report.notifications || [];
  this.coordinates = [report.lat * 1, report.lng * 1] || null;
  this.photo = this.photo || null;
  this.amount = this.amount || null;
  this.donors = this.donors || [];

  // true === 'on' false === null
  if (report.donate === 'on'){
    this.donate = true;
  }else{
    this.donate = false;
  }
}

Report.prototype.addPhoto = function(oldpath){
  var dirname = this.name.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname;
  fs.mkdirSync(abspath + relpath);

  var extension = path.extname(oldpath);
  relpath += '/cover' + extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.photo = relpath;
};

Report.prototype.insert = function(fn){
  reports.insert(this, function(err, records){
    fn(err);
  });
};

Report.prototype.update = function(fn){
  reports.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};

Report.findAll = function(fn){
  reports.find().toArray(function(err, records){
    fn(records);
  });
};

Report.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  reports.findOne({_id:_id}, function(err, report){
    fn(_.extend(report, Report.prototype));
  });
};

Report.findPublic = function(fn){
  reports.find({visibility:'public'}).toArray(function(err, reports){
    fn(reports);
  });
};

Report.findDonate = function(fn){
  reports.find({donate:true, $or: [{visibility: 'public'}]}).toArray(function(err, reports){
    fn(reports);
  });
};

Report.findByGeo = function(query, fn){
  var lat = query.lat * 1;
  var lng = query.lng * 1;
  var data = {'coordinates':{$nearSphere:{$geometry:{type:'Point', coordinates:[lat, lng]}}, $maxDistance : 25000000}};
  reports.find(data).toArray(function(err, reports){
    fn(reports);
  });
};

'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var residents = require('../routes/residents');
  var employees = require('../routes/employees');
  var reports = require('../routes/reports');

  ////////// RESIDENTS //////////
  app.get('/', d, home.index);
  app.get('/register', d, residents.fresh);
  app.post('/register', d, residents.create);
  app.get('/login', d, residents.login);
  app.post('/login', d, residents.authenticate);

  ////////// EMPLOYEES //////////
  app.get('/admin/register', d, employees.fresh);
  app.post('/admin/register', d, employees.create);
  app.get('/admin/login', d, employees.login);
  app.post('/admin/login', d, employees.authenticate);

  ////////// REPORTS //////////
  app.get('/reports/new', d, reports.fresh);
  app.post('/reports', d, reports.create);
  app.get('/reports', d, reports.index);
  app.get('/reports/query', d, reports.query);
  app.get('/reports/:id', d, reports.show);
  app.post('/reports/:id', d, reports.update);
  console.log('Routes Loaded');
  fn();
}


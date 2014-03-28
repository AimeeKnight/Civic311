'use strict';
var d = require('../lib/request-debug');
var passport = require('passport');
var initialized = false;
var FacebookStrategy = require('passport-facebook').Strategy;
var key = process.env.FB;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var facebookCallback = require('../lib/passport-callback');

  passport.serializeUser(function(user, done){
    done(null, user);
  });

  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });

  // call passport.use passing in new FacebookStrategy
  passport.use(new FacebookStrategy({
      clientID: '505396282898918',
      clientSecret: key,
      callbackURL: 'http://192.168.11.98:4009/auth/facebook/callback'
    }, facebookCallback
  ));

  var home = require('../routes/home');
  var residents = require('../routes/residents');
  var employees = require('../routes/employees');
  var reports = require('../routes/reports');

  ////////// FACEBOOK //////////
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', d,
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/update');
  });

  ////////// RESIDENTS //////////
  app.get('/', d, home.index);
  app.get('/register', d, residents.fresh);
  app.post('/register', d, residents.create);
  app.get('/login', d, residents.login);
  app.post('/login', d, residents.authenticate);
  app.get('/logout', d, residents.logout);
  app.post('/logout', d, residents.logout);
  app.get('/update', d, residents.fbInfo);
  app.post('/residents/:id', d, residents.fbUpdate);
  app.get('/residents/:id', d, residents.show);

  ////////// EMPLOYEES //////////
  app.get('/admin/register', d, employees.fresh);
  app.post('/admin/register', d, employees.create);
  app.get('/admin/confirm', d, employees.token);
  app.post('/admin/confirm', d, employees.confirmToken);
  app.get('/admin/login', d, employees.login);
  app.post('/admin/login', d, employees.authenticate);
  app.post('/admin/logout', d, employees.logout);
  app.get('/employees/:id', d, employees.show);

  ////////// REPORTS //////////
  app.get('/reports/new', d, reports.fresh);
  app.post('/reports', d, reports.create);
  app.get('/reports', d, reports.index);
  app.get('/reports/admin', d, reports.adminIndex);
  app.get('/reports/query', d, reports.geoQuery);
  app.get('/reports/donations', d, reports.donationsIndex);
  app.get('/reports/:id', d, reports.show);
  app.post('/reports/:id', d, reports.update);
  app.post('/reports/subscribe/:id', d, reports.subscribe);
  app.post('/reports/donatable/:id', d, reports.setDonate);
  app.post('/reports/donate/:id', d, reports.donate);
  console.log('Routes Loaded');
  fn();
}

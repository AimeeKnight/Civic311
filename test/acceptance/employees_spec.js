'use strict';

process.env.DBNAME = 'civic311-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var employee;
var bob;
var employeeId;
var cookie;

describe('employees', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      employee = require('../../app/models/employee');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new employee({email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        employeeId = bob._id.toString();
        done();
      });
    });
  });

  describe('GET /admin/register', function(){
    it('should display the register page', function(done){
      request(app)
      .get('/admin/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('GET /admin/confirm', function(){
    it('should display the confirmation page', function(done){
      request(app)
      .get('/admin/confirm')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('POST /admin/register', function(){
    it('should register a new employee if the email domain is gmail', function(done){
      request(app)
      .post('/admin/register')
      .field('email', 'sue@gmail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.equal('Moved Temporarily. Redirecting to /admin/confirm');
        done();
      });
    });
    it('should not register a new employee without a gmail address', function(done){
      request(app)
      .post('/admin/register')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Employee Registration');
        done();
      });
    });
  });

  describe('POST /admin/confirm', function(){
    it('should complete registration of a new employee', function(done){
      var sue2 = new employee({name:'Sue', email:'sue2@gmail.com', password:'1234', token:'12345678'});
      sue2.register(function(){
        request(app)
        .post('/admin/confirm')
        .field('email', 'sue2@gmail.com')
        .field('password', '1234')
        .field('token', '12345678')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.text).to.equal('Moved Temporarily. Redirecting to /reports');
          done();
        });
      });
    });
    it('should not register a new employee without a matching token', function(done){
      var sue3 = new employee({name:'Sue', email:'sue3@gmail.com', password:'1234', token:'12345678'});
      sue3.register(function(){
        request(app)
        .post('/admin/confirm')
        .field('email', 'sue3@gmail.com')
        .field('password', '1234')
        .field('token', '00000000')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
          done();
        });
      });
    });
  });

  describe('GET /admin/login', function(){
    it('should display the login page', function(done){
      request(app)
      .get('/admin/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('POST /admin/login', function(){
    it('should login a new employee', function(done){
      request(app)
      .post('/admin/login')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
        done();
      });
    });

    it('should not login a new employee', function(done){
      request(app)
      .post('/admin/login')
      .field('email', 'wrong@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/admin/login')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('GET /employees/:id', function(){
      it('should show employee show page when logged in', function(done){
        request(app)
        .get('/employees/' + employeeId)
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('POST /logout', function(){
      it('should logout employee when logged in', function(done){
        request(app)
        .post('/admin/logout')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
          done();
        });
      });
    });

  });

});


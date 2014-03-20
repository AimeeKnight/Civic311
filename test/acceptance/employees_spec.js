'use strict';

process.env.DBNAME = 'civic311-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var employee;
var bob;

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
      bob = new employee({role:'host', email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
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

  describe('POST /admin/register', function(){
    it('should register a new employee', function(done){
      request(app)
      .post('/admin/register')
      .field('email', 'sue@nomail.com')
      .field('password', '1234')
      .field('role', 'guest')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
        done();
      });
    });
    it('should not register a new employee', function(done){
      request(app)
      .post('/admin/register')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .field('role', 'guest')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
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

});


'use strict';

process.env.DBNAME = 'civic311-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var Resident;
var bob;
var residentId;
var cookie;

describe('residents', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Resident = require('../../app/models/resident');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new Resident({name:'Bob', email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        residentId = bob._id.toString();
        done();
      });
    });
  });

  describe('GET /register', function(){
    it('should display the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('POST /register', function(){
    it('should register a new resident', function(done){
      request(app)
      .post('/register')
      .field('email', 'sue@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
        done();
      });
    });
    it('should not register a new resident', function(done){
      request(app)
      .post('/register')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('GET /login', function(){
    it('should display the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login a new resident', function(done){
      request(app)
      .post('/login')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
        done();
      });
    });

    it('should not login a new resident', function(done){
      request(app)
      .post('/login')
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
      .post('/login')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('GET /residents/:id', function(){
      it('should show a resident page when logged in', function(done){
        request(app)
        .get('/residents/' + residentId)
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('GET /update', function(){
      it('should redirect to home page when a fb user logs in with an email', function(done){
        request(app)
        .get('/update')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
          done();
        });
      });
    });


    describe('POST /logout', function(){
      it('should logout employee when logged in', function(done){
        request(app)
        .post('/logout')
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


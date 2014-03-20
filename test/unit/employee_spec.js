/* jshint expr:true */

'use strict';

process.env.DBNAME = 'civic311-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var Mongo = require('mongodb');
var Employee;
var bob;
var employeeId;
var cookie;

describe('employee', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Employee = require('../../app/models/employee');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new Employee({email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new employee object', function(){
      var u1 = new Employee({name:'Person1', email:'bob@nomail.com', password:'1234'});
      expect(u1).to.be.instanceof(Employee);
      expect(u1.name).to.equal('Person1');
      expect(u1.email).to.equal('bob@nomail.com');
      expect(u1.password).to.equal('1234');
    });
  });

  describe('#register', function(){
    it('should register a new employee', function(done){
      var u1 = new Employee({name:'Person1', email:'employee1@example.com', password:'1234'});
      u1.register(function(err, body){
        expect(err).to.not.be.ok;
        expect(u1.password).to.have.length(60);
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        body = JSON.parse(body);
        expect(body.id).to.be.ok;
        done();
      });
    });
    it('should not register a new employee', function(done){
      var u1 = new Employee({name:'Person1', email:'bob@nomail.com', password:'1234'});
      u1.register(function(err){
        expect(u1._id).to.be.undefined;
        done();
      });
    });
  });

  describe('findById', function(){
    it('should find user by her id', function(done){
      var id = bob._id.toString();

      Employee.findById(id, function(employee){
        expect(employee.id).to.deep.equal(bob.id);
        done();
      });
    });
  });

  describe('.findByEmailAndPassword', function(){
    it('should find a employee', function(done){
      Employee.findByEmailAndPassword('bob@nomail.com', '1234', function(employee){
        expect(employee).to.be.ok;
        done();
      });
    });
    it('should not find employee - bad email', function(done){
      Employee.findByEmailAndPassword('wrong@nomail.com', '1234', function(employee){
        expect(employee).to.be.undefined;
        done();
      });
    });
    it('should not find employee - bad password', function(done){
      Employee.findByEmailAndPassword('bob@nomail.com', 'wrong', function(employee){
        expect(employee).to.be.undefined;
        done();
      });
    });
  });

  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .field('name', 'Sue')
      .field('email', 'testsue@nomail.com')
      .field('password', 'abcd')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('GET /employees/:id', function(){
      it('should show a employee page when logged in', function(done){
        request(app)
        .get('/employees/' + employeeId)
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

});


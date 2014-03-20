/* jshint expr:true */

'use strict';

process.env.DBNAME = 'airbnb-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var resident;
var bob;

describe('resident', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      resident = require('../../app/models/resident');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new resident({email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new resident object', function(){
      var u1 = new resident({name:'Person1', email:'bob@nomail.com', password:'1234'});
      expect(u1).to.be.instanceof(resident);
      expect(u1.name).to.equal('Person1');
      expect(u1.email).to.equal('bob@nomail.com');
      expect(u1.password).to.equal('1234');
    });
  });

  describe('#register', function(){
    it('should register a new resident', function(done){
      var u1 = new resident({name:'Person1', email:'resident1@example.com', password:'1234'});
      u1.register(function(err, body){
        expect(err).to.not.be.ok;
        expect(u1.password).to.have.length(60);
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        body = JSON.parse(body);
        expect(body.id).to.be.ok;
        done();
      });
    });
    it('should not register a new resident', function(done){
      var u1 = new resident({name:'Person1', email:'bob@nomail.com', password:'1234'});
      u1.register(function(err){
        expect(u1._id).to.be.undefined;
        done();
      });
    });
  });

  describe('.findByEmailAndPassword', function(){
    it('should find a resident', function(done){
      resident.findByEmailAndPassword('bob@nomail.com', '1234', function(resident){
        expect(resident).to.be.ok;
        done();
      });
    });
    it('should not find resident - bad email', function(done){
      resident.findByEmailAndPassword('wrong@nomail.com', '1234', function(resident){
        expect(resident).to.be.undefined;
        done();
      });
    });
    it('should not find resident - bad password', function(done){
      resident.findByEmailAndPassword('bob@nomail.com', 'wrong', function(resident){
        expect(resident).to.be.undefined;
        done();
      });
    });
  });

});


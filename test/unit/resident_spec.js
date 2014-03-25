/* jshint expr:true */

'use strict';

process.env.DBNAME = 'civic311-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var Resident;
var bob;

describe('resident', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Resident = require('../../app/models/resident');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new Resident({name:'Person1',  email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new resident object', function(){
      var u1 = new Resident({name:'Person1', email:'bob@nomail.com', password:'1234'});
      expect(u1).to.be.instanceof(Resident);
      expect(u1.name).to.equal('Person1');
      expect(u1.email).to.equal('bob@nomail.com');
      expect(u1.password).to.equal('1234');
    });
  });

  describe('#fbInsert', function(){
    it('should insert new resident into the database', function(done){
      var fbu = new Resident({name:'Person3', facebookId:'1234', email:'sue@nomail.com', password:'5678'});
      fbu.fbInsert(function(resident){
        expect(resident._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('#register', function(){
    it('should register a new resident', function(done){
      //var u1 = new Resident({name:'Person1', email:'resident1@example.com', password:'1234'});
      var u1 = new Resident({name:'Aimee', email:'aimeemarieknight@gmail.com', password:'9876'});
      //var u1 = new Resident({name:'Aimee', email:'aimeemarieknight@nomail.com', password:'9876'});
      u1.register(function(err, body){
        expect(err).to.be.undefined;
        expect(u1.password).to.have.length(60);
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        //body = JSON.parse(body);
        expect(body.id).to.be.ok;
        done();
      });
    });
    it('should not register a new resident', function(done){
      var u1 = new Resident({name:'Person1', email:'bob@nomail.com', password:'1234'});
      u1.register(function(err){
        expect(u1._id).to.be.undefined;
        done();
      });
    });
  });

  describe('findById', function(){
    it('should find user by her id', function(done){
      var id = bob._id.toString();

      Resident.findById(id, function(resident){
        expect(resident.id).to.deep.equal(bob.id);
        done();
      });
    });
  });

  describe('.findByEmailAndPassword', function(){
    it('should find a resident', function(done){
      Resident.findByEmailAndPassword('bob@nomail.com', '1234', function(resident){
        expect(resident).to.be.ok;
        done();
      });
    });
    it('should not find resident - bad email', function(done){
      Resident.findByEmailAndPassword('wrong@nomail.com', '1234', function(resident){
        expect(resident).to.be.undefined;
        done();
      });
    });
    it('should not find resident - bad password', function(done){
      Resident.findByEmailAndPassword('bob@nomail.com', 'wrong', function(resident){
        expect(resident).to.be.undefined;
        done();
      });
    });
  });

  describe('.findByFacebookId', function(){
    it('should find a user by fb ID', function(done){
      var fbu = new Resident({name:'Person3', facebookId:'1234', email:'sue@nomail.com', password:'5678'});
      fbu.fbInsert(function(){
        Resident.findByFacebookId(fbu.facebookId, function(resident){
          expect(resident.facebookId).to.equal('1234');
          done();
        });
      });
    });
  });

  describe('#update', function(){
    it('should update an existing resident', function(done){
      var fbu = new Resident({name:'fbPerson', facebookId:'5678', email:'fb@nomail.com'});
      fbu.fbInsert(function(){
        var residentId = fbu._id.toString();
        Resident.findById(residentId, function(resident){
          resident.email = 'suefb@nomail.com';
          resident.update(function(err, count){
            expect(count).to.equal(1);
            expect(resident.email).to.equal('suefb@nomail.com');
            done();
          });
        });
      });
    });
  });

});


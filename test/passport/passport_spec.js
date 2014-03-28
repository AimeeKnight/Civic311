/* jshint expr:true */

'use strict';

process.env.DBNAME = 'civic311-test';
var Mongo = require('mongodb');
var expect = require('chai').expect;
var fbu;
var Resident;
var facebookCallback;


describe('resident', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Resident = require('../../app/models/resident');
      facebookCallback = require('../../app/lib/passport-callback');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });

  describe('passportCallback', function(){
    it('should create a new user', function(done){
      fbu = {displayName:'PersonFb', id:'148'};
      facebookCallback('123', '456', fbu, function(err, user){
        expect(user._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
});

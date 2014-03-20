'use strict';

process.env.DBNAME = 'civic311-test';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var Report;
var Resident;
var residentId;

describe('reports', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Report = require('../../app/models/report');
      Resident = require('../../app/models/resident');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/euro.jpg';
      var copy1file = __dirname + '/../fixtures/euro-copy1.jpg';
      var copy2file = __dirname + '/../fixtures/euro-copy2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        var u1 = new Resident({email:'bob@nomail.com', name:'Person1', password:'1234'});
        u1.register(function(){
          residentId = u1._id.toString();
          done();
        });
      });
    });
  });

  describe('GET /', function(){
    it('should display the report home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /reports/3', function(){
    var r1, r2, r3;

    beforeEach(function(done){
      r1 = new Report({name:'Test ReportA', taken:'2012-03-25', lat:'30', lng:'60'});
      r2 = new Report({name:'Test ReportB', taken:'2012-03-26', lat:'40', lng:'70'});
      r3 = new Report({name:'Test ReportC', taken:'2012-03-27', lat:'50', lng:'80'});

      r1.insert(function(){
        r2.insert(function(){
          r3.insert(function(){
            done();
          });
        });
      });
    });

    it('should display the report show page', function(done){
      request(app)
      .get('/reports/' + r1._id.toString())
      .expect(200, done);
    });
  });

  describe('GET /reports/new', function(){
    it('should display the new report html page', function(done){
      request(app)
      .get('/reports/new')
      .expect(200, done);
    });
  });

  describe('POST /reports', function(){
    it('should create a new report with a photo and send user back to home', function(done){
      var filename = __dirname + '/../fixtures/euro-copy1.jpg';
      request(app)
      .post('/reports')
      .attach('cover', filename)
      .field('name', 'Test Report1')
      .field('date', '2014-02-25')
      .field('description', 'Report1 Description')
      .field('address', '123 Main Street')
      .field('coordinates', [30, 30])
      .field('residentId', residentId)
      .expect(302, done);
    });
  });

  describe('POST /reports', function(){
    it('should create a new report without a photo and send user back to home', function(done){
      request(app)
      .post('/reports')
      .field('name', 'Test Report1')
      .field('date', '2014-02-25')
      .field('description', 'Report1 Description')
      .field('address', '123 Main Street')
      .field('coordinates', [30, 30])
      .field('residentId', residentId)
      .expect(302, done);
    });
  });

  describe('POST /reports/3', function(){
    it('should edit a report and send user back to home', function(done){
      request(app)
      .post('/reports')
      .field('name', 'Test Report1')
      .field('date', '2014-02-25')
      .field('description', 'Report1 Description')
      .field('address', '456 Main Street')
      .field('coordinates', [30, 30])
      .field('residentId', residentId)
      .expect(302, done);
    });
  });
/////
});


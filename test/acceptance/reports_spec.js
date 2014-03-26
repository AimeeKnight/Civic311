'use strict';

process.env.DBNAME = 'civic311-test';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var expect = require('chai').expect;
var Report;
var Resident;
var Employee;
var residentId;
var employeeId;
var reportId;
var cookie;

describe('reports', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Report = require('../../app/models/report');
      Resident = require('../../app/models/resident');
      Employee = require('../../app/models/employee');
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
        var u2 = new Employee({email:'sue@nomail.com', name:'Person1', password:'5678'});
        u1.register(function(){
          u2.register(function(){
            residentId = u1._id.toString();
            employeeId = u2._id.toString();
            done();
          });
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

    describe('GET /reports/3', function(){
      var r1, r2, r3;

      beforeEach(function(done){
        r1 = new Report({name:'Test ReportA', date:'2012-03-25', lat:'30', lng:'60', residentId:residentId});
        r2 = new Report({name:'Test ReportB', date:'2012-03-26', lat:'40', lng:'70', residentId:residentId});
        r3 = new Report({name:'Test ReportC', date:'2012-03-27', lat:'50', lng:'80', residentId:residentId});

        r1.insert(function(){
          reportId = r1._id.toString();
          r2.insert(function(){
            r3.insert(function(){
              done();
            });
          });
        });
      });

      it('should display the reports default index page', function(done){
        request(app)
        .get('/reports')
        .set('cookie', cookie)
        .expect(200, done);
      });

      it('should display the reports index page for admins', function(done){
        request(app)
        .get('/reports/admin')
        .set('cookie', cookie)
        .expect(200, done);
      });

      it('should display the report show page', function(done){
        request(app)
        .get('/reports/' + reportId)
        .set('cookie', cookie)
        .expect(200, done);
      });
    });

    describe('GET /reports/new', function(){
      it('should display the new report html page', function(done){
        request(app)
        .get('/reports/new')
        .set('cookie', cookie)
        .expect(200, done);
      });
    });

    describe('POST /reports', function(){
      it('should create a new report with a photo and send user back to home', function(done){
        var filename = __dirname + '/../fixtures/euro-copy1.jpg';
        request(app)
        .post('/reports')
        .set('cookie', cookie)
        .attach('cover', filename)
        .field('name', 'Test Report1')
        .field('date', '2014-02-25')
        .field('description', 'Report1 Description')
        .field('address', '123 Main Street')
        .field('coordinates', [30, 30])
        .field('residentId', residentId)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
          done();
        });
      });
    });

    describe('POST /reports', function(err, res){
      it('should create a new report without a photo and send user back to home', function(done){
        request(app)
        .post('/reports')
        .set('cookie', cookie)
        .field('name', 'Test Report1')
        .field('residentId', residentId)
        .field('date', '2014-02-25')
        .field('description', 'Report1 Description')
        .field('address', '123 Main Street')
        .field('coordinates', [30, 30])
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
          done();
        });
      });
    });

    describe('POST /reports/3', function(err, res){
      it('should edit a report and send user back to the that report show page', function(done){
        var r1 = new Report({name:'Test ReportA', date:'2012-03-25', lat:'30', lng:'60', residentId:residentId});
        r1.insert(function(){
          var reportId = r1._id.toString();
          request(app)
          .post('/reports/' + reportId)
          .set('cookie', cookie)
          .field('employeeId', employeeId)
          .field('currentStatus', 'status update')
          .end(function(err, res){
            expect(res.status).to.equal(302);
            expect(res.text).to.equal('Moved Temporarily. Redirecting to /reports/' + reportId);
            done();
          });
        });
      });
    });

    describe('POST /reports/subscribe/3', function(err, res){
      it('should edit a report and send user back to the report show page', function(done){
        var r1 = new Report({name:'Test ReportA', date:'2012-03-25', lat:'30', lng:'60', residentId:residentId});
        r1.insert(function(){
          var reportId = r1._id.toString();
          request(app)
          .post('/reports/subscribe/' + reportId)
          .set('cookie', cookie)
          .field('currentResident', residentId)
          .end(function(err, res){
            expect(res.status).to.equal(302);
            expect(res.text).to.equal('Moved Temporarily. Redirecting to /reports/' + reportId);
            done();
          });
        });
      });
    });

    describe('POST /reports/donate/3', function(err, res){
      it('should donate to a report and send user back to the report show page', function(done){
        var r1 = new Report({name:'Test ReportA', date:'2012-03-25', lat:'30', lng:'60', residentId:residentId});
        r1.insert(function(){
          var reportId = r1._id.toString();
          request(app)
          .post('/reports/donate/' + reportId)
          .set('cookie', cookie)
          .field('amount', 15)
          .end(function(err, res){
            expect(res.status).to.equal(302);
            expect(res.text).to.equal('Moved Temporarily. Redirecting to /reports/' + reportId);
            done();
          });
        });
      });
    });

  });
/////
});


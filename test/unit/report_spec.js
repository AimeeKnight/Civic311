'use strict';

process.env.DBNAME = 'civic311-test';
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var Report;
//var reportId;

describe('Report', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Report = require('../../app/models/report');
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
        global.nss.db.collection('reports').ensureIndex({'coordinates':'2dsphere'}, function(err, indexName){
          done();
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new Report object', function(){
      var o = {};
      o.name = 'Test Report1';
      o.date = '2010-03-25';
      o.lat = '32';
      o.lng = '32';
      var r1 = new Report(o);
      expect(r1).to.be.instanceof(Report);
      expect(r1.name).to.equal('Test Report1');
      expect(r1.date).to.be.instanceof(Date);
    });
  });

  describe('#addPhoto', function(){
    it('should add a photo to the Report', function(){
      var o = {};
      o.name = 'Test Report1';
      o.date = '2010-03-25';
      o.lat = '32';
      o.lng = '32';
      var r1 = new Report(o);
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      r1.addPhoto(oldname);
      expect(r1.photo).to.equal('/img/testreport1/cover.jpg');
    });
  });

  describe('#insert', function(){
    it('should insert a new Report into Mongo', function(done){
      var o = {};
      o.name = 'Test Report1';
      o.date = '2010-03-25';
      o.lat = '32';
      o.lng = '32';
      var r1 = new Report(o);
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      r1.addPhoto(oldname);
      r1.insert(function(err){
        expect(r1._id.toString()).to.have.length(24);
        done();
      });
    });
  });

  describe('#update', function(){
    it('should update an existing report', function(done){
      var o = {};
      o.name = 'Test Report1';
      o.date = '2010-03-25';
      o.lat = '32';
      o.lng = '32';
      var r1 = new Report(o);
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      r1.addPhoto(oldname);
      r1.insert(function(err){
        var reportId = r1._id.toString();
        Report.findById(reportId, function(report){
          report.description = 'Just some text';
          report.update(function(err, count){
            expect(count).to.equal(1);
            done();
          });
        });
      });
    });
  });

  describe('Find Methods', function(){
    var r1, r2, r3;

    beforeEach(function(done){
      r1 = new Report({name:'Test ReportA', date:'2012-03-25', lat:'30', lng:'60', donate:'on'});
      r2 = new Report({name:'Test ReportB', date:'2012-03-26', lat:'40', lng:'70'});
      r3 = new Report({name:'Test ReportC', date:'2012-03-27', lat:'50', lng:'80'});

      r1.insert(function(){
        r2.insert(function(){
          r3.insert(function(){
            done();
          });
        });
      });
    });

    describe('.findAll', function(){
      it('should find all the reports in the database', function(done){
        Report.findAll(function(reports){
          expect(reports).to.have.length(3);
          expect(reports[0].name).to.equal('Test ReportA');
          done();
        });
      });
    });

    describe('.findById', function(){
      it('should find a specific report in the database', function(done){
        Report.findById(r1._id.toString(), function(report){
          expect(report._id).to.deep.equal(r1._id);
          expect(report).to.respondTo('addPhoto');
          done();
        });
      });
    });

    describe('.findPublic', function(){
      it('should find all public reports in the database', function(done){
        Report.findPublic(function(reports){
          expect(reports[0]._id).to.deep.equal(r1._id);
          expect(reports).to.have.length(3);
          done();
        });
      });
    });

    describe('.findDonate', function(){
      it('should find all donatable reports in the database', function(done){
        Report.findDonate(function(reports){
          expect(reports[0]._id).to.deep.equal(r1._id);
          expect(reports).to.have.length(1);
          done();
        });
      });
    });
  });

  describe('.findByGeo', function(){
    it('should find public records by location', function(done){
      var r2 = new Report({name:'Test Report2',
                         visibility: 'public',
                         date: '2012-03-25',
                         lat: '30',
                         lng: '30',
                         address: '123 Main Street'});
      var r3 = new Report({name:'Test Report3',
                         visibility: 'public',
                         date: '2012-03-26',
                         lat: '40',
                         lng: '40',
                         address: '456 Main Street'});
      r2.insert(function(report2){
        r3.insert(function(report3){
          var object = {lat: 32, lng:32};
          Report.findByGeo(object, function(reports){
            expect(reports[0].name).to.equal('Test Report2');
            done();
          });
        });
      });
    });
  });
});


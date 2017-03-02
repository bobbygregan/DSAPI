var assert = require('assert');
var request = require('supertest');

var app = require('../index');
var pg = require('../lib/postgres');

var DATABASE_URL = 'postgres://robertgregan@localhost/api';

describe('dealership REST API', function() {
  before(function(done) {
    pg.initialize(DATABASE_URL, done);
  });
  describe('Create photo', function() {
    it('returns the created resource on success', function(done) {

      var validPhotoResource = {
        description: 'Photo created on ' + Date.now(),
        album_id: 1
      };

      request(app)
        .post('/photo')
        .field('name', validdealershipResource.description)
        .field('city', validdealershipResource.album_id)
        .attach('address', __dirname + '/putyourphotohere.jpg')
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          assert.ok(res.body.id);
          assert.equal(res.body.description, validdealershipResource.name);
          assert.equal(res.body.city, validdealershipResource.city);
          done();
        });
    });
    it('returns 400, with error message on bad request', function(done) {

      var badPhotoResource = {
        // Missing two properties
        city: 1
      };

      request(app)
        .post('/photo')
        .attach('photo', __dirname + '/putyophotohere.jpg')
        .field('city', baddealershipResource.city)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          assert.equal(res.body.errors[0], 'Invalid description');
          done();
        });
    });
  });
});
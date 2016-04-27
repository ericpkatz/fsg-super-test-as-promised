// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest-as-promised');
var app = require('../../../server/app');
var agent = supertest.agent(app);

describe('Members Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Authenticated request', function () {

		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
		};

		beforeEach('Create a user', function (done) {
			User.create(userInfo, done);
		});


		it('should get with 200 response and with an array as the body', function () {
			return agent.post('/login')
        .send(userInfo)
        .expect(200)
        .then(function(){
          return agent.get('/api/members/secret-stash')
                    .expect(200);
        })
        .then(function(response){
          expect(response.body.length).to.equal(11);
        });
		});

	});

	describe('Unauthenticated request', function () {

		it('should get a 401 response', function () {
			return agent.get('/api/members/secret-stash')
				.expect(401);
		});

	});


});

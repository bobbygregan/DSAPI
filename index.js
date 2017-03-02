var express = require('express');
var bodyParser = require('body-parser');
// var expressValidator = require('express-validator');
// var multer  = require('multer');
var jwt    = require('jsonwebtoken');
var app = express();

app.use(bodyParser.json({ type: 'application/json' }));
// app.use(expressValidator());
app.set('views', './views');
app.set('view engine', 'ejs');
app.set('tokenSecret', 'itsamysecret');
var postgres = require('./lib/postgres');

function lookupdealership(req, res, next) {
  var dealershipId = req.params.id;
  var sql = 'SELECT * FROM dealership WHERE id = $1';
  postgres.client.query(sql, [ dealershipId ], function(err, results) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({ errors: ['Could not retrieve dealership'] });
    }
    if (results.rows.length === 0) {
      res.statusCode = 404;
      return res.json({ errors: ['dealership not found']});
    }

    req.dealership = results.rows[0];
    next();
  });
}

function validatedealership(req, res, next) {
  if (!req.files.photo) {
    res.statusCode = 400;
    return res.json({
      errors: ['File failed to upload']
    });
  }
  if (req.files.photo.truncated) {
    res.statusCode = 400;
    return res.json({
      errors: ['File too large']
    });
  }
  

  req.checkBody('dealership', 'Invalid description').notEmpty();
  req.checkBody('city', 'Invalid city').isNumeric();

  var errors = req.validationErrors();
  if (errors) {
    var response = { errors: [] };
    errors.forEach(function(err) {
      response.errors.push(err.msg);
    });

    res.statusCode = 400;
    return res.json(response);
  }

  return next();
}

function lookupuser(req, res, next) {
	  var userId = req.params.id;
	  console.log(userId)
	  var sql = 'SELECT * FROM users WHERE id = $1';
	  postgres.client.query(sql, [ userId ], function(err, results) {
	    if (err) {
	      console.error(err);
	      res.statusCode = 500;
	      return res.json({ errors: ['Could not retrieve user'] });
	    }
	    if (results.rows.length === 0) {
	      res.statusCode = 404;
	      return res.json({ errors: ['user not found']});
	    }

	    req.user = results.rows[0];
	    next();
	  });
	}

	function lookupusedcar(req, res, next) {
	  var usedcarId = req.params.id;
	  console.log(usedcarId)
	  var sql = 'SELECT * FROM used_cars WHERE id = $1';
	  postgres.client.query(sql, [ usedcarId ], function(err, results) {
	    if (err) {
	      console.error(err);
	      res.statusCode = 500;
	      return res.json({ errors: ['Could not retrieve usedcar'] });
	    }
	    if (results.rows.length === 0) {
	      res.statusCode = 404;
	      return res.json({ errors: ['usedcar not found']});
	    }

	    req.usedcar = results.rows[0];
	    next();
	  });
	}

var checktoken=function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode the token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('tokenSecret'), function(err, decoded) {      
			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} 
			else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});

	} 
	else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});

	}
}

var dealershipRouter = express.Router();

dealershipRouter.get('/', function(req, res) {
  var page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  var limit = parseInt(req.query.limit, 10);
  if (isNaN(limit)) {
    limit = 10;
  } else if (limit > 50) {
    limit = 50;
  } else if (limit < 1) {
    limit = 1;
  }

  var sql = 'SELECT count(1) FROM dealership';
  postgres.client.query(sql, function(err, result) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({
        errors: ['Could not retrieve dealerships']
      });
    }

    var count = parseInt(result.rows[0].count, 10);
    var offset = (page - 1) * limit;
      sql = 'SELECT * FROM dealership OFFSET $1 LIMIT $2';
    postgres.client.query(sql, [offset, limit], function(err, result) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not retrieve dealerships']
        });
      }

      return res.json(result.rows);
    });
  });
});

// dealershipRouter.post('/', multer({
//   dest: './dealership/',
//   rename: function(field, filename) {
//     filename = filename.replace(/\W+/g, '-').toLowerCase();
//     return filename + '_' + Date.now();
//   },
//   limits: {
//     files: 1,
//     fileSize: 2 * 1024 * 1024,
//   }


dealershipRouter.post('/', function(req, res) {
  var sql = 'INSERT INTO dealership (city, name, address) VALUES ($1,$2,$3) RETURNING id';
  var data = [
    req.body.city,
    req.body.name,
    req.body.address
  ];
  postgres.client.query(sql, data, function(err, result) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({
        errors: ['Could not create dealership']
      });
    }

    var dealershipId = result.rows[0].id;
    var sql = 'SELECT * FROM dealership WHERE id = $1';
    postgres.client.query(sql, [ dealershipId ], function(err, result) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ['Could not retrieve dealership after create'] });
      }
      res.json({
					success: true,
					message: 'Login Successful',
					token: token
				});

      res.statusCode = 201;
      res.json(result.rows[0]);
    });
  });
});


dealershipRouter.get('/:id([0-9]+)', lookupdealership, function(req, res) {
  res.json(req.dealership);
});



dealershipRouter.patch('/:id([0-9]+)', function(req, res) {
	res.json(req.dealership);


});
// userRouter.get('/:id([0-9]+)', lookupuser, function(req, res) {
//   res.json(req.user);
// });

app.use('/dealership', dealershipRouter);

var userRouter = express.Router();
userRouter.post('/', function(req, res) {

	var sql = 'INSERT INTO users (name, email, pswd) VALUES ($1,$2,$3) RETURNING id';
	var data = [
		req.body.name,
		req.body.email,
		req.body.pswd
	];

	postgres.client.query(sql, data, function(err, result) {
		if (err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({
				errors: ['Could not create users']
			});
		}

		var usersId = result.rows[0].id;
		var sql = 'SELECT * FROM users WHERE id = $1';
		postgres.client.query(sql, [ usersId ], function(err, result) {
			if (err) {
				console.error(err);
				res.statusCode = 500;
				return res.json({ errors: ['Could not retrieve usere after create'] });
			}

			var token = jwt.sign(result, app.get('tokenSecret'), {
			expiresIn: "1d" // expires in 1 day
		});

			res.statusCode = 201;
			res.json({
					success: true,
					message: 'Login Successful',
					token: token
			});

			
		});
	});
});

userRouter.post('/login', function(req, res) {

	// find the user
	var sql = 'SELECT * FROM users WHERE email = $1';
		postgres.client.query(sql, [ req.body.email], function(err, user) {
		if (err) { 
			throw err;
		}

		if (!user) {
			res.json({success: false, message: 'User not found.'});
		} 
		else if (user) {

			// check if password matches
			if (user.rows[0].pswd != req.body.password) {
				console.log(user)
				console.log(req.body.password)
				res.json({ success: false, message: 'Wrong password.' });
			} 
			else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user.rows[0], app.get('tokenSecret'), {
					expiresIn: "1d" // expires in 1 day
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Login Successful',
					token: token
				});
			}   

		}

	});
});
userRouter.use(checktoken);

userRouter.get('/:id([0-9]+)', lookupuser, function(req, res) {
  res.json(req.user);
});


// userRouter.patch('/:id([0-9]+)', function(req, res) {
// 	res.json(req.user);
// });

app.use('/user', userRouter);


var usedcarRouter = express.Router();

usedcarRouter.get('/', function(req, res) {
  var page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  var limit = parseInt(req.query.limit, 10);
  if (isNaN(limit)) {
    limit = 10;
  } else if (limit > 50) {
    limit = 50;
  } else if (limit < 1) {
    limit = 1;
  }

  var sql = 'SELECT count(1) FROM used_cars';
  postgres.client.query(sql, function(err, result) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({
        errors: ['Could not retrieve usedcar']
      });
    }

    var count = parseInt(result.rows[0].count, 10);
    var offset = (page - 1) * limit;
      sql = 'SELECT * FROM used_cars OFFSET $1 LIMIT $2';
    postgres.client.query(sql, [offset, limit], function(err, result) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({
          errors: ['Could not retrieve usedcar']
        });
      }

      return res.json(result.rows);
    });
  });
});


usedcarRouter.get('/:id([0-9]+)', lookupusedcar, function(req, res) {
  res.json(req.usedcar);
});


usedcarRouter.use(checktoken);

usedcarRouter.patch('/:id([0-9]+)', lookupusedcar, function(req, res) {
  var sql = 'UPDATE used_cars SET year=$1, km=$2, price=$3, model=$4 where id='+req.params.id+';';
  var data = [
    req.body.year,
    req.body.km,
    req.body.price,
    req.body.model
  ];
  console.log(sql)
  console.log(data)
  postgres.client.query(sql, data, function(err, result) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({
        errors: ['Could not update usedcar']
      });
    }

    var usedcarId = req.params.id;
    var sql = 'SELECT * FROM used_cars WHERE id = $1';
    postgres.client.query(sql, [usedcarId ], function(err, result) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ['Could not retrieve usedcar after create'] });
      }

      res.statusCode = 201;
      res.json(result.rows[0]);
    });
  });
});

usedcarRouter.post('/', function(req, res) {
	console.log(req.decoded)
  var sql = 'INSERT INTO used_cars (user_id,year, km, price, model) VALUES ($1,$2,$3,$4,$5) RETURNING id';
  var data = [
  req.decoded.id,
    req.body.year,
    req.body.km,
    req.body.price,
    req.body.model
  ];
  postgres.client.query(sql, data, function(err, result) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({
        errors: ['Could not create usedcar']
      });
    }

    var usedcarId = result.rows[0].id;
    var sql = 'SELECT * FROM used_cars WHERE id = $1';
    postgres.client.query(sql, [usedcarId ], function(err, result) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ['Could not retrieve usedcar after create'] });
      }

      res.statusCode = 201;
      res.json(result.rows[0]);
    });
  });
});



// usedcarRouter.get('/', function(req, res) {
//   res.render('form');
// });


app.use('/cars', usedcarRouter);


module.exports = app;
var express = require('express');
var bodyParser = require('body-parser');
var nedb = require('nedb');
var app = express();

    app.use(bodyParser.json()); // see: http://expressjs.com/api.html#req.body

    app.use(bodyParser.urlencoded({
        extended: true
    }));

quotes = new nedb({ filename: 'quotes.db', autoload: true, timestampData: true});
//quotes.insert({ _id : '1', author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"});
//quotes.insert({ _id : '2', author : 'Yayo', text : "Action before motivation"});

app.get('/', function(req, res) {
  quotes.count({}, function (err, count) {
    res.json(count);
  });
});

app.get('/quotes', function(req, res) {
  quotes.find({}, function (err, docs) {
    if (docs.length > 0) {
    res.json(docs);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No quotes found');
  }
  });

});

app.get('/quote/random', function(req, res) {
  var id = Math.floor(Math.random() * quotes.length);
  var q = quotes[id];
  res.json(q);
});

app.get('/quote/:id', function(req, res) {
  // if(quotes.length <= req.params.id || req.params.id < 0) {
  if(req.params.id < 1) {
    res.statusCode = 412;
    return res.send('Error 412: Invalid ID');
  }

  quotes.findOne({ "_id": req.params.id }, function (err, doc) {
    if (doc != null) {
    res.json(doc);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: id not found');
  }
  });

});

app.post('/quote', function(req, res) {
  /*
  if(!req.body.hasOwnProperty('author')
  || !req.body.hasOwnProperty('text')
  || !req.body.hasOwnProperty('_id')
  ) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
  */
console.log(req.body);
  var newQuote = {
    _id : req.body._id,
    author : req.body.author,
    text : req.body.text
  };

  quotes.insert([newQuote], function (err, newDocs) {
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id
  });
  res.json(true);
});

app.delete('/quote/:id', function(req, res) {
  if(req.params.id < 1) {
    res.statusCode = 412;
    return res.send('Error 412: Invalid ID');
  }

  quotes.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
    // numRemoved = 1
  });
  res.json(true);
});

app.listen(process.env.PORT || 3412);

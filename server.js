var express = require('express');
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';
var app = express();
var response;

app.get('/', function(req, res) {
  var index = parseInt(req.query.quote, 10);
  response = res;
  if( isNaN(index) ) 
    response.send(400);
  else 
    quoteIndex(index);
});

function quoteIndex(index) {
  
  mongo.connect(url, function(err, db) {
    if(err) {
      console.error(err);
      response.send(500);
      db.close();
    } else {
      var quotes = db.collection('quotes');
      var cursor = quotes.find();
      
      cursor.toArray(function(err, doc) {
        if(err) {
          console.log(err);
          response.send(500);
        } else {
          response.send( itemJson(doc, index) );
        }
        db.close();
      });
    }
  });

}

function itemJson(doc, index) {
  if(index > (doc.length-1) || index === 0)
    return(400);

  var obj = {};
  obj.quote = doc[index-1].quote;
  obj.author = doc[index-1].author;
  obj.year = doc[index-1].year;
  return JSON.stringify(obj, null, 4);
}

app.listen(8080);


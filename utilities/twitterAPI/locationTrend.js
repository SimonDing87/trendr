var _ = require('underscore');
var Twitter = require('twitter');
var utilities = require('../shared/shared');

/*************************************************************
Twitter Config
All of these process variables live in .env
**************************************************************/

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


/*************************************************************
GET trends/place
Endpoint returns the trending hashtags for a specified WOEID within a 24 hour time frame.

**************************************************************/

// specify id (WOEID) for each city then make a get request to the end point.
// These are stored on my local DB atm (Simon).
// Be careful not to call this same location twice or it will duplicate data in the DB.
// Maybe need to figure out how to prevent this.

// var params = {id: 2487956}; // San Francisco
// var params = {id: 2379574}; // Chicago


var paramArray = [{
      id: 2487956 //sf
    //chicago {id: 2379574}, 
    }
]


exports.returnTrendByCity = function(callback) {
  // this for loop was to populate db with all locations listed above, making an api call to each location id
  for (var i = 0; i < paramArray.length; i++) {
    var params = paramArray[i];

    client.get('trends/place', params, function(error, tweets, response) {
      if (error) {
        console.log('ERROR OCCURED', error);
        throw error;
      }

      var apiArr = tweets;

      for (var i = 0; i < apiArr[0].trends.length; i++) {
        if (apiArr[0].trends[i].tweet_volume) {
          new LocationTrend({
              location: apiArr[0].locations[0].name,
              trend_name: apiArr[0].trends[i].name,
              tweet_volume: apiArr[0].trends[i].tweet_volume,
              created_at: apiArr[0].created_at

          })
          .save(function(err) {
            if (err) {
              throw err;
            }
            console.log('trend saved to db!');
          });
        }
      }
      res.status(200); // need to comment these out if you want to loop through several api calls to populate db
      res.send(tweets); // 

    });

  } // end for loop bracket
};




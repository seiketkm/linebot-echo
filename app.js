const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const line = require('./line');
const _ = require('lodash');
const app = express();

app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/callback', (req, res)=>{
    console.log('hoge');
    res.end();
});

app.post('/callback', (req, res) => {
    //受信
    console.log("post routed");
    console.log(req.body);
    _.each(req.body.result, (recvmsg) => {
	//応答
	const header = _.defaults(line, {
	    "Content-Type": 'application/json; charset=UTF-8'
	});
	const sendmsg = {
	    'to': [recvmsg.from],
	    'toChannel': 1383378250, //FixedValue
            'eventType': '138311608800106203', //FixedValue
	    'content'  : {
		"contentType":1, //TextMessageType
		"toType":1, // User
		"text": recvmsg.content.text
	    }
	};
	const options = {
	    url: 'https://trialbot-api.line.me/v1/events',
            headers: header,
            json: true,
            body: sendmsg
	}
    });
    request.post(options, function (err, response, body) {
        if (err) {
            console.log(err);
        }
        console.log(body);
    });

    res.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({});
});


module.exports = app;

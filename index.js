var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var csvjson = require('csvjson');
var port = 3000;

var app = express();

// use to parse the JSON, buffer, string and URL encoded data submitted using HTTP POST request
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));

//  to use the absolute path of the directory that you want to serve as a part of public folder:
app.use(express.static(path.join(__dirname, 'public')));

// specify the engine or load the template engine module in your app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use response.render to load up an ejs view file
app.get('/',function(request, response)
{
    var data = fs.readFileSync('documents/prfrun.csv', { encoding : 'utf8'});
    var options = {
        delimiter : ',', 
        quote     : '"',
    };
    var records = csvjson.toSchemaObject(data, options);
    if (records.length > 0) { 
        // Fetch the first row of the data as the header data and we will use it as column name of the Table
        var headers = Object.keys(records[0]);
    }
    else{
        var headers = [];
    }
    response.render('index',
        { 
            records: records,
            headers : headers,
            title : 'prfrun.csv'
        }
    ); 
});

// To show the 404 error
app.use(function (request, response, next) {
    response.render('404', { url : request.url})
});

// listen the application on defined port    
app.listen(process.env.PORT || port, function (err, result) { 
    console.log("Project successfully deployed on port - ",port);
});

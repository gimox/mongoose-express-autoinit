#Mongoose express autoinit
--------------------------------------

This package help you to initialize mongoose and load models, with on click with express 4.


It add all necessary code to manage mongoose:

- initialize it
- auto load models from yours models directory
- add basic events
- print  startup info in console



#Initialize the components

in your app.js file

```
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoAutoInit = require('mongoose-express-autoinit');


... your app code here


var mongoConfig = {
	connection: "http://localhost:27017/mycollection",
	models: "./models"
};

mongoAutoInit.start(app, mongoConfig, mongoose); // this is important!!


```

mongoose params is optionals, so the library check if is passed and initilize it if not found returning mongoose object


#initialize without mongoose

```
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoAutoInit = require('mongoose-express-autoinit');


... your app code here


var mongoConfig = {
	connection: "http://localhost:27017/mycollection",
	models: "./models"
};

var mongoose = mongoAutoInit.start(app, mongoConfig); // this is important!!

```


#Working with models


The component search in models folder and autoload all models by file.

The models name is the filename.

A simple example for user, ./models/users.js

```
module.exports = function (mongoose,app) {

 var schema = new mongoose.Schema({
 		  username : String,
 		  password: String,
    });


 return schema;

```

Now we have a user models and we can call it in controller/middleware

```
var User = mongoose.model('user');
```



#TIPS
if you init componentw without pass mongoose, it initialize it for you and return mongoose. It add mongoose as a app variable.
So now if you have app, you can get mongoose and models


```
function resetPassword(req, res) {

 var app = req.app
        , mongoose = app.get('mongoose')
        , Users = mongoose.model('users');

        ...
}
```
/**
 * init mongoose
 * search on models folder and init it
 *
 * if mongoose is not passed as params it initialize it and return
 *
 * @param app
 * @param mongoose
 * @param config
 * @returns {*} mongoose object
 */
exports.start = function (app, config, mongoose) {

    if (!config) {
        console.log('Error initializing mongo, please set config params (2 params) with object.models and object.connection');
        return;
    }

    if (!config.hasOwnProperty(('connection'))) {
        console.log('Error, initizializing mongo, please add params object.connection');
    }

    if (!config.hasOwnProperty(('models'))) {
        config.models = "./models";
    }


    if (mongoose == null) {
        mongoose = require('mongoose');
        app.set('mongoose', mongoose);
    }

    var path = require('path')
        , autoload = require('./loadmodel.js')
        , modelPath = path.join(process.cwd(), config.models)
        , modelLoaded = autoload.load(mongoose, modelPath, false, app);


    mongoose.connect(config.connection);

    mongoose.connection.on('connected', function () {
        console.info('\x1b[32m_______________________________________________________________\x1b[0m');
        console.info(':: Mongo DB - start info log');
        console.log(' ');
        console.info('\x1b[32m*\x1b[0m URL:\x1b[0m' + config.connection);

        for (var i = 0; i < modelLoaded.length; i++) {
            console.info('\x1b[32m* \x1b[0mModel: \x1b[35m' + modelLoaded[i] + '\x1b[0m');
        }
        console.info('\x1b[32m_______________________________________________________________\x1b[0m');
        console.info('');
    });

    mongoose.connection.on('error', console.error.bind(console, '\x1b[31m* MONGODB CONNECTION ERROR\x1b[0m'));

    mongoose.connection.on('disconnected', console.error.bind(console, '\x1b[31m* MONGODB DISCONNECTED\x1b[0m'));

    mongoose.connection.on('reconnected', console.error.bind(console, '\x1b[32m* MONGODB RECONNECTED\x1b[0m'));

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    return mongoose;

};
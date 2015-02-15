exports.load = function (mongoose, loadPath, recursive,app) {
    var fs = require('fs')
        , path = require('path')
        , modelName = [];

    if (!mongoose) {
        mongoose = require('mongoose');
    }

    mongoose.models = {};

    if (!loadPath) {
        loadPath = './models';
    }

    var walk = function (dir) {
        var results = [];
        var list = fs.readdirSync(dir);
        list.forEach(function (file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) results = results.concat(walk(file));
            else results.push(file)
        });
        return results;
    };

    var files = [];
    if (!recursive) {
        files = fs.readdirSync(loadPath);
    } else {
        files = walk(loadPath);
    }

    var models = {};

    for (var i in files) {

        var file = '';
        if (!recursive) {
            file = path.resolve(loadPath, files[i]);
        } else {
            file = path.resolve(files[i]);
        }

        if (fs.statSync(file).isFile()) {

            var name = path.basename(file);
            name = name.replace('.js', '');
            mongoose.models[name] = mongoose.model(name, require(file)(mongoose,app));

            modelName.push(name);
        }

    }

    return modelName;
};
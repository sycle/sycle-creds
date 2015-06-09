'use strict';

var chai = require('chai');
var async = require('async');
var _ = require('lodash');
var sycle = require('sycle');
chai.config.includeStack = true;

exports.t = exports.assert = chai.assert;

exports.donner = function donner(n, func) {
    if (n < 1) {
        return func();
    }
    return function (err) {
        if (err) {
            throw err;
        }
        if (--n < 1) {
            func(err ? err : null);
        }
    };
};

exports.morkApplication = function (options) {
    options = options || {};
    options.db = options.db || {
        driver: 'redis-hq'
    };

    var sapp = sycle({ loadBuiltinModels: true });
    sapp.setAll(options);
    sapp.phase(sycle.boot.module('./'));
    sapp.phase(sycle.boot.database(options.db));
    sapp.phase(sycle.authorizer);
    return sapp;
};

exports.cleanup = function (sappOrModels, done) {
    var models = sappOrModels;
    if (sappOrModels.models) {
        models = _.values(sappOrModels.models);
    } else if (!(Array.isArray(sappOrModels))) {
        models = [sappOrModels];
    }

    done = done || function () {
    };

    async.eachSeries(models, function (Model, callback) {
        Model.destroyAll(callback);
    }, done);
};

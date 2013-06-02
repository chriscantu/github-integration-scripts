var Q = require('Q'), rest = require('restler'), _ = require('lodash');
var config = require('./configuration.js').config;

var branchName = process.argv[2];  //THE BRANCH NAME MUST BE INCLUDED AS AN ARGUMENT

return Q.fcall( function () {
    console.log("Creating Pull Request for branch '" + branchName + "'");

    var defer = Q.defer(), data = {
        "title": branchName,
        "head":  branchName,
        "base": "master"
    }, json = JSON.stringify(data);

    rest.post('https://api.github.com/repos/' + config.owner + '/' + config.repoName + '/pulls',
            { headers: config.theHeaders, data: json }
        ).on('success', function (data) {
        defer.resolve(data);
        console.log("Success: Created a new Pull Request for branch: '" + branchName + "'");
    }).on('fail', function (error) {
        console.log(error)
        defer.reject(error);
    });

	return defer.promise;
}).done();
var Q = require('Q');
var config = require('./configuration.js').config;

var rest = require('restler');
var branchName = process.argv[2];  //THE BRANCH NAME MUST BE INCLUDED AS AN ARGUMENT

return Q.fcall(function () {
	console.log("Retrieving Commits")
	
	var defer = Q.defer();

	rest.get('https://api.github.com/repos/' + config.owner + '/' + config.repoName + '/commits', 
			{ headers: config.theHeaders }
		).on('success', function (data) {
			defer.resolve(data);
		}).on('fail', function (error) {
			defer.reject(error);
		});
	return defer.promise;

}).then( function (commits) {
	var lastCommit = commits[0];
	var ref = "refs/heads/" + branchName;
    var data = JSON.stringify({ref: ref, sha: lastCommit.sha });

    rest.post('https://api.github.com/repos/' + config.owner + '/' + config.repoName + '/git/refs', {
    	headers: config.theHeaders, 
    	data: data
    }).on('success', function (data){
    	console.log("Branch '" + branchName + "' Created");
    }).on('fail', function (error){	
    	console.log("Error creating branch");
    });
});
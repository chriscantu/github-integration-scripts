var Q = require('Q'), rest = require('restler'), _ = require('lodash');
var config = require('./configuration.js').config;

var branchName = process.argv[2];  //THE BRANCH NAME MUST BE INCLUDED AS AN ARGUMENT

return Q.fcall(function () {
	console.log("Retrieving Commits");

	var defer = Q.defer();
	rest.get('https://api.github.com/repos/' + config.owner + '/' + config.repoName + '/pulls', 
			{ headers: config.theHeaders})
		.on('success', function(data) { defer.resolve(data) })
		.on('fail', function(error) { defer.reject(error) });

	return defer.promise;
}).then( function (pulls){	
	for(var i = 0; i <= pulls.length; i++){
		if ( pulls[i].head.ref == branchName ) {
			return pulls[i];
		}
	}
}).then( function (pull) {
	var defer = Q.defer();

	rest.get(pull.url, { headers: config.theHeaders })
		.on('success', function (data){
			var request = { mergeable: data.mergeable, pull.url }
			defer.resolve(request);
		})
		.on('fail', function (error){
			defer.reject(error);
		});
	
	return defer.promise;
}).then( function (request){
	if (request.mergeable) {
		rest.post(request.url, { 
				headers: config.theHeaders, 
				data: { 'commit_message': 'Automatically Merged' }
			}).on('success', function (data) {
				console.log("Branch name: '" + branchName + "' merged." );
			}).on('fail', function (error){
				throw "Unable to merge branch: '" + branchName + "' due to error: " + error.message;
			});
	} else {
		throw "!!! Branch '" + branchName + "' is not mergeable !!!";
	}
})
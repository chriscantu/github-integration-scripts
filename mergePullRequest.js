var Q = require('Q'), rest = require('restler');
var config = require('./configuration.js').config;

var branchName = process.argv[2];  //THE BRANCH NAME MUST BE INCLUDED AS AN ARGUMENT

return Q.fcall(function () {
	console.log("Retrieving Pull Requests");

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
			console.log('Retrieved detailed pull request');
			var request = { mergeable: data.mergeable, url: pull.url }
			defer.resolve(request);
		})
		.on('fail', function (error){
			defer.reject(error);
		});
	
	return defer.promise;
}).then( function (request){
	if (request.mergeable) {
		rest.put(request.url + "/merge" , { 
				headers: config.theHeaders, 
				data: JSON.stringify({ 'commit_message': 'Automatically Merged' })
			}).on('success', function (data) {
				console.log("Branch name: '" + branchName + "' merged." );
			}).on('fail', function (error){				
				console.log("Unable to merge branch: '" + branchName + "' due to error: " + error.message);
			});
	} else {
		console.log("!!! Branch '" + branchName + "' is not mergeable !!!");
	}
});
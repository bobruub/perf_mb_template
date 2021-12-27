# perf_sven_gamstop

## Using Mountebank

The following is the way I personally use mountebank to process requests.

The approach is to seperate functions into different configuration files and have it be completely standalone.
This makes it easier to build and debug code issues.

Repo contains a complete copy of mountebank so it can be run standalone.

Also contains a K6 script k6_template_test.js which will test all functions.

| Function  | File  | Purpose |
| :------------ |:---------------:| -----:|
| Stub Configuration | imposters.ejs | sets up the technical configuration |
| Stub Control | template/template_control.ejs | sets up rules (predicates) |
| Stub Details | <function>.ejs | multiple files based on Stub Control (responses) |


Mountebank Execution:
```
node ./mountebank/bin/mb --configfile imposters.ejs --allowInjection --port 12003 --logfile mb_sven.log
```

Example Stub Configuration **imposters.ejs**

```
{
  "port": 2525,
  "protocol": "http",
  "recordRequests": true,
  "name": "**-- VSE -- 2525 --**",
  "stubs": [
      <% include template//imposters.ejs %>
   ]
}
```
Example Stub Control **template/template_control.ejs**
```
<%# -------------------------------------------------------------------- %>
<%# ShowME Page for connectivity debugging                               %>
<%# e.g. http://localhost:2525/showme                                    %>
<%# -------------------------------------------------------------------- %>
	{
    "responses": [{
        "inject": "<%- stringify(filename, 'template//showme.ejs') %>",
	    "_behaviors": {"wait": "function() { return Math.floor(Math.random() * 25) + 50; }"}
	  }],
    "predicates":[{
        "contains": { "path": "showme" }
    }]
	},
<%# -------------------------------------------------------------------- %>
<%# Default no other match                                               %>
<%# -------------------------------------------------------------------- %>
	{
	    "responses": [{
	        "inject": "<%- stringify(filename, 'template//default.ejs') %>",
	  	    "_behaviors": { "wait": "function() { return Math.floor(Math.random() * 100) + 100; }"}
	    }],
        "predicates":[{
            "contains": { "path": "/" }
	    }]
    }
```
Example Stub Details **template/showme.ejs**
```
function (request, state, logger) {
logger.info('Show Me Debugging');

return {
		headers: {
			'Content-Type': 'text/html',
			'Connection': 'Keep-Alive'
		},
		body:
"<!DOCTYPE html><html><body><h1>TEMPLATE TEST STUB - showme test page</h1></body></html>"
	 };
}
```
Example Stub Details **template/default.ejs**
```
function (request, state, logger) {
	logger.info('Received a DEFAULT Request.');
  var response = "TEMPLATE STUB - 404 Not Found";

	return {
		statusCode: 404,
		headers: {
				'Connection': 'Keep-Alive'
			},
			body: response
			};
}
```
